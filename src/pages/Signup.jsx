import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import Backimg from "../assets/backimg.png";
import ShoppingBag2 from "../assets/ShoppingBag2.png";
import Signupimg from "../assets/signupimg.png";
import Googleicon from "../assets/googleicon.png";
import Facebookicon from "../assets/facebookicon.png";
import { auth, db, provider } from "../../firebase.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { userExist } from "../redux/reducer/userReducer.js";
import { useDispatch } from "react-redux";
const Signup = () => {
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
  });
  const [cpassword, setcpassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      !userData.fname ||
      !userData.lname ||
      !userData.phone ||
      !userData.email ||
      !userData.password ||
      !cpassword ||
      terms == false
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (userData.password !== cpassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;

      await updateProfile(userCredential.user, {
        displayName: userData.fname,
      });

      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        uid: user.uid,
        role: "user",
        collectedCashback: 0,
        withdrawAmount: 0,
        givebackAmount: 0,
      });
      dispatch(userExist(user));
      toast.success("Account created successfully!");
      setcpassword("");
      setUserData({ fname: "", lname: "", phone: "", password: "", email: "" });

      setTimeout(() => {
        navigate(`/user-dashboard/${user.uid}/dashboard`);
      }, 1000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const GoogleSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      await setDoc(doc(db, "users", res.user.uid), {
        fname: res.user.displayName,
        email: res.user.email,
        profilePic: res.user.photoURL,
        role: "user",
      });
      setLoading(false);

      dispatch(userExist(user));

      toast.success("Successfully signed in with Google!");

      // Delayed navigation
      setTimeout(() => {
        navigate(`/user-dashboard/${res.user.uid}/dashboard`);
      }, 1000);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Left Column */}
          <div className="relative">
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
              <div className="flex justify-center mt-5">
                <img src={Signupimg} alt="Signup" className="w-3/4" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <form className="flex flex-col gap-4">
                <p className="text-4xl font-semibold text-center mt-10">
                  Signup
                </p>
                <p className="text-xl text-gray-500 text-center mt-2">
                  Welcome! Create a new account
                </p>
                {loading && (
                  <span className="text-green-500 font-semibold">
                    Signing up...
                  </span>
                )}

                <div className="mt-3">
                  <label htmlFor="fname" className="block mb-1 text-gray-600">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    value={userData.fname}
                    onChange={(e) =>
                      setUserData({ ...userData, fname: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="lname" className="block mb-1 text-gray-600">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userData.lname}
                    onChange={(e) =>
                      setUserData({ ...userData, lname: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1 text-gray-600">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    required
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-1 text-gray-600"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-1 text-gray-600"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={cpassword}
                    onChange={(e) => setcpassword(e.target.value)}
                    className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
                  />
                </div>
                <div className="text-center mt-2">
                  <input
                    className="form-check-input h-4 w-4"
                    type="checkbox"
                    required
                    value={terms}
                    onChange={() => setTerms(!terms)}
                  />
                  <label className="form-check-label text-gray-500 ml-2">
                    I agree with terms conditions and privacy policy
                  </label>
                </div>

                <button
                  className="bg-[#049D8E] text-white w-full py-2 rounded mt-4"
                  onClick={submitHandler}
                >
                  Create account
                </button>
                <div className="text-gray-500 text-center mt-5">or</div>
              </form>

              <div className="mt-5 flex justify-center gap-4">
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
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[#049D8E] font-medium underline"
                  >
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
