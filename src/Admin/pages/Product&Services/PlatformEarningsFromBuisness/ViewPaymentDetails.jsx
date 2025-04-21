import { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { FaArrowLeft, FaSpinner, FaCheckCircle, FaDonate } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { db } from "../../../../../firebase";

const ViewPaymentDetails = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [donationPercentage, setDonationPercentage] = useState(10); // Default percentage
  const [donationAmount, setDonationAmount] = useState(1); // Changed initial value to 1 to avoid button being disabled
  const [sendingDonation, setSendingDonation] = useState(false);
  const [donationSent, setDonationSent] = useState(false); // New state to track if donation was sent
  const [sentDonationDetails, setSentDonationDetails] = useState(null); // Store sent donation details
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch payment request details
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const requestRef = doc(db, "paymentByBusiness", id);
        const requestDoc = await getDoc(requestRef);
        if (requestDoc.exists()) {
          const requestData = { id: requestDoc.id, ...requestDoc.data() };
          setRequest(requestData);
          //   console.log(requestData, "requestData");

          // Set initial donation amount when request is loaded
          if (requestData.amount) {
            const initialAmount =
              (requestData.amount * donationPercentage) / 100;
            setDonationAmount(initialAmount);
          }

          // Check if donation transaction exists and is completed

          if (requestData.causeData.donationTransactionId) {
            const donationRef = doc(
              db,
              "donationTransactions",
              requestData.causeData.donationTransactionId
            );
            const donationDoc = await getDoc(donationRef);
            if (
              donationDoc.exists() &&
              donationDoc.data().paymentStatus === "Completed"
            ) {
              setDonationSent(true);
              setSentDonationDetails({
                percentage: donationDoc.data().donationPercentage,
                amount: donationDoc.data().donationAmount,
                date: donationDoc.data().moneySentDate,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, donationPercentage]);
 // console.log(request, "request");

  // Calculate donation amount based on percentage
  useEffect(() => {
    if (request && request.amount) {
      const calculatedAmount = (request.amount * donationPercentage) / 100;
      setDonationAmount(calculatedAmount > 0 ? calculatedAmount : 1); // Ensure donation amount is always at least 1
    }
  }, [donationPercentage, request]);

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

  // Handle sending donation to NGO/cause
  const handleSendDonation = async () => {
    if (!request || !request.causeData) return;

    setSendingDonation(true);
    try {
      // Determine payment method type
      let paymentMethodType = "";
      let paymentMethodDetails = "";

      if (
        request.causeData.paymentDetails.upiDetails &&
        request.causeData.paymentDetails.upiDetails.length > 0
      ) {
        paymentMethodType = "UPI";
        paymentMethodDetails =
          request.causeData.paymentDetails.upiDetails[0].upiId;
      } else if (
        request.causeData.paymentDetails.bankAccounts &&
        request.causeData.paymentDetails.bankAccounts.length > 0
      ) {
        paymentMethodType = "Bank Transfer";
        paymentMethodDetails =
          request.causeData.paymentDetails.bankAccounts[0].accountNumber;
      } else if (
        request.causeData.paymentDetails.cardDetails &&
        request.causeData.paymentDetails.cardDetails.length > 0
      ) {
        paymentMethodType = "Card Payment";
        paymentMethodDetails =
          request.causeData.paymentDetails.cardDetails[0].cardNumber;
      }

      // Update existing donation transaction
      const donationRef = doc(
        db,
        "donationTransactions",
        request.causeData.donationTransactionId
      );
      await updateDoc(donationRef, {
        paymentStatus: "Completed",
        paymentMethod: paymentMethodType,
        paymentMethodDetails: paymentMethodDetails,
        donationAmount: donationAmount,
        donationPercentage: donationPercentage,
        moneySentDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      // Add notification for the NGO
      await addDoc(collection(db, "ngoNotifications"), {
        message: `${request.customerName} (${
          request.customerEmail
        }) purchased a product on ${
          request.requestDate
        } to donate to your cause/NGO. After applying a ${
          100 - donationPercentage
        }% platform fee, the remaining amount of ₹${donationAmount.toFixed(
          2
        )} has been sent to your payment option.`,
        ngoId: request.causeData.causeId,
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Store sent donation details
      const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      setSentDonationDetails({
        percentage: donationPercentage,
        amount: donationAmount,
        date: currentDate,
      });

      // Set donation as sent
      setDonationSent(true);

      toast.success("Donation sent successfully!");
    } catch (error) {
      console.error("Error sending donation:", error);
      toast.error("Failed to send donation. Please try again.");
    } finally {
      setSendingDonation(false);
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
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 md:mx-10 my-4 sm:my-6 md:my-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 sm:mb-8"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-8">Payment Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Business Information */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
            Business Information
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base">
              <strong className="text-gray-600">Business Name:</strong>{" "}
              <span className="text-gray-800 break-words">{request.businessName}</span>
            </p>
            <p className="text-sm sm:text-base">
              <strong className="text-gray-600">Business Email:</strong>{" "}
              <span className="text-gray-800 break-words">{request.businessEmail}</span>
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
            Payment Information
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base">
              <strong className="text-gray-600">Invoice ID:</strong>{" "}
              <span className="text-gray-800 break-words">{request.invoiceId}</span>
            </p>
            <p className="text-sm sm:text-base">
              <strong className="text-gray-600">Amount:</strong>{" "}
              <span className="text-green-600 font-bold">
                ₹{request.amount?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm sm:text-base">
              <strong className="text-gray-600">Status:</strong>{" "}
              <span
                className={`px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                  request.status === "Checking"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {request.status}
              </span>
            </p>
            <p className="text-sm sm:text-base">
              <strong className="text-gray-600">Request Date:</strong>{" "}
              <span className="text-gray-800">{request.requestDate}</span>
            </p>
            {request.receiptUrl && (
              <p className="text-sm sm:text-base">
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
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={handleVerification}
            disabled={verifying}
            className={`flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all text-sm sm:text-base ${
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

      {/* NGO/Cause Donation Section - Only show if causeData exists */}
      {request.causeData && (
        <div className="mt-6 sm:mt-10 bg-blue-50 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
            <FaDonate className="mr-2" />{" "}
            {donationSent
              ? "Money Sent to Selected NGO/Cause"
              : "Send Money to Selected NGO/Cause"}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6">
            {/* Cause Information */}
            <div>
              <h4 className="font-medium text-blue-700 mb-2 sm:mb-3 text-sm sm:text-base">
                Cause Information
              </h4>
              <div className="space-y-2 sm:space-y-4">
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-600">Cause Name:</strong>{" "}
                  <span className="text-gray-800 break-words">
                    {request.causeData.causeName}
                  </span>
                </p>
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-600">Customer Name:</strong>{" "}
                  <span className="text-gray-800 break-words">{request.customerName}</span>
                </p>
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-600">Customer Email:</strong>{" "}
                  <span className="text-gray-800 break-words">{request.customerEmail}</span>
                </p>
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-600">Amount Received:</strong>{" "}
                  <span className="text-green-600 font-bold">
                    ₹{request.amount?.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h4 className="font-medium text-blue-700 mb-2 sm:mb-3 text-sm sm:text-base">
                Payment Details
              </h4>
              <div className="space-y-2 sm:space-y-4">
                {request.causeData.paymentDetails.upiDetails &&
                  request.causeData.paymentDetails.upiDetails.length > 0 && (
                    <p className="text-sm sm:text-base">
                      <strong className="text-gray-600">UPI ID:</strong>{" "}
                      <span className="text-gray-800 break-all">
                        {request.causeData.paymentDetails.upiDetails[0].upiId}
                      </span>
                    </p>
                  )}

                {request.causeData.paymentDetails.bankAccounts &&
                  request.causeData.paymentDetails.bankAccounts.length > 0 && (
                    <div>
                      <p className="text-sm sm:text-base">
                        <strong className="text-gray-600">Bank Account:</strong>{" "}
                        <span className="text-gray-800 break-all">
                          {
                            request.causeData.paymentDetails.bankAccounts[0]
                              .accountNumber
                          }
                        </span>
                      </p>
                    </div>
                  )}

                {request.causeData.paymentDetails.cardDetails &&
                  request.causeData.paymentDetails.cardDetails.length > 0 && (
                    <p className="text-sm sm:text-base">
                      <strong className="text-gray-600">Card Details:</strong>{" "}
                      <span className="text-gray-800 break-all">
                        {
                          request.causeData.paymentDetails.cardDetails[0]
                            .cardNumber
                        }
                      </span>
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Show either the donation form or the completed donation details */}
          {donationSent ? (
            <div className="mt-4 sm:mt-6 bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-700 mb-2 sm:mb-3 text-sm sm:text-base">
                Donation Completed
              </h4>
              <div className="space-y-2 sm:space-y-4">
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-600">
                    Donation Percentage:
                  </strong>{" "}
                  <span className="text-gray-800">
                    {sentDonationDetails.percentage}%
                  </span>
                </p>
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-600">Donation Amount:</strong>{" "}
                  <span className="text-green-600 font-bold">
                    ₹{sentDonationDetails.amount.toFixed(2)}
                  </span>
                </p>
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-600">Sent Date:</strong>{" "}
                  <span className="text-gray-800">
                    {sentDonationDetails.date}
                  </span>
                </p>
                <div className="flex items-center text-green-700 text-sm sm:text-base">
                  <FaCheckCircle className="mr-2 flex-shrink-0" />
                  <span>Money has been successfully sent to the cause/NGO</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Donation calculation */}
              <div className="mt-4 sm:mt-6">
                <label
                  htmlFor="donationPercentage"
                  className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
                >
                  Donation Percentage (%)
                </label>
                <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
                  <input
                    type="number"
                    id="donationPercentage"
                    value={donationPercentage}
                    onChange={(e) =>
                      setDonationPercentage(
                        Math.max(0, Math.min(100, Number(e.target.value)))
                      )
                    }
                    className="border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 w-20 sm:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-700 text-sm sm:text-base mt-2 sm:mt-0">
                    = ₹{donationAmount.toFixed(2)} of ₹
                    {request.amount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Send donation button */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  onClick={handleSendDonation}
                  disabled={sendingDonation}
                  className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    sendingDonation ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {sendingDonation ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Processing...
                    </>
                  ) : (
                    <>
                      <FaDonate className="mr-2" /> Successfully Send Money
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewPaymentDetails;