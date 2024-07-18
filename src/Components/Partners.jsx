import img1 from "../assets/Home/img1.png";
import img2 from "../assets/Home/img2.png";
import img3 from "../assets/Home/img3.png";
import img4 from "../assets/Home/img4.png";
import img5 from "../assets/Home/img5.png";
import img6 from "../assets/Home/img6.png";
import img7 from "../assets/Home/img7.png";
import img8 from "../assets/Home/img8.png";
import img9 from "../assets/Home/img9.png";
import img10 from "../assets/Home/img10.png";
// eslint-disable-next-line react/prop-types
const Partners = ({ title, para }) => {
  return (
    <div>
      <div className="mt-10 mx-auto px-4 md:px-40 bg-[#EEFAF9] py-12 mb-40 ">
        <div>
          <h1 className="font-bold md:text-4xl text-2xl text-center font-slab ">
            {title}
          </h1>
          <p className="text-gray-600 md:text-xl text-sm text-center mx-auto  md:mt-8 mt-4">
            {para}
          </p>
        </div>

        <div className="">
          <div className="text-[#047E72] font-medium text-lg text-center md:mt-10 mt-4">
            Online partners
          </div>
          <div className="flex justify-center items-center flex-wrap md:gap-9 gap-4">
            <div className="mt-6  md:flex-row">
              <img
                src={img1}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={img2}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={img3}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={img4}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={img5}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="text-[#047E72] font-medium text-lg text-center md:mt-10 mt-4">
            Offline partners
          </div>

          <div className="flex justify-center items-center flex-wrap md:gap-9 gap-4">
            <div className="mt-6  md:flex-row">
              <img
                src={img6}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={img7}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={img8}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={img9}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md "
              />
            </div>
            <div className="mt-6">
              <img
                src={img10}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <p className="text-xl">
            See all <span className="font-bold">6,000 + </span> Plateforms{" "}
            <i className="bi bi-arrow-right"></i>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Partners;
