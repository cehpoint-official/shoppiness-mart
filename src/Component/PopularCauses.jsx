import React from "react";
import Card7th1 from "../assets/card7th1.png";
import Card7th2 from "../assets/card7th2.png";
import Card7th3 from "../assets/card7th3.png";
const PopularCauses = () => {
  return (
    <div className="mt-auto mx-auto px-4 md:px-40 pt-8 pb-6 ">
      <p className="font-bold text-4xl text-center font-slab">
        Our Popular Causes
      </p>
      <p className="text-gray-500 text-lg text-center mx-auto  mt-8">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
      </p>
      <p className="text-gray-500 text-lg   text-center mx-auto  ">
        Blanditiis,commodi tempora mollitia voluptatem
      </p>

      <div className="flex flex-wrap justify-center  mt-7">
        <div className="border-2  md:w-80 mt-10 md:mt-0 md:mr-4 rounded-xl shadow-xl">
          <div className="">
            <img src={Card7th1} alt="" className="" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-center font-slab">
              Healthy Food For All
            </p>
            <p className=" font-normal text-center text-[#049D8E] mt-2">
              Child health Care{" "}
            </p>
            <p className=" text-gray-600 font-normal text-center mt-2 ">
              400 Supports, 5,000000 raised{" "}
            </p>

            <p className="text-gray-500 mt-5 mx-4 text-center pb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae d
            </p>
          </div>
        </div>
        <div className="border-2 md:w-80 mt-10 md:mt-0 md:mx-4 rounded-xl shadow-xl">
          <div className="">
            <img src={Card7th2} alt="" className="" />
          </div>
          <div className="mt-5">
            <p className="text-2xl font-semibold text-center font-slab">
              Animal Care
            </p>
            <p className="font-normal text-center text-[#049D8E] mt-1">
              Animal Care{" "}
            </p>
            <p className=" text-gray-600 font-normal text-center mt-1 ">
              400 Supports, 5,000000 raised{" "}
            </p>

            <p className="text-gray-500 mt-4 mx-4 text-center pb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae d
            </p>
          </div>
        </div>
        <div className="border-2 md:w-80 mt-10 md:mt-0 md:mx-4 rounded-xl shadow-xl">
          <div className="">
            <img src={Card7th3} alt="" className="" />
          </div>
          <div className="mt-5">
            <p className="text-2xl font-semibold text-center font-slab">
              Green World
            </p>
            <p className="font-normal text-center text-[#049D8E] mt-1">
              Green World{" "}
            </p>
            <p className=" text-gray-600 font-normal text-center mt-1 ">
              400 Supports, 5,000000 raised{" "}
            </p>

            <p className="text-gray-500 mt-4 mx-4 text-center pb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae d
            </p>
          </div>
        </div>

        <div className="mt-7">
          <p className="text-gray-600 text-2xl">
            See all <span className="text-black font-bold">5,000+</span> Causes{" "}
            <i class="bi bi-arrow-right  "></i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopularCauses;
