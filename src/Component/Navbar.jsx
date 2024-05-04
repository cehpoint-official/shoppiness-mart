import ShoppingBag from "../assets/ShoppingBag.png";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <div className="font-slab">
        <div className="max-screen-xl bg-[#049D8E]  px-12 flex flex-wrap items-center justify-between mx-auto p-4">
          <div>
            <img src={ShoppingBag} className="h-11 " alt="Loading..." />
          </div>

          <div className="flex md:order-2 space-x-3 md:space-x-5   ">
            <div className="flex border-2 border-gray-100 bg-[#049D8E] rounded-md">
              <Link
                to="/login"
                className="text-white flex items-center  justify-items-center px-3 py-1 gap-2 "
              >
                <i className="bi bi-arrow-right-circle-fill text-white "></i>
                Login
              </Link>
            </div>

            <div className="flex border-2 border-gray-100 bg-white rounded-md px-3 py-1 text-[#049D8E]">
              <Link
                to="/signup"
                className=" font-semibold flex items-center justify-items-center p-1 gap-2 "
              >
                <i className="bi bi-pencil-fill text-[#049D8E]  text-lg"></i>
                Signup
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-[#EDF6FB]">
          <div className="text-lg font-medium py-2">
            <div className="flex flex-col md:flex-row justify-center px-12  md:justify-between  pb-3 md:pb-2">
              <Link to="/" className="mt-2  md:mt-0">
                Home
              </Link>
              <Link to="/shop" className="mt-2  md:mt-0">
                Shop
              </Link>
              <Link to="/cashback" className="mt-2  md:mt-0">
                Cashback/deals
              </Link>
              <Link to="/work" className="mt-2  md:mt-0">
                How it works
              </Link>
              <Link to="/support" className="mt-2  md:mt-0">
                Support a Cause/NGO
              </Link>
              <Link to="/register-cause" className="mt-2  md:mt-0">
                Register Causes/NGO
              </Link>
              <Link to="/register-business" className="mt-2  md:mt-0">
                Register a business/Services
              </Link>
              <Link to="/support" className="mt-2  md:mt-0">
                Support Maast
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
