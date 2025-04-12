import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Googleicon from "../../assets/googleicon.png";
import Facebookicon from "../../assets/facebookicon.png";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExist } from "../../redux/reducer/userReducer";

const UserLoginForm = ({userType}) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = res.user;
  
      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      let userRole = "user";  // Default role
      if (userDocSnap.exists()) {
        // If user document exists, get the role from Firestore
        const existingUserData = userDocSnap.data();
        userRole = existingUserData.role || "user";
      } else {
        // Create user document if it doesn't exist
        await setDoc(userDocRef, {
          email: user.email,
          role: "user",
          // Add other default fields as needed
        });
      }

      // Store user role in localStorage
      localStorage.setItem("userRole", userRole);
  
      // Dispatch user data to Redux
      dispatch(userExist({
        ...user,
        role: userRole
      }));
  
      toast.success("Login successful!");
      setTimeout(() => {
        if (userRole === "admin") {
          navigate(`/admin/${user.uid}/shoppiness/dashboard`);
        } else {
          navigate(`/user-dashboard/${user.uid}/dashboard`);
        }
      }, 1000);
    } catch (error) {
      toast.error(
        error.code === "auth/wrong-password"
          ? "Incorrect password"
          : error.message
      );
    }
    setLoading(false);
  };

  const GoogleSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Signing in with Google...");
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
  
      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      let userRole = "user";  // Default role
      if (!userDocSnap.exists()) {
        // Save user data to Firestore only if it doesn't exist
        await setDoc(userDocRef, {
          fname: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
          role: "user",
        });
      } else {
        // If user exists, get the existing role
        const existingUserData = userDocSnap.data();
        userRole = existingUserData.role || "user";
      }

      // Store user role in localStorage
      localStorage.setItem("userRole", userRole);
  
      // Dispatch user data to Redux
      dispatch(userExist({
        ...user,
        role: userRole
      }));
  
      setLoading(false);
      toast.success("Google sign-in successful!");
      if (userRole === "admin") {
        navigate(`/admin/${user.uid}/shoppiness/dashboard`);
      } else {
        navigate(`/user-dashboard/${user.uid}/dashboard`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        <p className="text-4xl font-semibold text-center mt-10 md:mt-12">
          Login
        </p>
        <p className="text-xl text-gray-500 text-center mt-10">
          Welcome! Login in to your account
        </p>
        {loading && (
          <span className="text-green-500 font-semibold">Logging in...</span>
        )}
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
          <input
            required
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            type="password"
            value={userData.password}
            className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
          />
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
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#049D8E] font-medium underline">
            Signup
          </Link>
        </p>
      </div>
    </form>
  );
};

export default UserLoginForm;
