import Cashbackimg1 from "../assets/Cashback/Cashbackimg1.png";
import Cashbackimg2 from "../assets/Cashback/Cashbackimg2.png";
import Cashbackimg3 from "../assets/Cashback/Cashbackimg3.png";

const Cashback = () => {
  return (
    <>
      {/*  */}
      {/* 1st page */}
      <div className="my-28  ">
        <div className="grid grid-cols-12 mx-4 md:mx-16 px-4 md:px-10">
          <div className="col-span-12 md:col-span-6">
            <p className="text-2xl md:text-4xl font-semibold mt-16 md:mt-12">
              What is Cash back Charity
            </p>
            <p className="text-base md:text-xl text-gray-500 mt-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum{" "}
            </p>
            <p className="text-base md:text-xl text-gray-500 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum{" "}
            </p>
            <button
              type="button"
              className="bg-[#049D8E] rounded-md py-2 px-4 text-white  mt-5"
            >
              Sign up for free
            </button>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-wrap justify-center md:justify-start">
              <img src={Cashbackimg1} alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* 2nd page */}
      <div className="bg-[#EDF6FB] pt-10 pb-10 ">
        <div className="grid grid-cols-12 mx-4 md:mx-16 px-4 md:px-10">
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-wrap justify-center md:justify-start">
              <img src={Cashbackimg2} alt="" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 mx-7 ">
            <p className="text-2xl md:text-4xl font-semibold mt-16 md:mt-12">
              How cash back charity Works
            </p>
            <p className="text-base md:text-xl text-gray-500 mt-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum{" "}
            </p>
            <p className="text-base md:text-xl text-gray-500 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum{" "}
            </p>
            <button
              type="button"
              className="bg-[#049D8E] rounded-md py-2 px-4 text-white  mt-5"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
      {/* 3rd page */}
      <div className="my-28  ">
        <div className="grid grid-cols-12 mx-4 md:mx-16 px-4 md:px-10">
          <div className="col-span-12 md:col-span-6">
            <p className="text-2xl md:text-4xl font-semibold mt-16 md:mt-12">
              Help from Cash back charity
            </p>
            <p className="text-base md:text-xl text-gray-500 mt-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum{" "}
            </p>
            <p className="text-base md:text-xl text-gray-500 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum{" "}
            </p>
            <button
              type="button"
              className="bg-[#049D8E] rounded-md py-2 px-4 text-white  mt-5"
            >
              Sign up for free
            </button>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-wrap justify-center md:justify-start">
              <img src={Cashbackimg3} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cashback;
