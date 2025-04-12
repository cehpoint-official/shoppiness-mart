import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Backimg from "../assets/backimg.png";
import forgotPassword from "../assets/forgotPassword.png";
import ShoppingBag2 from "../assets/ShoppingBag2.png";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { userType } = useParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      let errorMessage = "Failed to send reset email";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* <!-- Left Column --> */}
      <div className="w-full md:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src={Backimg}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <div className="mx-10 mt-5">
            <img src={ShoppingBag2} alt="Shopping Bag" className="h-11" />
          </div>
          <div className="lg:relative lg:mx-28">
            <img src={forgotPassword} alt="ForgotPassword" className="w-full" />
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-6 py-8 md:py-0">
        <div className="w-full max-w-md">
          {!resetSent ? (
            <form className="flex flex-col gap-4">
              <p className="text-4xl font-semibold text-center">
                Forgot Password
              </p>
              <p className="text-xl text-gray-500 text-center mt-6">
                Enter your email to reset your password
              </p>
              {loading && (
                <span className="text-green-500 font-semibold text-center">
                  Processing...
                </span>
              )}
              <div className="mt-3">
                <label htmlFor="email" className="block mb-1 text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
                  placeholder="Your registered email"
                />
              </div>

              <button
                onClick={handleSubmit}
                type="submit"
                disabled={loading}
                className="bg-[#049D8E] text-white text-center w-full py-2 rounded mt-6"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-2xl font-semibold text-center">Email Sent!</p>
              <p className="text-gray-500 text-center max-w-sm mt-2">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions.
              </p>
              <button
                onClick={() => setResetSent(false)}
                className="text-[#049D8E] font-medium mt-4"
              >
                Didn't receive it? Send again
              </button>
            </div>
          )}

          <div className="mt-7 text-center">
            <p className="font-medium text-lg">
              Remember your password?{" "}
              <Link to={`/login/${userType}`} className="text-[#049D8E] font-medium underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;