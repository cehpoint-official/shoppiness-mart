import { useState } from "react";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import headerLogo from "../../assets/header-logo.png";
import {
  doc,
  runTransaction,
  query,
  getDocs,
  collection,
  where,
  setDoc,
  addDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../../../../firebase";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const InvoiceUpdate = ({ updatedData, back }) => {
  const { user } = useSelector((state) => state.businessUserReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [localDueAmount, setLocalDueAmount] = useState(updatedData.dueAmount);

  // Generate PDF from invoice content
  const generatePdf = async (elementId) => {
    try {
      const invoiceContent = document.getElementById(elementId);
      if (!invoiceContent) throw new Error("Invoice content not found");

      const canvas = await html2canvas(invoiceContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({ compress: true, unit: "mm", format: "a4" });

      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF");
    }
  };

  // Generate PDF Blob with size optimization
  const generatePdfBlob = async () => {
    try {
      const pdf = await generatePdf("invoice-content");
      const blob = pdf.output("blob");

      if (blob.size > 500000) {
        // If file size is too large, regenerate with lower quality
        const invoiceContent = document.getElementById("invoice-content");
        const canvas = await html2canvas(invoiceContent, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.8); // Lower quality
        const pdf = new jsPDF({ compress: true, unit: "mm", format: "a4" });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );

        return pdf.output("blob");
      }

      return blob;
    } catch (error) {
      console.error("Error generating PDF Blob:", error);
      throw error;
    }
  };

  // Upload PDF to Firebase Storage
  const uploadPdf = async (file) => {
    const metadata = { contentType: "application/pdf" };
    const storageRef = ref(storage, `invoices/${updatedData.invoiceNum}.pdf`);

    try {
      // Delete existing PDF if it exists
      const existingFileRef = ref(
        storage,
        `invoices/${updatedData.invoiceNum}.pdf`
      );
      try {
        await deleteObject(existingFileRef);
        console.log("Previous PDF deleted successfully.");
      } catch (deleteError) {
        if (deleteError.code !== "storage/object-not-found") {
          console.error("Error deleting previous PDF:", deleteError);
        }
      }

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error during PDF upload:", error);
      throw error;
    }
  };

  // Calculate cashback and earnings
  const calculateCashbackAndEarnings = (
    grandTotal,
    cashCollected,
    userCashbackPercentage,
    platformEarningsPercentage
  ) => {
    // Validate inputs
    if (!grandTotal || grandTotal <= 0) {
      return { platformCashback: 0, userCashback: 0, remainingCashback: 0 };
    }

    try {
      // For online shop, ensure exactly 50/50 split
      // Total commission percentage is the sum of both percentages
      const totalCommissionPercentage =
        userCashbackPercentage + platformEarningsPercentage;

      // Enforce 50/50 split for online shops
      const adjustedUserPercentage = totalCommissionPercentage / 2;
      const adjustedPlatformPercentage = totalCommissionPercentage / 2;

      // Calculate the total cashback amounts based on the grand total
      const totalUserCashback = Number(
        ((adjustedUserPercentage / 100) * grandTotal).toFixed(2)
      );
      const platformCashback = Number(
        ((adjustedPlatformPercentage / 100) * grandTotal).toFixed(2)
      );

      // Calculate how much of the invoice has been paid
      const paymentPercentage = (cashCollected / grandTotal) * 100;

      let userCashback, remainingCashback;

      // Distribute user cashback based on payment status
      if (paymentPercentage <= 0) {
        // Nothing paid, no cashback for user
        userCashback = 0;
        remainingCashback = totalUserCashback;
      } else if (paymentPercentage >= 100) {
        // Fully paid, full cashback for user
        userCashback = totalUserCashback;
        remainingCashback = 0;
      } else {
        // Partially paid, proportional cashback
        userCashback = Number(
          ((totalUserCashback * paymentPercentage) / 100).toFixed(2)
        );
        remainingCashback = Number(
          (totalUserCashback - userCashback).toFixed(2)
        );
      }

      return { platformCashback, userCashback, remainingCashback };
    } catch (error) {
      console.error("Error calculating cashback:", error);
      return { platformCashback: 0, userCashback: 0, remainingCashback: 0 };
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Validate required fields
      if (!updatedData.invoiceNum || !updatedData.grandTotal) {
        throw new Error("Missing required invoice data");
      }

      // Pre-check for coupon validation
      const hasCoupon = Boolean(
        updatedData.couponCode && updatedData.customerId && updatedData.couponId
      );

      // Generate and upload new PDF
      const pdfBlob = await generatePdfBlob();
      const pdfUrl = await uploadPdf(pdfBlob);

      // Prepare base invoice data
      const baseUpdateData = {
        ...updatedData,
        pdfUrl,
        updatedAt: formatDate(new Date()),
      };

      // Initialize transaction variables
      let updatedInvoice = { ...baseUpdateData };
      let platformCashback = 0;
      let userCashback = 0;
      let remainingCashback = 0;

      // Run database transaction
      await runTransaction(db, async (transaction) => {
        // Step 1: Collect all required documents
        const { disputeSnapshot, couponDoc, userDoc, businessDoc } =
          await fetchRequiredDocuments(transaction, updatedData, hasCoupon);

        // Validate coupon if present
        if (hasCoupon) {
          if (!couponDoc?.exists()) {
            throw new Error("Coupon no longer exists");
          }
          if (couponDoc.data().status !== "Pending") {
            throw new Error("Coupon is no longer valid");
          }
        }

        // Step 2: Calculate cashback if coupon exists
        if (hasCoupon) {
          const cashbackResults = calculateCashbackAndEarnings(
            updatedData.grandTotal,
            updatedData.paidAmount,
            updatedData.userCashback,
            updatedData.platformEarnings
          );

          platformCashback = cashbackResults.platformCashback;
          userCashback = cashbackResults.userCashback;
          remainingCashback = cashbackResults.remainingCashback;

          // Enhance invoice with coupon data
          updatedInvoice = {
            ...updatedInvoice,
            claimedCouponCode: updatedData.couponCode,
            claimedCouponCodeUserName: updatedData.customerName,
            discount: updatedData.userCashback,
            userCashbackPercentage: updatedData.userCashback,
            userCashback,
            platformCashback,
            remainingCashback,
            customerId: updatedData.customerId || "",
            claimedDate: formatDate(new Date()),
          };
        }

        // Step 3: Perform all write operations
        await performTransactionWrites({
          transaction,
          disputeSnapshot,
          hasCoupon,
          userDoc,
          couponDoc,
          businessDoc,
          updatedData,
          userCashback,
          platformCashback,
          pdfUrl,
        });
      });
      // Step 5: Handle cause donations if applicable and get the donation ID
      let donationId = null;
      if (Object.keys(updatedData?.causeData || {}).length > 0) {
        donationId = await handleCauseDonation(updatedData, platformCashback);
      }
      // Step 4: Save documents (outside transaction)
      await Promise.all([
        saveInvoiceDetails(updatedInvoice),
        saveUserTransaction(
          updatedData,
          userCashback,
          remainingCashback,
          hasCoupon
        ),
        savePlatformEarnings(
          updatedData,
          platformCashback,
          hasCoupon,
          donationId
        ), // Pass donationId here
      ]);

      // Step 6: Send notifications
      await Promise.all([
        sendAdminNotification(updatedData),
        sendUserNotification(updatedData, userCashback, pdfUrl),
      ]);

      toast.success("Invoice Updated, Coupon claimed, and Admin notified!");
      setLocalDueAmount(0);
      back();
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error(error.message || "Failed to save invoice.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const fetchRequiredDocuments = async (
    transaction,
    updatedData,
    hasCoupon
  ) => {
    // Fetch dispute documents
    const disputeQuery = query(
      collection(db, "cashbackDisputeRequests"),
      where("shopId", "==", updatedData.businessId),
      where("couponCode", "==", updatedData.couponCode)
    );
    const disputeSnapshot = await getDocs(disputeQuery);

    // Fetch coupon document if needed
    let couponDoc;
    if (hasCoupon) {
      const couponRef = doc(db, "coupons", updatedData.couponId);
      couponDoc = await transaction.get(couponRef);
    }

    // Fetch user document if needed
    let userDoc;
    if (updatedData.customerId) {
      const userRef = doc(db, "users", updatedData.customerId);
      userDoc = await transaction.get(userRef);
    }

    // Fetch business document if needed
    let businessDoc;
    if (updatedData.businessId) {
      const businessRef = doc(db, "businessDetails", updatedData.businessId);
      businessDoc = await transaction.get(businessRef);
    }

    return { disputeSnapshot, couponDoc, userDoc, businessDoc };
  };

  const performTransactionWrites = async ({
    transaction,
    disputeSnapshot,
    hasCoupon,
    userDoc,
    couponDoc,
    businessDoc,
    updatedData,
    userCashback,
    platformCashback,
    pdfUrl,
  }) => {
    // Update dispute status if exists
    if (!disputeSnapshot.empty) {
      const disputeDoc = disputeSnapshot.docs[0];
      transaction.update(doc(db, "cashbackDisputeRequests", disputeDoc.id), {
        status: "Resolved",
        invoiceUrl: pdfUrl,
        resolvedAt: formatDate(new Date()),
      });
    }

    // Update user's cashback if applicable
    if (hasCoupon && userDoc?.exists() && userCashback > 0) {
      const currentCashback = userDoc.data().collectedCashback || 0;
      transaction.update(doc(db, "users", updatedData.customerId), {
        collectedCashback: currentCashback + userCashback,
      });
    }

    // Update coupon status if applicable
    if (hasCoupon && couponDoc?.exists()) {
      transaction.update(doc(db, "coupons", updatedData.couponId), {
        status: "Claimed",
        claimedAt: formatDate(new Date()),
      });
    }

    // Update business earnings if applicable
    if (businessDoc?.exists() && platformCashback > 0) {
      const currentTotalDue = businessDoc.data().totalPlatformEarningsDue || 0;
      transaction.update(doc(db, "businessDetails", updatedData.businessId), {
        totalPlatformEarningsDue: currentTotalDue + platformCashback,
      });
    }
  };

  const saveInvoiceDetails = async (invoiceData) => {
    return addDoc(collection(db, "invoiceDetails"), invoiceData);
  };

  const saveUserTransaction = async (
    updatedData,
    userCashback,
    remainingCashback,
    hasCoupon
  ) => {
    const userTransactionData = {
      customerId: updatedData.customerId || "",
      invoiceId: updatedData.invoiceNum,
      couponCode: updatedData.couponCode || "",
      products: updatedData.products || [],
      claimedDate: formatDate(new Date()),
      customerName: updatedData.customerName || "",
      customerEmail: updatedData.email || "",
      discount: updatedData.userCashback || 0,
      userCashbackAmount: userCashback || 0,
      userRemainingCashbackAmount: remainingCashback || 0,
      status: hasCoupon ? "Claimed" : "No Coupon",
    };
    return addDoc(collection(db, "userTransactions"), userTransactionData);
  };

  const savePlatformEarnings = async (
    updatedData,
    platformCashback,
    hasCoupon,
    donationId = null
  ) => {
    const platformEarningsData = {
      customerId: updatedData.customerId || "",
      businessId: updatedData.businessId,
      invoiceId: updatedData.invoiceNum,
      customerName: updatedData.customerName || "",
      customerEmail: updatedData.email || "",
      amountEarned: platformCashback || 0,
      paymentStatus: hasCoupon ? "Pending" : "Not Applicable",
      dueDate: hasCoupon
        ? formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
        : "",
    };

    // Add cause data if it exists
    if (Object.keys(updatedData?.causeData || {}).length > 0) {
      platformEarningsData.causeData = {
        causeName: updatedData?.causeData.causeName || "",
        causeId: updatedData?.causeData.causeId || "",
        paymentDetails: updatedData?.causeData.paymentDetails || null,
        donationTransactionId: donationId, // Add the donation transaction ID here
      };
    }

    return addDoc(collection(db, "platformEarnings"), platformEarningsData);
  };

  const handleCauseDonation = async (updatedData, platformCashback) => {
    try {
      // Add donation transaction and get the reference
      const donationRef = await addDoc(collection(db, "donationTransactions"), {
        causeId: updatedData?.causeData.causeId || "",
        causeName: updatedData?.causeData.causeName || "",
        customerName: updatedData.customerName || "",
        customerEmail: updatedData.email || "",
        amount: platformCashback || 0,
        userProfilePic: updatedData?.userProfilePic || "",
        paymentStatus: "Pending",
        paymentDate: formatDate(new Date()),
      });

      // Add NGO notification
      await addDoc(collection(db, "ngoNotifications"), {
        message: `${updatedData.customerName} with email id ${updatedData.email} has purchased a product to donate to your NGO/Cause. For more details, please check your dashboard.`,
        ngoId: updatedData?.causeData.causeId || "",
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Return the donation transaction document ID
      return donationRef.id;
    } catch (error) {
      console.error("Error handling cause donation:", error);
      throw error;
    }
  };

  const sendAdminNotification = async (updatedData) => {
    const adminEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Invoice Updated</h2>
          <p style="color: #666;">Dear Admin,</p>
          <p style="color: #666;">A new invoice has been updated.</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${
              updatedData.invoiceNum
            }</p>
            <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${
              updatedData.customerName
            }</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ${
              updatedData.totalAmount
            }</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p style="color: #666;">Please review the details.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">Best regards,</p>
            <p style="color: #666; margin: 5px 0;">The ShoppinessMart Team</p>
          </div>
        </div>
      </div>
    `;

    return axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
      email: "admin@shoppinessmart.com",
      title: "ShoppinessMart - Invoice Updated",
      body: adminEmailTemplate,
    });
  };

  const sendUserNotification = async (updatedData, userCashback, pdfUrl) => {
    const userEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Dispute Resolved and Cashback Credited</h2>
          <p style="color: #666;">Dear ${updatedData.customerName},</p>
          <p style="color: #666;">Your dispute request for invoice number <strong>${
            updatedData.invoiceNum
          }</strong> has been resolved successfully.</p>
          <p style="color: #666;">A cashback of <strong>Rs. ${userCashback.toLocaleString()}</strong> has been credited to your account.</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${
              updatedData.invoiceNum
            }</p>
            <p style="margin: 5px 0;"><strong>Cashback Amount:</strong> Rs. ${userCashback.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p style="color: #666;">You can download the updated invoice by clicking the button below:</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${pdfUrl}" style="background-color: #179A56; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Download Invoice
            </a>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">Best regards,</p>
            <p style="color: #666; margin: 5px 0;">The ShoppinessMart Team</p>
          </div>
        </div>
      </div>
    `;

    return axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
      email: updatedData.customerEmail,
      title: "ShoppinessMart - Dispute Resolved and Cashback Credited",
      body: userEmailTemplate,
    });
  };

  // Handle downloading the PDF
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdf = await generatePdf("invoice-content");
      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <div className="print:hidden mx-10 mb-6 flex justify-between items-center">
        <button
          onClick={back}
          className="text-lg flex items-center gap-2"
          aria-label="Go back"
        >
          ← Back
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : null}
            Update
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            {isDownloading ? <FaSpinner className="animate-spin" /> : null}
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div
        id="invoice-content"
        className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img
                src={user.logoUrl}
                alt={user.businessName}
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h2 className="font-semibold">{user.businessName}</h2>
                <p className="text-sm text-gray-600">{user.location}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <div className="w-32">
                  <img
                    src={headerLogo}
                    alt={user.businessName}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">700028,Goa</p>
            </div>
          </div>

          {/* Invoice Title */}
          <div className="text-center py-4">
            <h1 className="text-2xl font-bold">INVOICE</h1>
          </div>

          {/* Bill Details */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-gray-600 mb-1">Bill To</h3>
              <p className="font-medium mb-1">{updatedData.customerName}</p>
              <p className="text-sm text-gray-600 mb-1">Phone No.</p>
              <p className="font-medium">{updatedData.customerPhoneNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Invoice#</p>
              <p className="font-medium">{updatedData.invoiceNum}</p>
              <p className="text-gray-600 mt-2 mb-1">Biller</p>
              <p className="font-medium">{updatedData.billerName}</p>
            </div>
          </div>

          {/* Date Information */}
          <div className="mt-6">
            <table className="w-full">
              <thead className=" bg-[#179A56] text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Invoice Date</th>
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-center">Due date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">{updatedData.billingDate}</td>
                  <td className="py-3 px-4">
                    {new Date().toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {updatedData.dueDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Products Table */}
          <div className="mt-6">
            <table className="w-full">
              <thead className="bg-[#179A56] text-white">
                <tr>
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">Product Name</th>
                  <th className="py-2 px-4 text-center">Qty</th>
                  <th className="py-2 px-4 text-right">Price</th>
                  <th className="py-2 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {updatedData.products.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{index + 1}.</td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 text-center">
                      {product.quantity}X
                    </td>
                    <td className="py-3 px-4 text-right">
                      Rs. {product.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      Rs. {(product.quantity * product.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>Rs. {updatedData.subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax Rate</span>
                <span>{updatedData.taxRate}%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Rs. {updatedData.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-gray-50 py-2 rounded">
                <span>Cash Collected</span>
                <span>Rs. {updatedData.paidAmount.toLocaleString()}</span>
              </div>
              {/* Due Amount Field */}
              <div
                className={`flex justify-between py-2 rounded border-l-4 ${
                  localDueAmount > 0
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-green-500 bg-green-50 text-green-600"
                }`}
              >
                <span>Due Amount</span>
                <span>Rs. {localDueAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cashback Details */}
          <div className="mt-8 bg-orange-50 border border-orange-100 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-medium">Cashback Details: </span>
              Earn {updatedData.userCashback || 0}% cashback at Shopinesmart!
              Visit{" "}
              <Link to="https://shopinesmart.com" className="text-blue-600">
                shopinesmart.com
              </Link>
              , upload your invoice, and request your cashback. Use it yourself
              or donate to a good cause or NGO.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>
              If you need any help please contact:{" "}
              <a href="mailto:help@shopiness.com" className="text-blue-600">
                help@shopiness.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceUpdate;
