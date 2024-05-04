import ShoppingBag from "../assets/ShoppingBag.png";
import Backimg13 from "../assets/backimg13.png";
const Footer = () => {
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem
              </p>
              <p className="flex items-center text-lg  text-white">
                <span className="mr-3 text-[#FFD705]">Call Us</span>
                <span> +91 6368900045</span>
              </p>
              <p className="flex items-center text-lg mt-4  text-white">
                <span className="mr-3 text-[#FFD705]">Email Us</span>
                <span> email@gmail.com</span>
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
                  <a
                    href=""
                    className="mb-2 inline-block text-xl font-medium text-white "
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="mb-2 inline-block text-xl mt-2 font-medium  text-white "
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="mb-2 inline-block text-xl font-medium mt-2  text-white "
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="mb-2 inline-block text-xl font-medium mt-2   text-white "
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="mb-2 inline-block text-xl font-medium mt-2  text-white "
                  >
                    Blogs
                  </a>
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

      <div className="bg-[#EDF6FB] mt-3 w-full px-3 lg:justify-between p-5 md:flex-row">
        <div className="flex justify-between ">
          <p className="text-[#048376]">© 2024 UX/UI Team</p>
          <div className="text-[#048376] ">
            <i className="bi bi-instagram"></i>
            <i className="bi bi-twitter ml-2"></i>
            <i className="bi bi-facebook ml-2"></i>
          </div>
          <div className="">
            <p className="text-[#048376]">All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
