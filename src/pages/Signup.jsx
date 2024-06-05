import { useState } from "react";
import Backimg from "../assets/backimg.png";
import ShoppingBag2 from "../assets/ShoppingBag2.png";
import Signupimg from "../assets/signupimg.png";
import Googleicon from "../assets/googleicon.png";
import Facebookicon from "../assets/facebookicon.png";
import { useRegisterMutation } from "../redux/api/AuthApi";
const Signup = () => {
  const [Register] = useRegisterMutation();
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
  });
  return (
    <>
  <div className="overflow-hidden">
  <div className="grid grid-cols-1 sm:grid-cols-2">
    {/* Left Column */}
    <div className="relative">
      <div className="absolute inset-0">
        <img src={Backimg} alt="Background" className="w-full h-full object-cover" />
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
        <div className="flex flex-col gap-4">
          <p className="text-4xl font-semibold text-center mt-10">Signup</p>
          <p className="text-xl text-gray-500 text-center mt-2">Welcome! Create a new account</p>

          <div className="mt-3">
            <label htmlFor="firstName" className="block mb-1 text-gray-600">First Name</label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-1 text-gray-600">Last Name</label>
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1 text-gray-600">Phone Number</label>
            <input
              type="number"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-600">Email Address</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
            />
          </div>
          <div className="text-center mt-2">
            <input className="form-check-input h-4 w-4" type="checkbox" />
            <label className="form-check-label text-gray-500 ml-2">I agree with terms conditions and privacy policy</label>
          </div>

          <button
            onClick={(e) => Register(userData)}
            className="bg-[#049D8E] text-white w-full py-2 rounded mt-4"
          >
            Create account
          </button>
          <div className="text-gray-500 text-center mt-5">or</div>
        </div>

        <div className="mt-5 flex justify-center gap-4">
          <img
            src={Googleicon}
            alt="Google Login"
            className="border-2 px-8 py-2 rounded-md cursor-pointer"
          />
          <img
            src={Facebookicon}
            alt="Facebook Login"
            className="border-2 px-8 py-2 rounded-md cursor-pointer"
          />
        </div>
        <div className="mt-7 text-center">
          <p className="font-medium text-lg">
            Already have an account? <a href="/login" className="text-[#049D8E] font-medium underline">Login</a>
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
