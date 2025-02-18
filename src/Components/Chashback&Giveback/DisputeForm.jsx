import { collection, doc, addDoc, getDocs } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db, storage } from "../../../firebase";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; // Import FaSpinner from react-icons
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const DisputeForm = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();
  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.status === "Active") {
          data.push({ shopId: doc.id, ...shopData });
        }
      });
      setShops(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleShopChange = (e) => {
    setSelectedShop(e.target.value);
  };

  const handlePaidAmountChange = (e) => {
    setPaidAmount(e.target.value);
  };

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedPdf(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const uploadPdf = async (file) => {
    const metadata = {
      contentType: "application/pdf",
    };
    const storageRef = ref(storage, `dispute-invoices/${file.name}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload PDF to Firebase Storage
      const pdfUrl = await uploadPdf(uploadedPdf);

      // Find the selected shop details
      const selectedShopDetails = shops.find(
        (shop) => shop.businessName === selectedShop
      );

      // Save form data to Firestore
      const formData = {
        shopId: selectedShopDetails.shopId,
        shopName: selectedShopDetails.businessName,
        shopEmail: selectedShopDetails.email,
        shopPhone: selectedShopDetails.mobileNumber,
        shopOwnerName: selectedShopDetails.owner,
        paidAmount,
        couponCode,
        invoiceName: uploadedPdf?.name,
        invoiceUrl: pdfUrl,
        userName: user.fname + " " + user.lname,
        userEmail: user.email,
        userId,
        status: "Pending",
        requestedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
      console.log(formData);

      await addDoc(collection(db, "cashbackDisputeRequests"), formData);

      // Send confirmation email
      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: user.email,
        title: "ShoppinessMart - Dispute Request Confirmation",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Thank you for submitting your dispute request!</h2>
            
            <p>Dear ${user.fname} ${user.lname},</p>
            
            <p>We have received your dispute request regarding the cashback for the following details:</p>
            
            <ul>
              <li><strong>Shop Name:</strong> ${selectedShopDetails.businessName}</li>
              <li><strong>Paid Amount:</strong> ${paidAmount}</li>
              <li><strong>Coupon Code:</strong> ${couponCode}</li>
            </ul>
            
            <p>Our team will review your request and get back to you within 2-3 business days.</p>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            The ShoppinessMart Team</p>
          </div>
        `,
      });

      toast.success("Dispute request submitted successfully!");
      // Reset form fields
      setSelectedShop("");
      setPaidAmount("");
      setCouponCode("");
      setUploadedPdf(null);
    } catch (error) {
      console.error("Error submitting dispute request:", error);
      toast.error("Failed to submit dispute request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      {/* Disclaimer */}
      <div className="bg-yellow-100 p-4 rounded-md border border-yellow-400 mb-6">
        <p className="text-sm text-yellow-800 font-semibold">
          ⚠️ <strong>Important:</strong>
        </p>
        <p className="text-sm text-yellow-800 mt-2">
          If you have received a bill or invoice and paid the full amount but
          have not received the cashback in your wallet, follow these steps
          before clicking the &quot; Dispute Request&quot; button to ensure a
          successful dispute request:
        </p>
        <ol className="list-decimal list-inside text-sm text-yellow-800 mt-2">
          <li>
            Select the shop from which you redeemed the coupon and purchased
            items.
          </li>
          <li>Enter the total bill amount.</li>
          <li>
            Go to the &quot;My Coupons&quot; section, copy the coupon code, and
            enter it in the required field.
          </li>
          <li>Upload the invoice as proof of purchase.</li>
        </ol>
      </div>

      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Shop
          </label>
          <select
            className="w-full bg-gray-100 rounded p-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedShop}
            onChange={handleShopChange}
            required
          >
            <option value="">Select a shop...</option>
            {shops.map((shop, index) => (
              <option key={index} value={shop.businessName}>
                {shop.businessName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paid Amount
          </label>
          <input
            type="text"
            className="w-full bg-gray-100 rounded p-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={paidAmount}
            onChange={handlePaidAmountChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coupon Code
          </label>
          <input
            type="text"
            className="w-full bg-gray-100 rounded p-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={couponCode}
            onChange={handleCouponCodeChange}
            required
            placeholder="Enter coupon code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full bg-gray-100 rounded p-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handlePdfUpload}
            required
          />
          {uploadedPdf && (
            <p className="text-sm text-gray-600 mt-1">
              Uploaded PDF: {uploadedPdf.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 text-md mt-6 hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" /> // Add spinning animation
          ) : (
            "Dispute Request"
          )}
        </button>
      </form>
    </div>
  );
};

export default DisputeForm;
