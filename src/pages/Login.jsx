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
      <div className="overflow-hidden">
        <div className="flex flex-wrap">
          {/* <!-- Left Column --> */}
          <div className="w-full sm:w-1/2  relative">
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
              <div>
                <img src={Loginimg} alt="Login" />
              </div>
            </div>
          </div>

          {/* <!-- Right Column --> */}
          <div className="w-full sm:w-1/2 flex flex-col justify-center p-4">
            <div className="w-full max-w-md mx-auto">
              <div className="flex flex-col gap-4">
                <p className="text-4xl font-semibold text-center mt-10 md:mt-12">
                  Login
                </p>
                <p className="text-xl text-gray-500 text-center mt-10">
                  Welcome! Login in to your account
                </p>

                <div className="mt-3">
                  <label htmlFor="email" className="block mb-1 text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    value={userData.email}
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
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    type="password"
                    value={userData.password}
                    className="w-full p-2 border border-gray-200 bg-slate-100 rounded"
                  />
                </div>
                <a href="#" className="text-blue-600 underline text-center">
                  I ve forgotten password
                </a>

                <Link
                  to="/"
                  onClick={() => login(userData)}
                  className="bg-[#049D8E] text-white text-center w-full py-2 rounded mt-6"
                >
                  Login
                </Link>
                <div className="text-gray-500 text-center mt-5">or</div>
              </div>

              <div className="mt-5 flex justify-center gap-5">
                <img
                  src={Googleicon}
                  alt="Google Login"
                  onClick={gooleLogin}
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
                  Don’t have an account?{" "}
                  <a
                    href="/signup"
                    className="text-[#049D8E] font-medium underline"
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
