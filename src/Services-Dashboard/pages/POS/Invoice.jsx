import { useState } from "react";
import { useSelector } from "react-redux";
import headerLogo from "../../assets/header-logo.png";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { addDoc, collection, doc, runTransaction } from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const Invoice = ({ data, onBack }) => {
  const { user } = useSelector((state) => state.businessUserReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const generatePdf = async (elementId) => {
    try {
      const invoiceContent = document.getElementById(elementId);
      if (!invoiceContent) throw new Error("Invoice content not found");

      // Optimize canvas settings for smaller file size
      const canvas = await html2canvas(invoiceContent, {
        scale: 2, // Reduced from 3 to 2
        useCORS: true,
        logging: false, // Disable logging
        imageTimeout: 0, // Disable timeout
        backgroundColor: null, // Transparent background
      });

      // Compress the image data
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Create PDF with compression
      const pdf = new jsPDF({
        compress: true,
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image with optimized settings
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

  const generatePdfBlob = async () => {
    const pdf = await generatePdf("invoice-content");
    const blob = pdf.output("blob");

    // Check file size
    if (blob.size > 500000) {
      // 500KB in bytes
      // If still too large, try with more aggressive compression
      const invoiceContent = document.getElementById("invoice-content");
      const canvas = await html2canvas(invoiceContent, {
        scale: 1.5, // Further reduce scale
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        compress: true,
        unit: "mm",
        format: "a4",
      });

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
  };

  const uploadPdf = async (file) => {
    const metadata = {
      contentType: "application/pdf",
    };
    const storageRef = ref(storage, `invoices/${data.invoiceId}.pdf`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Failed to get download URL:", error);
            // Delete the uploaded file if we can't get its URL
            try {
              await deleteObject(storageRef);
            } catch (deleteError) {
              console.error("Failed to delete incomplete upload:", deleteError);
            }
            reject(error);
          }
        }
      );
    });
  };

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
      const totalCommissionPercentage = userCashbackPercentage + platformEarningsPercentage;
      
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

  // UPDATED EMAIL FUNCTIONS
  const sendEmailToUser = async (invoiceData, pdfUrl) => {
    // Extract values with guaranteed defaults
    const customerName = invoiceData.customerName || "Customer";
    const invoiceNum = invoiceData.invoiceNum || invoiceData.invoiceId || "N/A";
    const billingDate =
      invoiceData.billingDate || new Date().toLocaleDateString("en-GB");
    const dueAmount = parseFloat(invoiceData.dueAmount || 0);
    const customerEmail = invoiceData.customerEmail || invoiceData.email || "";

    // Ensure we have a valid userCashback amount
    let userCashback = 0;
    if (typeof invoiceData.userCashback === "number") {
      userCashback = invoiceData.userCashback;
    } else if (typeof invoiceData.userCashbackAmount === "number") {
      userCashback = invoiceData.userCashbackAmount;
    } else if (invoiceData.userCashback) {
      // Handle string conversion if needed
      userCashback = parseFloat(invoiceData.userCashback);
    }

    // Ensure userCashback is a valid number
    userCashback = isNaN(userCashback) ? 0 : userCashback;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Invoice Generated and Cashback Details</h2>
          <p style="color: #666;">Dear ${customerName},</p>
          <p style="color: #666;">Your invoice number <strong>${invoiceNum}</strong> has been generated successfully.</p>
          ${
            userCashback > 0
              ? `
            <p style="color: #666;">You are eligible for a cashback of <strong>Rs. ${userCashback.toFixed(
              2
            )}</strong>.</p>
            ${
              dueAmount > 0
                ? `
              <p style="color: #666;">However, due to an outstanding due amount of <strong>Rs. ${dueAmount.toFixed(
                2
              )}</strong>, your cashback will be credited once the due is cleared.</p>
            `
                : `
              <p style="color: #666;">The cashback has been credited to your account.</p>
            `
            }
          `
              : `
            <p style="color: #666;">No cashback is applicable for this invoice.</p>
          `
          }
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoiceNum}</p>
            ${
              userCashback > 0
                ? `
              <p style="margin: 5px 0;"><strong>Cashback Amount:</strong> Rs. ${userCashback.toFixed(
                2
              )}</p>
            `
                : ""
            }
            <p style="margin: 5px 0;"><strong>Date:</strong> ${billingDate}</p>
          </div>
          <p style="color: #666;">You can download the invoice by clicking the button below:</p>
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

    try {
      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: customerEmail,
        title: "ShoppinessMart - Invoice Generated",
        body: emailTemplate,
      });
    } catch (error) {
      console.error("Failed to send customer email:", error);
      throw error;
    }
  };

  const sendEmailToBusinessOwner = async (invoiceData, pdfUrl) => {
    // Extract values with guaranteed defaults
    const invoiceNum = invoiceData.invoiceNum || invoiceData.invoiceId || "N/A";
    const billingDate =
      invoiceData.billingDate || new Date().toLocaleDateString("en-GB");

    // Ensure we have a valid platformCashback amount
    let platformCashback = 0;
    if (typeof invoiceData.platformCashback === "number") {
      platformCashback = invoiceData.platformCashback;
    } else if (typeof invoiceData.amountEarned === "number") {
      platformCashback = invoiceData.amountEarned;
    } else if (typeof invoiceData.platformEarnings === "number") {
      platformCashback = invoiceData.platformEarnings;
    } else if (invoiceData.platformCashback) {
      // Handle string conversion if needed
      platformCashback = parseFloat(invoiceData.platformCashback);
    }

    // Ensure platformCashback is a valid number
    platformCashback = isNaN(platformCashback) ? 0 : platformCashback;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Platform Earnings Reminder</h2>
          <p style="color: #666;">Dear Business Owner,</p>
          <p style="color: #666;">For invoice number <strong>${invoiceNum}</strong>, the platform's share is <strong>Rs. ${platformCashback.toFixed(
      2
    )}</strong>.</p>
          <p style="color: #666;">Please ensure the payment is made within the next 2-3 days.</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoiceNum}</p>
            <p style="margin: 5px 0;"><strong>Platform Earnings:</strong> Rs. ${platformCashback.toFixed(
              2
            )}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${billingDate}</p>
          </div>
          <p style="color: #666;">You can download the invoice by clicking the button below:</p>
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

    try {
      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: user.email,
        title: "ShoppinessMart - Platform Earnings Reminder",
        body: emailTemplate,
      });
    } catch (error) {
      console.error("Failed to send business owner email:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    let pdfUrl = null;
    let storageRef = null;

    try {
      // Define hasCoupon before the transaction
      const hasCoupon = Boolean(
        data.couponCode && data.customerId && data.couponId
      );

      // Validate required data
      if (!data.invoiceId || !data.grandTotal) {
        throw new Error("Missing required invoice data");
      }

      // Generate and upload PDF
      const pdfBlob = await generatePdfBlob();
      storageRef = ref(storage, `invoices/${data.invoiceId}.pdf`);
      pdfUrl = await uploadPdf(pdfBlob);

      // Base invoice data
      const baseInvoiceData = {
        billerName: data.billerName || "",
        dueDate: data.dueDate || "",
        subTotal: data.totalPrice || 0,
        customerEmail: data.email || "",
        customerPhoneNumber: data.phoneNumber || "",
        taxRate: data.totalPrice
          ? ((data.taxAmount / data.totalPrice) * 100).toFixed(1)
          : "0",
        products: data.products || [],
        customerName: data.customerName || "",
        pdfUrl,
        totalAmount: data.grandTotal || 0,
        paidAmount: data.cashCollected || 0,
        dueAmount: data.dueAmount || 0,
        invoiceNum: data.invoiceId,
        businessId: data.businessId,
        billingDate:
          data.billingDate ||
          new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
      };

      // Initialize variables outside transaction
      let completeInvoiceData = { ...baseInvoiceData };
      let platformCashback = 0;
      let userCashback = 0;
      let remainingCashback = 0;

      // Use a transaction to ensure all-or-nothing saving
      await runTransaction(db, async (transaction) => {
        const hasCoupon = Boolean(
          data.couponCode && data.customerId && data.couponId
        );

        // IMPORTANT: Perform ALL reads first
        let couponDoc = null;
        let userDoc = null;

        if (hasCoupon) {
          // READ: Verify coupon exists and is valid
          const couponRef = doc(db, "coupons", data.couponId);
          couponDoc = await transaction.get(couponRef);

          if (!couponDoc.exists()) {
            throw new Error("Coupon no longer exists");
          }

          if (couponDoc.data().status !== "Pending") {
            throw new Error("Coupon is no longer valid");
          }

          // READ: Get user data for cashback update
          const userRef = doc(db, "users", data.customerId);
          userDoc = await transaction.get(userRef);
        }

        // READ: Get business details if needed
        let businessDoc = null;
        if (data.businessId) {
          const businessRef = doc(db, "businessDetails", data.businessId);
          businessDoc = await transaction.get(businessRef);
        }

        // Now perform calculations
        if (hasCoupon) {
          // Calculate cashback
          const cashbackResults = calculateCashbackAndEarnings(
            data.grandTotal,
            data.cashCollected,
            data.userCashback,
            data.platformEarnings
          );

          platformCashback = cashbackResults.platformCashback;
          userCashback = cashbackResults.userCashback;
          remainingCashback = cashbackResults.remainingCashback;

          // Add coupon-specific data to invoice
          const couponData = {
            claimedCouponCode: data.couponCode,
            claimedCouponCodeUserName: data.customerName,
            discount: data.userCashback,
            userCashbackPercentage: data.userCashback,
            userCashback,
            platformCashback,
            remainingCashback,
            customerId: data.customerId || "",
            claimedDate: new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          };

          // Update complete invoice data with coupon info
          completeInvoiceData = { ...baseInvoiceData, ...couponData };
        }

        // NOW perform all writes after all reads

        // WRITE: Update user's cashback if needed
        if (hasCoupon && userDoc && userDoc.exists() && userCashback > 0) {
          const currentCashback = userDoc.data().collectedCashback || 0;
          const userRef = doc(db, "users", data.customerId);
          transaction.update(userRef, {
            collectedCashback: currentCashback + userCashback,
          });
        }

        // WRITE: Update coupon status if needed
        if (hasCoupon && couponDoc && couponDoc.exists()) {
          const couponRef = doc(db, "coupons", data.couponId);
          transaction.update(couponRef, {
            status: "Claimed",
            claimedAt: new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          });
        }

        // WRITE: Update business details if needed
        if (businessDoc && businessDoc.exists() && platformCashback > 0) {
          const businessRef = doc(db, "businessDetails", data.businessId);
          const currentTotalDue =
            businessDoc.data().totalPlatformEarningsDue || 0;
          transaction.update(businessRef, {
            totalPlatformEarningsDue: currentTotalDue + platformCashback,
          });
        }
      });

      // After transaction completes successfully, perform non-transactional operations

      // Save invoice data
      await addDoc(collection(db, "invoiceDetails"), completeInvoiceData);

      // Save user transaction details
      const userTransactionData = {
        customerId: data.customerId || "",
        invoiceId: data.invoiceId,
        couponCode: data.couponCode || "",
        products: data.products || [],
        claimedDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        customerName: data.customerName || "",
        customerEmail: data.email || "",
        discount: data.userCashback || 0,
        userCashbackAmount: userCashback || 0,
        userRemainingCashbackAmount: remainingCashback || 0,
        status: hasCoupon ? "Claimed" : "No Coupon",
      };
      await addDoc(collection(db, "userTransactions"), userTransactionData);

      // Save platform earnings details
      const platformEarningsData = {
        customerId: data.customerId || "",
        businessId: data.businessId,
        invoiceId: data.invoiceId,
        customerName: data.customerName || "",
        customerEmail: data.email || "",
        amountEarned: platformCashback || 0,
        paymentStatus: hasCoupon ? "Pending" : "Not Applicable",
        dueDate: hasCoupon
          ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )
          : "",
      };
      await addDoc(collection(db, "platformEarnings"), platformEarningsData);

      // Send emails
      await sendEmailToUser(completeInvoiceData, pdfUrl);
      if ((platformCashback || 0) > 0) {
        await sendEmailToBusinessOwner(completeInvoiceData, pdfUrl);
      }

      toast.success("Invoice saved successfully!");
      onBack();
    } catch (error) {
      console.error("Error saving invoice:", error);

      // Clean up PDF from storage if it was uploaded
      if (storageRef && pdfUrl) {
        try {
          await deleteObject(storageRef);
        } catch (deleteError) {
          console.error("Error cleaning up PDF:", deleteError);
        }
      }

      toast.error(error.message || "Failed to save invoice.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdf = await generatePdf("invoice-content");
      pdf.save(`invoice-${data.invoiceId || "download"}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <div className="print:hidden mx-10 mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
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
            Save
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
              <p className="font-medium mb-1">{data.customerName}</p>
              <p className="text-sm text-gray-600 mb-1">Phone No.</p>
              <p className="font-medium">{data.phoneNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Invoice#</p>
              <p className="font-medium">{data.invoiceId}</p>
              <p className="text-gray-600 mt-2 mb-1">Biller</p>
              <p className="font-medium">{data.billerName}</p>
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
                  <td className="py-3 px-4">{data.billingDate}</td>
                  <td className="py-3 px-4">{data.time}</td>
                  <td className="py-3 px-4 text-center">{data.dueDate}</td>
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
                {data.products.map((product, index) => (
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
                <span>Rs. {data.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax Rate</span>
                <span>
                  {((data.taxAmount / data.totalPrice) * 100).toFixed(1) > 0
                    ? ((data.taxAmount / data.totalPrice) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Rs. {data.grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-gray-50 py-2 rounded">
                <span>Cash Collected</span>
                <span>Rs. {data.cashCollected.toLocaleString()}</span>
              </div>
              {/* Due Amount Field */}
              <div
                className={`flex justify-between py-2 rounded border-l-4 ${
                  data.dueAmount > 0
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-green-500 bg-green-50 text-green-600"
                }`}
              >
                <span>Due Amount</span>
                <span>Rs. {data.dueAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cashback Details */}
          <div className="mt-8 bg-orange-50 border border-orange-100 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-medium">Cashback Details: </span>
              Earn {data.userCashback || 0}% cashback at Shopinesmart! Visit{" "}
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

export default Invoice;
