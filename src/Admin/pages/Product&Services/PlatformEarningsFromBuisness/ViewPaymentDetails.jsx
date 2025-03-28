import { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { FaArrowLeft, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { db } from "../../../../../firebase";

const ViewPaymentDetails = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch payment request details
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const requestRef = doc(db, "paymentByBusiness", id);
        const requestDoc = await getDoc(requestRef);
        if (requestDoc.exists()) {
          setRequest({ id: requestDoc.id, ...requestDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  // Handle verification
  const handleVerification = async () => {
    if (!request) return;

    setVerifying(true);
    try {
      // Update payment status in platformEarnings
      const earningRef = doc(db, "platformEarnings", request.earningId);
      await updateDoc(earningRef, {
        paymentStatus: "Completed",
        completedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      // Update payment request status
      const requestRef = doc(db, "paymentByBusiness", request.id);
      await updateDoc(requestRef, {
        status: "Completed",
      });

      // Update businessDetails: Increment totalPlatformEarningsPaid
      const businessRef = doc(db, "businessDetails", request.businessId);
      const businessDoc = await getDoc(businessRef);
      if (businessDoc.exists()) {
        const currentPaidAmount =
          businessDoc.data().totalPlatformEarningsPaid || 0;
        await updateDoc(businessRef, {
          totalPlatformEarningsPaid: currentPaidAmount + request.amount,
        });
      }
      //  notification document
      await addDoc(collection(db, "businessNotifications"), {
        message: `Your payment amount ₹${request.amount} for Invoice #${request.invoiceId} has been verified successfully. Thank you for your payment!`,
        businessId: request.businessId,
        read: false,
        createdAt: new Date().toISOString(),
      });
      // Send email to business owner
      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: request.businessEmail,
        title: "Payment Verification Completed",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Payment Verification Completed</h2>
            <p>Dear ${request.businessName},</p>
            <p>Your payment amount ₹${request.amount} for Invoice #${request.invoiceId} has been verified successfully. Thank you for your payment!</p>
            <p>Best regards,<br>The ShoppinessMart Team</p>
          </div>
        `,
      });

      toast.success("Payment verified successfully!");
      setRequest({ ...request, status: "Completed" }); // Update local state
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Failed to verify payment. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Request not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mx-4 my-6 md:mx-10 md:my-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-8">Payment Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Business Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Business Information
          </h3>
          <div className="space-y-4">
            <p>
              <strong className="text-gray-600">Business Name:</strong>{" "}
              <span className="text-gray-800">{request.businessName}</span>
            </p>
            <p>
              <strong className="text-gray-600">Business Email:</strong>{" "}
              <span className="text-gray-800">{request.businessEmail}</span>
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Payment Information
          </h3>
          <div className="space-y-4">
            <p>
              <strong className="text-gray-600">Invoice ID:</strong>{" "}
              <span className="text-gray-800">{request.invoiceId}</span>
            </p>
            <p>
              <strong className="text-gray-600">Amount:</strong>{" "}
              <span className="text-green-600 font-bold">
                ₹{request.amount?.toLocaleString()}
              </span>
            </p>
            <p>
              <strong className="text-gray-600">Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  request.status === "Checking"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {request.status}
              </span>
            </p>
            <p>
              <strong className="text-gray-600">Request Date:</strong>{" "}
              <span className="text-gray-800">{request.requestDate}</span>
            </p>
            {request.receiptUrl && (
              <p>
                <strong className="text-gray-600">Receipt:</strong>{" "}
                <Link
                  to={request.receiptUrl}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Receipt
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verify Button (Only for "Checking" status) */}
      {request.status === "Checking" && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleVerification}
            disabled={verifying}
            className={`flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-all ${
              verifying ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {verifying ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Verifying...
              </>
            ) : (
              <>
                <FaCheckCircle className="mr-2" /> Verify Payment
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewPaymentDetails;
