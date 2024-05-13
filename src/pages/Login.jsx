import { useState } from "react";
import Backimg from "../assets/backimg.png";
import Loginimg from "../assets/loginimg.png";
import ShoppingBag2 from "../assets/ShoppingBag2.png";
import Googleicon from "../assets/googleicon.png";
import Facebookicon from "../assets/facebookicon.png";
import {
  useContinueWithGoogleMutation,
  useLazyLoginQuery,
} from "../redux/api/AuthApi";
import { Link } from "react-router-dom";

const Login = () => {
  const [login] = useLazyLoginQuery();
  const [gooleLogin] = useContinueWithGoogleMutation();

  const [userData, setUserData] = useState({
    // email: "yadavuma419@gmail.com",
    // password: '123456'
  });

  return (
    <>
      <div className="overflow-hidden ">
        <div className="grid grid-cols-1 sm:grid-cols-2 ">
          <div className="">
            <div className="absolute  ">
              <img src={Backimg} alt="" className=" " />
            </div>
            <div className="relative ">
              <div className="mx-10 mt-5">
                <img src={ShoppingBag2} alt="" className="h-11   " />
              </div>
              <div className="">
                <img src={Loginimg} alt="" className="" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="">
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <p className="text-4xl font-semibold text-center mt-10 md:mt-12">
                  Login
                </p>
                <p className="text-xl text-gray-500 text-center mt-10">
                  Welcome! Login in to your account
                </p>

                <div className="mx-auto md:mx-32 mt-3">
                  <label
                    htmlFor="email"
                    className="block mb-1 text-gray-600 mx-24   "
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    value={userData.email}
                    className="w-64 md:w-80 p-2 border m border-gray-200 bg-slate-100 rounded mx-24"
                  />
                </div>
                <div className="mx-auto md:mx-32">
                  <label
                    htmlFor="password"
                    className="block mb-1 text-gray-600 mx-24"
                  >
                    Password
                  </label>
                  <input
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    type="password"
                    value={userData.password}
                    className="w-64 md:w-80 p-2 border border-gray-200 bg-slate-100 rounded mx-24"
                  />
                </div>
                <a href="" className="text-blue-600 underline text-center ">
                  I’ve forgotten password
                </a>

                <Link
                  to="/"
                  onClick={(e) => login(userData)}
                  className="bg-[#049D8E] text-white mx-28 text-center  md:mx-56 w-64 md:w-80 px-4 py-2 rounded mt-14 md:mt-6"
                >
                  Login
                </Link>
                <div className="text-gray-500 text-center mt-5">or</div>
              </div>

              <div className="mt-5 md:flex md:justify-center">
                <div className="mx-44 md:mx-0 md:mr-5 ">
                  <img
                    src={Googleicon}
                    alt=""
                    onClick={gooleLogin}
                    className="border-2 px-8 py-2 rounded-md  md:w-1/2 lg:w-auto"
                  />
                </div>

                <div className="mx-44 md:mx-0 mt-5 md:mt-0 ">
                  <img
                    src={Facebookicon}
                    alt=""
                    className="border-2 px-8 py-2 rounded-md md:w-1/2 lg:w-auto"
                  />
                </div>
              </div>
              <div className="mt-7 text-center">
                <p className="font-medium text-lg">
                  Don’t have an account?{" "}
                  <a
                    href="/signup"
                    className=" text-[#049D8E] font-medium underline"
                  >
                    Signup
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

export default Login;
