import { useState, useRef } from "react"; // Import useRef
import { IoClose } from "react-icons/io5";
import { FaGlobe, FaFlag, FaSpinner } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { MdKeyboardArrowLeft, MdEmail } from "react-icons/md";
import {
  FaUser,
  FaIdCard,
  FaRupeeSign,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import toast from "react-hot-toast";

const DonationDialog = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    panCard: "",
    amount: "",
    receipt: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // File validation
  const validateFile = (file) => {
    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload only JPG, PNG, GIF or PDF files");
      return false;
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  // Handle file change with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setFormData({
        ...formData,
        receipt: file,
      });
    } else if (file) {
      e.target.value = null; // Reset file input
    }
  };

  // Reset form state and file input
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      panCard: "",
      amount: "",
      receipt: null,
    });
    setStep(1);
    setDonationType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input field
    }
  };

  // Handle form submission with Firebase upload and storage
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure we have a file and it's valid
    if (!formData.receipt) {
      toast.error("Please upload a transaction receipt");
      return;
    }

    if (!validateFile(formData.receipt)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload file to Firebase Storage
      const fileExtension = formData.receipt.name.split(".").pop();
      const fileName = `direct-donations/${formData.name.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, formData.receipt);

      // Monitor upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Handle upload error
          console.error("Upload error:", error);
          toast.error("Error uploading file. Please try again.");
          setIsSubmitting(false);
        },
        async () => {
          // Upload complete - get download URL and store data in Firestore
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // 2. Store donation data in Firestore
            await addDoc(collection(db, "directDonationRequests"), {
              donationType,
              name: formData.name,
              email: formData.email,
              panCard: formData.panCard,
              amount: parseFloat(formData.amount),
              receiptURL: downloadURL,
              receiptFileName: formData.receipt.name,
              fileType: formData.receipt.type,
              createdAt: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              status: "Pending", 
            });

            toast.success("Donation information submitted successfully!");
            setIsSubmitting(false);
            resetForm(); // Reset the form state and file input
            onClose();
          } catch (error) {
            console.error("Firestore error:", error);
            toast.error("Error saving donation information. Please try again.");
            setIsSubmitting(false);
          }
        }
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
    try {
      // Send email to admin
      const adminEmailData = {
        email: "admin@shoppinessmart.com",
        title: "New Donation Verification Request",
        body: `
            New Donation Verification Request Received
            
            Dear Admin,
            
            A new donation verification request has been submitted. Below are the details:
            
            Donation Details
            ---------------
            **Invoice ID:** ${formData.receipt.name}
            **Amount:** Rs. ${parseFloat(formData.amount)}
            **Payment Status:** Pending Verification
            **Receipt Uploaded:** Yes
            **Submitted On:** ${new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            
            Please review the donation details on your admin dashboard and verify the payment.
            
            Best regards,
            The ShoppinessMart Team
          `,
      };

      // Send email to the user
      const userEmailData = {
        email: formData.email, // Assuming you have the user's email
        title: "Thank You for Your Donation",
        body: `
            Thank You for Your Donation
            
            Dear ${formData.name || "Donor"},
            
            We sincerely thank you for your generous donation of Rs.  ${parseFloat(
              formData.amount
            )}.
            
            Your Donation Details:
            ----------------------
            **Invoice ID:** ${formData.receipt.name}
            **Date:** ${new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            
            Our admin team will review and verify your donation shortly. You will receive a confirmation email once your donation has been verified.
            
            Your support makes a significant difference in our mission.
            
            Warm regards,
            The ShoppinessMart Team
          `,
      };

      // Send both emails using Promise.all for parallel execution
      await Promise.all([
        axios.post(
          `${import.meta.env.VITE_AWS_SERVER}/send-email`,
          adminEmailData
        ),
        axios.post(
          `${import.meta.env.VITE_AWS_SERVER}/send-email`,
          userEmailData
        ),
      ]);

      // Show success message to user
      toast.success("Donation submitted and confirmation emails sent!");
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error(
        "Donation saved but there was an issue sending confirmation emails"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[10000] overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl relative my-4 mx-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <IoClose size={24} />
        </button>

        {/* Dialog content */}
        <div className="p-4 md:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Choose Donation Type
                </h2>
                <p className="text-gray-600 mt-2">
                  Select how you would like to donate
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => {
                    setDonationType("international");
                    handleNext();
                  }}
                  className={`p-6 border-2 rounded-xl flex flex-col items-center gap-4 hover:border-teal-500 transition-colors
                      ${
                        donationType === "international"
                          ? "border-teal-500"
                          : "border-gray-200"
                      }`}
                >
                  <FaGlobe className="w-12 h-12 text-teal-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      International Donation
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Donate from anywhere in the world
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setDonationType("national");
                    handleNext();
                  }}
                  className={`p-6 border-2 rounded-xl flex flex-col items-center gap-4 hover:border-teal-500 transition-colors
                      ${
                        donationType === "national"
                          ? "border-teal-500"
                          : "border-gray-200"
                      }`}
                >
                  <FaFlag className="w-12 h-12 text-teal-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">National Donation</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Donate within your country
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <MdKeyboardArrowLeft size={24} />
                <span>Back</span>
              </button>

              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold">Bank Details</h2>
                <p className="text-gray-600 mt-2">
                  {donationType === "international"
                    ? "International Transfer Details"
                    : "National Transfer Details"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <BsBank2 className="w-8 h-8 text-teal-500" />
                  <div>
                    <h3 className="font-semibold">Bank Account Details</h3>
                    <p className="text-gray-600 text-sm">
                      Please transfer to the following account
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-medium">Example Bank</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium">1234 5678 9012 3456</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">SWIFT/BIC:</span>
                    <span className="font-medium">EXBKABCD</span>
                  </div>
                  {donationType === "international" && (
                    <div className="grid grid-cols-2">
                      <span className="text-gray-600">IBAN:</span>
                      <span className="font-medium">
                        GB29 NWBK 6016 1331 9268 19
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 max-h-[80vh] overflow-y-auto px-2">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                <MdKeyboardArrowLeft size={24} />
                <span>Back</span>
              </button>

              <div className="text-center">
                <h2 className="text-xl md:text-3xl font-bold">
                  Complete Your Donation
                </h2>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                  Please provide your information for donation receipt
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-3 md:space-y-4">
                  {/* Name Input */}
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                        placeholder="Enter your full name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Email Input (New) */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdEmail className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                        placeholder="Enter your email address"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* PAN Card Input with Tax Benefit Notice */}
                  <div className="relative space-y-2">
                    <label
                      htmlFor="panCard"
                      className="block text-sm font-medium text-gray-700"
                    >
                      PAN Card Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="panCard"
                        value={formData.panCard}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            panCard: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white uppercase text-sm md:text-base"
                        placeholder="Enter PAN card number"
                        required
                        disabled={isSubmitting}
                        maxLength={10}
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        title="Please enter a valid PAN card number (e.g., ABCDE1234F)"
                      />
                    </div>
                    <div className="flex items-start space-x-2 bg-blue-50 p-2 md:p-3 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaInfoCircle className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mt-0.5" />
                      </div>
                      <p className="text-xs md:text-sm text-blue-700">
                        Provide your PAN to avail tax benefits under Section
                        80G. You can claim up to 50% of your donation amount as
                        a deduction.
                      </p>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="relative">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Amount Paid
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaRupeeSign className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="amount"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                        placeholder="Enter amount paid"
                        required
                        disabled={isSubmitting}
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Receipt Upload */}
                  <div className="space-y-2">
                    <label
                      htmlFor="receipt"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Transaction Receipt
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="receipt"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif,application/pdf"
                        required
                        disabled={isSubmitting}
                        ref={fileInputRef} // Attach the ref to the file input
                      />
                      <label
                        htmlFor="receipt"
                        className={`group relative flex items-center justify-center w-full p-4 md:p-6 border-2 border-dashed border-gray-300 rounded-xl ${
                          isSubmitting
                            ? "cursor-not-allowed opacity-70"
                            : "cursor-pointer hover:border-teal-500"
                        } transition-all duration-200`}
                      >
                        <div className="space-y-2 md:space-y-3 text-center">
                          <FaCloudUploadAlt className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400 group-hover:text-teal-500 transition-colors" />
                          <div className="text-gray-600 text-sm md:text-base">
                            <span className="font-medium text-teal-500 hover:underline">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                            <p className="text-xs mt-1">
                              PNG, JPG, GIF or PDF (max. 10MB)
                            </p>
                          </div>
                        </div>
                        {formData.receipt && (
                          <div className="absolute inset-0 flex items-center justify-center bg-teal-50 rounded-xl">
                            <div className="flex items-center space-x-2 text-teal-700 text-sm md:text-base">
                              <FaCheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                              <span className="truncate max-w-xs">
                                {formData.receipt.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Upload Progress Bar (visible during upload) */}
                {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-teal-500 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-1 text-right">
                      Uploading: {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-500 text-white py-3 md:py-4 rounded-xl font-medium hover:bg-teal-600 transition-all duration-200 flex items-center justify-center space-x-2 text-base md:text-lg mt-4 disabled:bg-teal-300 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Donation</span>
                      <FaArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDialog;
