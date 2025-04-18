import { Link } from "react-router-dom";
import Cashbackimg1 from "../assets/Cashback/Cashbackimg1.png";
import Cashbackimg2 from "../assets/Cashback/Cashbackimg2.png";
import Cashbackimg3 from "../assets/Cashback/Cashbackimg3.png";

const Cashback = () => {
  return (
    <>
      {/* 1st page */}
      <div className="mb-16 md:mb-28 mt-16">
        <div className="grid grid-cols-12 mx-4 md:mx-16 px-4 md:px-10">
          <div className="col-span-12 md:col-span-6 max-w-xl">
            <p className="text-2xl md:text-4xl font-semibold -mt-5 md:mt-8">
              What is Cash back Charity
            </p>
            <p className="text-base md:text-xl text-gray-500 mt-7">
              At <span className="font-semibold">ShoppinessMart</span>, we believe that every purchase has the power to do more. With our Cashback Charity initiative, a portion of the cashback you earn on your everyday shopping is directed towards supporting meaningful causes.
            </p>
            <br />
            <p className="text-base md:text-xl text-gray-500 ">
              Whether you're shopping for electronics, fashion, or essentials - you're not just getting great deals, you're also enabling positive change. We partner with verified charities and social impact projects to ensure your contributions make a real difference in people's lives.
            </p>
            <Link to="/cause-form">
              <button
                type="button"
                className="bg-[#049D8E] rounded-md py-2 px-4 text-white mt-5"
              >
                Sign up for free
              </button>
            </Link>
          </div>
          <div className="col-span-12 md:col-span-6 mt-14 md:mt-0">
            <div className="flex flex-wrap justify-center md:justify-start">
              <img src={Cashbackimg1} alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* 2nd page */}
      <div className="bg-[#EDF6FB] py-20 ">
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
              When you shop through <span className="font-semibold">ShoppinessMart</span>, you earn cashback just like any other rewards platform. The difference? You can choose to donate a portion or all of your cashback to a cause you care about - with just one click.
            </p>
            <br />
            <p className="text-base md:text-xl text-gray-500 ">
              We track your purchases, calculate your cashback, and make the donation process seamless and transparent. You'll receive updates on how your contributions are used and the impact they've created.
            </p>
            <Link to="/signup">
              <button
                type="button"
                className="bg-[#049D8E] rounded-md py-2 px-4 text-white  mt-5"
              >
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3rd page */}
      <div className="mb-20 md:mt-16">
        <div className="grid grid-cols-12 mx-4 md:mx-16 px-4 md:px-10">
          <div className="col-span-12 md:col-span-6 max-w-xl">
            <p className="text-2xl md:text-4xl font-semibold mt-16 md:mt-12">
              Help from Cash back charity
            </p>
            <p className="text-base md:text-xl text-gray-500 mt-7">
              Your small cashback contributions can create big waves. From supporting children's education and providing meals for the underprivileged, to funding women-led businesses and local green initiatives - the possibilities are endless.
            </p>
            <br />
            <p className="text-base md:text-xl text-gray-500 ">
              When many shoppers come together to give a little, we collectively create a large-scale impact. And it all starts with something as simple as your regular online shopping habits.
            </p>
            <Link to="/cause-form">
              <button
                type="button"
                className="bg-[#049D8E] rounded-md py-2 px-4 text-white mt-5"
              >
                Sign up for free
              </button>
            </Link>
          </div>
          <div className="col-span-12 md:col-span-6 mt-14 md:mt-0">
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