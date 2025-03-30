import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ShoppingBag from "../assets/ShoppingBag.png";
import Backimg13 from "../assets/backimg13.png";

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    description: "Shoppinessmart is a platform that turns your everyday online shopping into a force for good. By simply shopping through our website or app, you can support your favorite charities without spending a penny extra.",
    phone: "+91 6368900045",
    email: "email@gmail.com"
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const infoDocRef = doc(db, "contacts", "info");
        const infoDocSnap = await getDoc(infoDocRef);

        if (infoDocSnap.exists()) {
          const data = infoDocSnap.data();
          setContactInfo({
            description: data.description || contactInfo.description,
            phone: data.phone || contactInfo.phone,
            email: data.email || contactInfo.email
          });
        } else {
          console.log("No contact info document found!");
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <div>
      <div className=" mx-auto bg-[#049D8E] py-20 z-10  mt-5 overflow-hidden lg:justify-center items-center ">
        <div className=" w-44 hidden md:block lg:block"></div>

        <div className="mx-4 flex flex-wrap lg:justify-center items-center ">
          <div className="w-full   px-8 sm:w-2/3 lg:w-3/12">
            <div className=" mb-10 mt-3 w-full">
              <a href="" className="mb-6 inline-block w-full">
                <img src={ShoppingBag} alt="" className="" />
              </a>
              <p className="mb-7 text-lg text-white">
                {contactInfo.description}
              </p>
              <p className="flex items-center text-lg  text-white">
                <span className="mr-3 text-[#FFD705]">Call Us:</span>
                <span>+91 {contactInfo.phone}</span>
              </p>
              <p className="flex items-center text-lg mt-4  text-white">
                <span className="mr-3 text-[#FFD705]">Email Us:</span>
                <span>{contactInfo.email}</span>
              </p>
            </div>
          </div>
          <div className="w-full  px-8 sm:w-1/2 lg:w-2/12">
            <div className="mb-10 w-full mt-7">
              <h4 className="mb-9 text-3xl font-semibold text-white">
                Latest Posts
              </h4>
              <ul>
                <li>
                  <a href="" className="mb-2 inline-block text-xl  text-white ">
                    New post 1
                  </a>
                  <p className="text-[#FFD705]">12 feb,2024</p>
                </li>
                <li>
                  <a
                    href=""
                    className="mb-2 inline-block text-xl mt-2  text-white "
                  >
                    New post 2
                  </a>
                  <p className="text-[#FFD705] mt-1">12 feb,2024</p>
                </li>
                <li>
                  <a
                    href=""
                    className="mb-2 inline-block text-xl mt-2 text-white "
                  >
                    New post 3
                  </a>
                  <p className="text-[#FFD705]">12 feb,2024</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full px-8 sm:w-1/2 lg:w-2/12">
            <div className="mb-10 w-full mt-7">
              <h4 className="mb-9 text-3xl font-semibold text-white">Links</h4>
              <ul>
                <li>
                  <Link
                    to="/"
                    className="mb-2 inline-block text-xl font-medium text-white "
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="mb-2 inline-block text-xl mt-2 font-medium  text-white "
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="mb-2 inline-block text-xl font-medium mt-2  text-white "
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="mb-2 inline-block text-xl font-medium mt-2   text-white "
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="mb-2 inline-block text-xl font-medium mt-2  text-white "
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full px-8  sm:w-1/2 lg:w-1/3 ">
            <div className="mb- w-full ">
              <img src={Backimg13} alt="" className="" />
            </div>
          </div>
        </div>
      </div>

      {/* 14th page */}

      <div className="bg-[#EDF6FB] mt-3 w-full md:px-10 lg:justify-between md:p-5 py-5 md:flex-row">
        <div className="flex justify-between ">
          <p className="text-[#048376] text-sm">
            © {new Date().getFullYear()} UX/UI Team
          </p>

          <div className="text-[#048376] flex md:gap-6">
            <i className="bi bi-instagram"></i>
            <i className="bi bi-twitter ml-2"></i>
            <i className="bi bi-facebook ml-2"></i>
          </div>
          <div className="">
            <p className="text-[#048376] text-sm">All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;