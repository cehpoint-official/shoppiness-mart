import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Googleicon from "../../assets/googleicon.png";
import Facebookicon from "../../assets/facebookicon.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../../firebase";
import toast from "react-hot-toast";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { businessUserExist } from "../../redux/reducer/businessUserReducer";

const BusinessLoginForm = ({ userType }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "businessDetails"),
        where("email", "==", userData.email)
      );
      const Userquery = await getDocs(q);

      if (Userquery.empty) {
        throw new Error("No user found with this email.");
      }

      const userDoc = Userquery.docs[0];
      const user = userDoc.data();

      if (user.password !== userData.password) {
        throw new Error("Incorrect password.");
      }

      // Check if user status is active
      if (user.status !== "Active") {
        throw new Error(
          "Your account is pending approval from ShoppineSmart. Please wait for activation."
        );
      }

      dispatch(businessUserExist(user));
      toast.success("Login successful!");
      navigate(`/services-dashboard/${userDoc.id}/dashboard`);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const GoogleSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    toast.loading("Signing in with Google...");

    try {
      const res = await signInWithPopup(auth, provider);

      // Check if user already exists
      const q = query(
        collection(db, "businessDetails"),
        where("email", "==", res.user.email)
      );
      const userQuery = await getDocs(q);

      if (!userQuery.empty) {
        const existingUser = userQuery.docs[0].data();

        // Check status for existing users
        if (existingUser.status !== "Active") {
          throw new Error(
            "Your account is pending approval from ShoppineSmart. Please wait for activation."
          );
        }

        dispatch(businessUserExist(existingUser));
        toast.success("Google sign-in successful!");
        navigate(`/services-dashboard/${userQuery.docs[0].id}/dashboard`);
      } else {
        // For new users, set initial status as "Pending"
        await setDoc(doc(db, "businessDetails", res.user.uid), {
          fname: res.user.displayName,
          email: res.user.email,
          profilePic: res.user.photoURL,
          status: "Pending",
        });
        toast.error(
          "Your account is pending approval from ShoppineSmart. Please wait for activation."
        );
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <form className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        <p className="text-4xl font-semibold text-center mt-10 md:mt-12">
          Login
        </p>
        <p className="text-xl text-gray-500 text-center mt-10">
          Welcome! Login to your account
        </p>
        {loading && (
          <span className="text-green-500 font-semibold">Logging in...</span>
        )}
        {error && <span className="text-red-500 font-semibold">{error}</span>}

        <div className="mt-3">
          <label htmlFor="email" className="block mb-1 text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            required
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            value={userData.email}
            className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-gray-600">
            Password
          </label>
          <div className="relative">
            <input
              required
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              value={userData.password}
              className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </div>
          </div>
        </div>
        <a href={`/forgot-password/${userType}`} className="text-blue-700 text-center">
          Forgot password?
        </a>

        <button
          onClick={submitHandler}
          type="submit"
          className="bg-[#049D8E] text-white text-center w-full py-2 rounded mt-6"
        >
          Login
        </button>
        <div className="text-gray-500 text-center mt-5">or</div>
      </div>

      <div className="mt-5 flex justify-center gap-5">
        <img
          src={Googleicon}
          alt="Google Login"
          className="border-2 px-8 py-2 rounded-md cursor-pointer"
          onClick={GoogleSubmitHandler}
        />
        <img
          src={Facebookicon}
          alt="Facebook Login"
          className="border-2 px-8 py-2 rounded-md cursor-pointer"
        />
      </div>
      <div className="mt-7 text-center">
        <p className="font-medium text-lg">
          Don&apos;t have an account?{" "}
          <Link
            to="/business-form"
            className="text-[#049D8E] font-medium underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </form>
  );
};

export default BusinessLoginForm;
