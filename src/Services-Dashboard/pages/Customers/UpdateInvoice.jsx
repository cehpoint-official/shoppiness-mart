import { useState } from "react";
import { useSelector } from "react-redux";
import headerLogo from "../../assets/header-logo.png";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const UpdateInvoice = ({invoice,onBack, onUpdate}) => {
  const { user } = useSelector((state) => state.businessUserReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [localDueAmount, setLocalDueAmount] = useState(invoice.dueAmount);
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
    const storageRef = ref(
      storage,
      "updatedInvoice/" + invoice.invoiceNum + ".pdf"
    );
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
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error("Failed to get download URL:", error);
              reject(error);
            });
        }
      );
    });
  };


  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate that there is a due amount to process
      if (invoice.dueAmount === 0) {
        throw new Error("No amount is Due");
      }

      // Generate and upload new PDF
      const pdfBlob = await generatePdfBlob();
      const pdfUrl = await uploadPdf(pdfBlob);

      // Base update data for invoice
      const baseUpdateData = {
        dueAmount: 0,
        paidAmount: invoice.totalAmount,
        pdfUrl: pdfUrl,
      };

      // Check if this is a coupon-based invoice
      if (invoice.claimedCouponCode) {
        // Handle coupon case
        await setDoc(
          doc(db, "invoiceDetails", invoice.id),
          {
            ...baseUpdateData,
            userCashback:
              (invoice.userCashback || 0) + (invoice.remainingCashback || 0),
            remainingCashback: 0,
          },
          { merge: true }
        );

        // Update user's collected cashback
        const userDocRef = doc(db, "users", invoice.customerId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const currentCollectedCashback =
            userDoc.data().collectedCashback || 0;
          await setDoc(
            userDocRef,
            {
              collectedCashback:
                currentCollectedCashback + (invoice.remainingCashback || 0),
            },
            { merge: true }
          );
        }

        toast.success(
          "Invoice Updated and Remaining Cashback Sent successfully!"
        );
      } else {
        // Handle non-coupon case
        await setDoc(
          doc(db, "invoiceDetails", invoice.id),
          baseUpdateData,
          { merge: true }
        );

        toast.success("Invoice Updated successfully!");
      }

      // Update local due amount state
      setLocalDueAmount(0);

      // Call the update and back callbacks
      onUpdate();
      onBack();
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error(error.message || "Failed to save invoice.");
    } finally {
      setIsLoading(false);
    }
  };
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
              <p className="font-medium mb-1">
                {invoice.claimedCouponCodeUserName}
              </p>
              <p className="text-sm text-gray-600 mb-1">Phone No.</p>
              <p className="font-medium">{invoice.userPhoneNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Invoice#</p>
              <p className="font-medium">{invoice.invoiceNum}</p>
              <p className="text-gray-600 mt-2 mb-1">Biller</p>
              <p className="font-medium">{invoice.billerName}</p>
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
                  <td className="py-3 px-4">{invoice.claimedDate}</td>
                  <td className="py-3 px-4">
                    {new Date().toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-center">{invoice.dueDate}</td>
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
                {invoice.products.map((product, index) => (
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
                <span>Rs. {invoice.subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax Rate</span>
                <span>{invoice.taxRate}%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Rs. {invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-gray-50 py-2 rounded">
                <span>Cash Collected</span>
                <span>Rs. {invoice.paidAmount.toLocaleString()}</span>
              </div>
              {/* Due Amount Field */}
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
              Earn {invoice.discount || 0}% cashback at Shopinesmart! Visit{" "}
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

export default UpdateInvoice;
