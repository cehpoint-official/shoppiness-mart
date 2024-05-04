import Home1 from "../assets/home1.png";
import OnlineP1 from "../assets/onlineP1.png";
import OnlineP2 from "../assets/onlineP2.png";
import OnlineP3 from "../assets/onlineP3.png";
import OnlineP4 from "../assets/onlineP4.png";
import OnlineP5 from "../assets/onlineP5.png";
import Shopmart1 from "../assets/Shopmart1.png";
import Shopmart2 from "../assets/shopmart2.png";
import Shopmart3 from "../assets/shopmart3.png";
//import Backimg4 from "../assets/backimg4.png"
import Card1 from "../assets/card1.png";
import Card2 from "../assets/card2.png";
import Card3 from "../assets/card3.png";
import Imgpage6 from "../assets/imgpage6.png";

import Logo1 from "../assets/logo1.png";
import Logo2 from "../assets/logo2.png";
import Logo3 from "../assets/logo3.png";
import Logo4 from "../assets/logo4.png";
import Logo5 from "../assets/logo5.png";
import Blog1 from "../assets/blog1.png";
import Blog2 from "../assets/blog2.png";
import Blog3 from "../assets/blog3.png";
import Backimg9 from "../assets/backimg9.png";
import PeopleSaySection from "../Components/PeopleSaySection";
import FAQ from "../Components/FAQ";
import PopularCauses from "../Components/PopularCauses";
const Home = () => {
  return (
    <div className="px-12 overflow-hidden">
      {/* 1st Page  */}
      <div className="carousel mx-auto  p-4  ">
        <div className="flex flex-row  space-x-4 ">
          <div className="carousel-item w-64 lg:w-full  transition-transform translate-x-2">
            <img src={Home1} className="" alt="Slide 1" />
          </div>
          <div className="carousel-item w-64 lg:w-full">
            <img src={Home1} className="" alt="Slide 2" />
          </div>
          <div className="carousel-item w-64 lg:w-auto">
            <img src={Home1} className="" alt="Slide 3" />
          </div>
        </div>
      </div>
      {/* 2nd page */}
      <div className="mt-10 mx-auto px-4 md:px-40 bg-[#EEFAF9] pt-8 pb-6 ">
        <p className="font-bold text-4xl text-center">
          Most preferred online and offline partners{" "}
        </p>
        <p className="text-gray-600 text-lg text-center mx-auto  mt-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Blanditiis,commodi tempora{" "}
        </p>
        <p className="text-gray-600 text-lg   text-center mx-auto  ">
          mollitia voluptatem recusandae impedit totam aperiam nesciunt{" "}
        </p>
        <div className="">
          <div className="text-[#047E72] font-medium text-lg text-center mt-10">
            Online partners
          </div>
          <div className="flex justify-center gap-9">
            <div className="mt-6  md:flex-row">
              <img
                src={OnlineP1}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={OnlineP2}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={OnlineP3}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={OnlineP4}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={OnlineP5}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-[#047E72] font-medium text-lg text-center mt-10">
            Offline partners
          </div>
          <div className="flex justify-center gap-9">
            <div className="mt-6  md:flex-row">
              <img
                src={OnlineP1}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={OnlineP2}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={OnlineP3}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={OnlineP4}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
            <div className="mt-6">
              <img
                src={OnlineP5}
                alt=""
                className="bg-white border-2 shadow-lg border-gray-100 px-4 py-2 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="pb-5 text-lg">
          <p className="text-center mt-16 text-gray-500">
            Sell all <span className="text-black">6,000+</span>Platforms
            <i className="bi bi-arrow-right"></i>
          </p>
        </div>
      </div>
      {/* 3rd page */}
      <div className="my-28 pb-44 ">
        <div className="grid grid-cols-12 mx-4 md:mx-10 px-4 md:px-10">
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-wrap justify-center md:justify-start">
              <img
                src={Shopmart1}
                alt=""
                className="w-32 md:w-auto md:max-w-xs mr-2 md:mr-4 mb-2 md:mb-0"
              />
              <img
                src={Shopmart2}
                alt=""
                className="w-32 md:w-auto md:max-w-xs"
              />
            </div>

            <div className="flex justify-center relative mt-4 md:mt-0">
              <img
                src={Shopmart3}
                alt=""
                className="absolute -top-10 w-24 md:w-80"
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="text-2xl md:text-4xl font-semibold mt-16 md:mt-12">
              What is ShoppinessMart?
            </p>
            <p className="text-base md:text-lg text-gray-500 mt-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis, commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum
            </p>
            <p className="text-base md:text-lg text-gray-500 mt-2 md:mt-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis, commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum
            </p>
          </div>
        </div>
      </div>
      {/* 4th page */}
      {/* <div className="grid lg:grid-cols-1 md:grid-cols-2 px-4 md:px-5 lg:px-0 gap-4 mt-16 overflow-hidden">


            <div className="col-span-1 lg:col-span-1 pb-7 lg:absolute">
                <img src={Backimg4} alt="" className="w-full lg:w-auto lg:max-w-full lg:mx-80 mt-6 lg:mt-0" />
            </div>


            <div className="col-span-6 flex flex-col justify-center items-center lg:items-start relative">
                <p className="text-xl text-gray-500 mt-6 md:mt-10 lg:mt-0 md:mx-8 lg:mx-48 lg:px-8">How it Works</p>
                <p className="text-lg font-semibold mt-4 md:mt-5 lg:mt-2 md:text-4xl lg:text-5xl lg:mx-48 lg:px-8">Cashback, Deals for you, help to others</p>
                <p className="text-base lg:text-xl text-gray-500 mt-4 px-4 md:px-8 lg:px-0 lg:mx-48">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum</p>
                <p className="text-base lg:text-xl text-gray-500 mt-2 px-4 md:px-8 lg:px-0 lg:mx-48">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum</p>
            </div>


            <div className="flex flex-col lg:flex-row justify-center mt-4 lg:mt-7 mb-9 lg:relative">
                <button type="button" className="bg-[#049D8E] rounded-md py-2 px-4 text-white lg:absolute lg:bottom-0 lg:left-0 lg:ml-48 lg:mb-4">Sign up for free</button>
                <div className="flex justify-center mt-4 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 lg:mr-48 lg:mb-4">
                    <video controls autoplay loop muted className="w-full lg:w-auto lg:max-w-full">
                        <source src="https://youtu.be/ZHzVr7rbDus?si=a0Bxnv8El3qQnF44" type="video/mp4" />
                    </video>
                </div>
            </div>
        </div> */}

      {/* 5th page */}
      <div className="mt-auto mx-auto px-4 md:px-40   pb-6 ">
        <p className="font-bold text-4xl text-center">Why use this platform</p>
        <p className="text-gray-500 text-lg text-center mx-auto  mt-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
        </p>
        <p className="text-gray-500 text-lg   text-center mx-auto  ">
          Blanditiis,commodi tempora mollitia voluptatem
        </p>

        <div className="flex flex-wrap justify-center  mt-7">
          <div className="border-2  md:w-80 mt-10 md:mt-0 md:mr-4 rounded-xl shadow-xl">
            <div className="">
              <img src={Card1} alt="" className="" />
            </div>
            <div className="mt-2">
              <p className="text-3xl font-semibold text-center">
                Offline & Online
              </p>
              <p className="text-3xl font-semibold text-center">Shopping</p>
              <p className="text-gray-500 mt-5 text-center pb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae d
              </p>
            </div>
          </div>
          <div className="border-2 md:w-80 mt-10 md:mt-0 md:mx-4 rounded-xl shadow-xl">
            <div className="">
              <img src={Card2} alt="" className="" />
            </div>
            <div className="mt-2">
              <p className="text-3xl font-semibold text-center">
                Amazing Deals{" "}
              </p>
              <p className="text-3xl mx-10 font-semibold text-center">
                & Cash Back
              </p>
              <p className="text-gray-500 mt-5 text-center pb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae d
              </p>
            </div>
          </div>
          <div className="border-2  md:w-80 mt-10 md:mt-0 md:ml-4 rounded-xl shadow-xl">
            <div className="">
              <img src={Card3} alt="" className="" />
            </div>
            <div className="">
              <p className="text-3xl font-semibold  mt-10 text-center">
                Cashback charity
              </p>
              <p className="text-gray-500 mt-5 pb-8 text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae d
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6th page  */}
      <div className="grid grid-cols-12 gap-8  mt-20 bg-[#EAEFF2] px-12 ">
        <div className="col-span-12 md:col-span-5 lg:col-span-5">
          <img src={Imgpage6} alt="" className="w-72 md:w-full" />
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-7 p-10">
          <div className="">
            <div className="border-slate-500 relative">
              <p className="text-4xl font-bold mx-2  md:mx-20 mt-10  md:mt-10">
                How online and offline
              </p>
              <p className="text-4xl font-bold mx-2 md:mx-20 mt-2  md:mt-2">
                shopping works
              </p>
              <p className="text-gray-500 mt-8 mx-2  md:mx-20">
                Explore our shopping options with just a click! Click the Online
                Shopping button to discover how easy it is to shop from the
                comfort of your home. Click the Offline Shopping button to see
                our in-store experience.
              </p>
              <button
                type="button"
                className="mx-2  md:mx-20 mt-5 text-white bg-[#049D8E] border-2 rounded-md px-4 py-2"
              >
                Online Shopping
              </button>
              <button
                type="button"
                className="mx-2  md:mx-10 mt-5 text-white bg-black border-2 rounded-md px-4 py-2"
              >
                Offline Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7th page */}

      <PopularCauses/>

      {/* 8th page */}

      <div className="mt-10 mx-auto px-4 md:px-40 bg-amber-50 pt-10 pb-6 ">
        <p className="font-bold text-4xl text-center">
          Raise funds for your cause/NGOs/ charity
        </p>
        <p className="text-gray-600 text-lg text-center mx-auto  mt-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
        </p>
        <p className="text-gray-600 text-lg   text-center mx-auto  ">
          {" "}
          Blanditiis,commodi tempora mollitia voluptatem{" "}
        </p>

        <div className="">
          <div className="flex justify-center space-x-20 mt-4">
            <div className="mt-10  md:flex-row">
              <img src={Logo1} alt="" className="" />
            </div>
            <div className="mt-10">
              <img src={Logo2} alt="" className="" />
            </div>
            <div className="mt-10">
              <img src={Logo3} alt="" className="" />
            </div>
            <div className="mt-10">
              <img src={Logo4} alt="" className="" />
            </div>
            <div className="mt-10">
              <img src={Logo5} alt="" className="" />
            </div>
            <div className="mt-10 flex justify-center">
              <button className="bg-[#FFD705] text-blue-950 text-xl font-bold rounded-full w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                View All
              </button>
            </div>
          </div>
          <div className="md:mx-20 mx-10 ">
            <div className=" flex justify-center items-center mt-16   w-full">
              <input
                type="search"
                className=" py-2 px-10 w-full    text-gray-900 bg-amber-50 border-2 "
                placeholder="Search name of the cause or NGO you want to support.."
                required
              />
              <i className="bi bi-search text-2xl px-2 py-1 border-2"></i>
            </div>
          </div>
          <div className="mt-10 text-center pb-5">
            <p className="m bg-[#FFD705] rounded-lg w-full md:w-72 py-2 inline-block">
              Create Your Own Fundraising Store
            </p>
          </div>
        </div>
      </div>

      {/* 9th page */}
      <div className="mt-10 mx-auto px-12 md:px-40 pt-8 pb-6 ">
        <p className="font-bold text-4xl text-center">Recently Posted Blog</p>
        <p className="text-gray-600 text-lg text-center mx-auto  mt-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
        </p>
        <p className="text-gray-600 text-lg   text-center mx-auto  ">
          {" "}
          Blanditiis,commodi tempora mollitia voluptatem{" "}
        </p>
        <div className="grid grid-cols-12 gap-2 mt-5">
          <div className="lg:col-span-5 col-span-12">
            <div>
              <img src={Blog1} alt="" />
              <p className="font-medium text-xl mt-4">Blog title 1</p>
              <p className="text-gray-500 text-lg mt-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora{" "}
                <span className="text-[#049D8E] font-medium">Read More...</span>
              </p>
              <p className="text-gray-400 mt-4">By Tithi Mondal, 10 Mar.2024</p>
            </div>
          </div>
          <div className="lg:col-span-7 col-span-12 mx-5  ">
            <div className="lg:flex ">
              <img src={Blog2} alt=" " className="h-full w-full" />
              <div className="mx-4">
                <p className="font-medium text-xl">Blog title 2</p>
                <p className="text-gray-500 text-lg">
                  Lorem ipsum dolor sit amet consectetur Blanditiis,commodi tem
                  <span className="text-[#049D8E] font-medium">
                    Read More...
                  </span>
                </p>
                <p className="text-gray-400 mt-4">
                  By Tithi Mondal, 10 Mar.2024
                </p>
              </div>
            </div>
            <div className="lg:flex mt-3 ">
              <img src={Blog3} alt="" className="h-full w-full" />
              <div className="mx-4">
                <p className="font-medium  text-xl">Blog title 3</p>
                <p className="text-gray-500 text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Blanditiis,commodi tempora{" "}
                  <span className="text-[#049D8E] font-medium">
                    Read More...
                  </span>
                </p>
                <p className="text-gray-400 mt-4">
                  By Tithi Mondal, 10 Mar.2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10th page */}

      <div className="mt-44 mx-auto px-12  flex flex-col justify-center items-center">
        <div className="absolute">
          <img src={Backimg9} alt="" className="w-full h-[20rem ]" />
        </div>
        <div className="relative  text-center">
          <p className="font-bold text-4xl">Subscribe to Our Newsletter</p>
          <p className="text-gray-600 text-lg mx-auto mt-5">
            Improving your small business growth through Onir app. It also
          </p>
          <div className="md:mx-20 mx-10 ">
            <div className=" flex justify-center items-center mt-16   w-full">
              <input
                type="search"
                className=" px-24 w-full    text-gray-900 bg-white border-2 py-3 "
                placeholder="Enter your Email here"
                required
              />
              <button className=" text-lg px-4   py-3 border-2 text-white bg-[#049D8E]">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 11th page */}

      <FAQ />

      <PeopleSaySection />
    </div>
  );
};

export default Home;
