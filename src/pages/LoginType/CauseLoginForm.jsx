import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Googleicon from "../../assets/googleicon.png";
import Facebookicon from "../../assets/facebookicon.png";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../../firebase";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  ngoUserExist,
  ngoUserNotExist,
} from "../../redux/reducer/ngoUserReducer";

const CauseLoginForm = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Query Firestore for the user with the provided email
      const q = query(
        collection(db, "causeDetails"),
        where("email", "==", userData.email)
      );
      const Userquery = await getDocs(q);

      if (Userquery.empty) {
        throw new Error("No user found with this email.");
      }

      // Get the first matching document
      const userDoc = Userquery.docs[0];
      const user = userDoc.data();

      // Validate the password (if you're not using Firebase Authentication)
      if (user.password !== userData.password) {
        throw new Error("Incorrect password.");
      }
      dispatch(ngoUserExist(user));
      // If everything is valid, navigate to the dashboard
      navigate(`/ngo-dashboard/${userDoc.id}/dashboard`);
    } catch (error) {
      dispatch(ngoUserNotExist(null));
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const GoogleSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInWithPopup(auth, provider);
      console.log(res);
      await setDoc(doc(db, "causeDetails", res.user.uid), {
        fname: res.user.displayName,
        email: res.user.email,
        profilePic: res.user.photoURL,
      });

      navigate(`/ngo-dashboard/${res.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
        <a href="#" className="text-blue-700 text-center">
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
          <a href="/signup" className="text-[#049D8E] font-medium underline">
            Signup
          </a>
        </p>
      </div>
    </form>
  );
};

export default CauseLoginForm;
