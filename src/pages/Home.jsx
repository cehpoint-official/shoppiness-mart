import Home1 from "../assets/Home/home1.png";
import Home2 from "../assets/SupportMaast/header.png";
import img11 from "../assets/Home/img11.png";
import img12 from "../assets/Home/img12.png";
import img13 from "../assets/Home/img13.png";
import img14 from "../assets/Home/img14.png";
import img15 from "../assets/Home/img15.png";
import img16 from "../assets/Home/img16.png";
import img18 from "../assets/Home/img18.png";
import Logo1 from "../assets/Home/logo1.png";
import Logo2 from "../assets/Home/logo2.png";
import Logo3 from "../assets/Home/logo3.png";
import Logo4 from "../assets/Home/logo4.png";
import Logo5 from "../assets/Home/logo5.png";
import Blog1 from "../assets/Home/blog1.png";
import Blog2 from "../assets/Home/blog2.png";
import Blog3 from "../assets/Home/blog3.png";
import Card7th1 from "../assets/card7th1.png";
import Card7th2 from "../assets/card7th2.png";
import Card7th3 from "../assets/card7th3.png";
import bgimg from "../assets/imagehome.png";
import homepage from "../assets/homepage.png";
import Backimg9 from "../assets/Home/backimg9.png";
import FAQ from "../Components/FAQ";
import PeopleSaySection from "../Components/PeopleSaySection";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import RoundedCards from "../Components/RoundedCards/RoundedCards";
import Carousel from "../Components/Carousel/Carousel";
import Partners from "../Components/Partners";

import { useState } from "react";
import { db } from "../../firebase"; // Adjust the import path as necessary
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const Home = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      await addDoc(collection(db, "Newsletter"), {
        email: email,
        timestamp: new Date(),
      });
      setMessage("Successfully subscribed!");
      setInterval(() => {
        setMessage("");
      }, 5000);
      setEmail("");
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <div className=" overflow-hidden">
      {/* 1st Page  */}
      <Carousel img1={Home1} img2={Home2} img3={Home1} />

      {/* 2nd page */}
      <Partners
        title={"Most preferred online and offline partners "}
        para={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt"
        }
      />
      {/* 3rd page */}
      <div className=" pb-40 ">
        <div className="grid grid-cols-12 mx-4 md:mx-10 px-4 md:px-10">
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-wrap justify-center md:justify-start">
              <img
                src={img11}
                alt="loading"
                className="w-32 md:w-auto md:max-w-xs mr-2 md:mr-4 mb-2 md:mb-0"
              />
              <img src={img12} alt="" className="w-32 md:w-auto md:max-w-xs" />
            </div>

            <div className="flex justify-center relative mt-4 md:mt-0">
              <img
                src={img13}
                alt=""
                className="absolute -top-10 w-24 md:w-80"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <h1 className="md:text-4xl text-3xl font-semibold mt-16 md:mt-12  font-slab ">
              What is ShoppinessMarts?
            </h1>
            <p className="  text-gray-500 md:mt-7 mt-3  md:text-2xl text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis, commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, nisi eum
              quae voluptatum Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Blanditiis,commodi tempora mollitia voluptatem recusandae
              .Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae .
            </p>
          </div>
        </div>
      </div>

      <div
        className="gap-20 flex justify-center items-center flex-wrap py-20"
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="md:w-[550px] md:mt-6  ">
          <p className="text-xl mb-2 ">How it works</p>
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            Cashback,Deals for you,help to others
          </h1>
          <p className="text-parapgraphColor text-sm md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia .Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Blanditiis,commodi tempora mollitia
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia .Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Blanditiis,commodi tempora mollitia
          </p>
          <div className="flex gap-2">
            <button className="bg-teal-500 text-white font-medium rounded-md text-sm md:text-base h-[40px] w-[150px] mt-4">
              Sign up for free
            </button>
          </div>
        </div>
        <div className="mt-6">
          <img src={homepage} alt="Loading..." className="w-[400px]" />
        </div>
      </div>
      {/* 4th page */}
      <RoundedCards
        data={[
          { title: "Offline & Online Shopping", img: img14, id: 1 },
          { title: "Amazing Deals & Cash Back", img: img15, id: 2 },
          { title: "Cashback Charity", img: img16, id: 3 },
        ]}
      />
      {/* 6th page  */}

      <div className="bg-[#EAEFF2] gap-20 flex justify-center items-center flex-wrap px-10 pb-16 mb-16">
        <div className="mt-6">
          <img src={img18} alt="Loading..." className="w-[500px]" />
        </div>
        <div className="md:w-[400px] md:mt-6  ">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            How online and offline shopping works
          </h1>
          <p className="text-parapgraphColor text-sm md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia .Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Blanditiis,commodi tempora mollitia
          </p>
          <div className="flex gap-2">
            <Link to="/online-shop">
              <button className="bg-teal-500 text-white font-medium rounded-md text-sm md:text-base h-[40px] w-[150px] mt-4">
                Online Shopping
              </button>
            </Link>
            <Link to={"offline-shop"}>
              <button className="bg-[#434343] text-white font-medium rounded-md text-sm md:text-base h-[40px] w-[150px] mt-4">
                Offline Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 7th page */}
      <PopularCauses
        data={[
          {
            title: "Healthy Food For All",
            titleSmall: "Child health Care",
            img: Card7th1,
            id: 1,
          },
          {
            title: "Animal Care",
            titleSmall: "Animal Care",
            img: Card7th2,
            id: 2,
          },
          {
            title: "Green World",
            titleSmall: "Green World",
            img: Card7th3,
            id: 3,
          },
        ]}
      />
      {/* 8th page */}
      <div className="m-20 mx-auto px-4 md:px-40 bg-amber-50 pt-10 pb-6 ">
        <p className="font-bold md:text-4xl text-3xl font-slab text-center">
          Raise funds for your cause/NGOs/ charity
        </p>
        <p className="text-gray-600  text-center mx-auto md:text-lg text-sm mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
        </p>
        <p className="text-gray-600 md:text-lg text-sm  text-center mx-auto  ">
          {" "}
          Blanditiis,commodi tempora mollitia voluptatem{" "}
        </p>

        <div className="">
          <div className=" flex justify-center items-center flex-wrap gap-2 mt-4">
            <div className="  m-2">
              <img src={Logo1} alt="Loading..." className="w-[100px] " />
            </div>
            <div className="  m-2">
              <img src={Logo2} alt="Loading..." className="w-[100px]" />
            </div>
            <div className=" m-2">
              <img src={Logo3} alt="Loading..." className="w-[100px]" />{" "}
            </div>
            <div className=" m-2">
              <img src={Logo4} alt="Loading..." className="w-[100px]" />{" "}
            </div>
            <div className=" m-2">
              <img src={Logo5} alt="Loading..." className="w-[100px]" />{" "}
            </div>
            <div className="">
              <button className="bg-[#FFD705] text-blue-950 text-xl font-bold rounded-full w-[100px] h-[100px] px-2 flex items-center">
                View All
              </button>
            </div>
          </div>

          <div className="md:mx-20 mx-10 ">
            <div className=" flex justify-center items-center mt-16   w-full">
              <input
                type="search"
                className=" py-2 px-10 w-full  text-gray-900 bg-amber-50 border-2 "
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
        <div>
          <p className="font-bold md:text-4xl text-3xl text-center font-slab">
            Recently Posted Blog
          </p>
          <p className="text-gray-600 md:text-lg text-sm text-center mx-auto  mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia voluptatem{" "}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-2 mt-10">
          <div className="lg:col-span-5 col-span-12">
            <div>
              <img src={Blog1} alt="" />
              <p className="font-medium text-lg mt-4">Blog title 1</p>
              <p className="text-gray-500 text-sm md:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora{" "}
                <span className="text-[#049D8E] font-medium">Read More...</span>
              </p>
              <p className="text-gray-400 mt-4">By Tithi Mondal, 10 Mar.2024</p>
            </div>
          </div>

          <div className="lg:col-span-7 col-span-12 mx-5  ">
            <div className="lg:flex ">
              <img src={Blog2} alt=" " className="" />
              <div className="md:mx-4">
                <p className="font-medium text-lg mt-4">Blog title 2</p>
                <p className="text-gray-500 text-sm md:text-base">
                  Lorem ipsum dolor sit amet consectetur Blanditiis,commodi tem
                  <span className="text-[#049D8E] text-sm md:text-base font-medium">
                    {" "}
                    Read More...
                  </span>
                </p>
                <p className="text-gray-400 mt-4">
                  By Tithi Mondal, 10 Mar.2024
                </p>
              </div>
            </div>
            <div className="lg:flex mt-4 ">
              <img src={Blog3} alt="" className="" />
              <div className="md:mx-4">
                <p className="font-medium text-lg mt-4">Blog title 3</p>
                <p className="text-gray-500 text-sm md:text-base">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Blanditiis,commodi tempora{" "}
                  <span className="text-[#049D8E] text-sm md:text-base font-medium">
                    {" "}
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
      {/* NewsLetter */}
      <div className="mt-44 mx-auto flex flex-col justify-center items-center">
        <div className="absolute">
          <img
            src={Backimg9}
            alt="Background"
            className="w-[100%] md:h-[100%] h-[300px]"
          />
        </div>
        <div className="relative text-center">
          <p className="font-bold font-slab md:text-4xl text-3xl">
            Subscribe to Our Newsletter
          </p>
          <p className="text-gray-600 md:text-base text-sm mx-auto mt-2">
            Improving your small business growth through Onir app. It also
          </p>
          <div className="md:mx-20 mx-10">
            <form
              className="flex justify-center items-center mt-16 w-full"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                className="px-24 w-full text-gray-900 bg-white border-2 py-3"
                placeholder="Enter your Email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                className="text-lg px-4 py-3 border-2 text-white bg-[#049D8E]"
                type="submit"
              >
                Subscribe
              </button>
            </form>
            {message && <p className="mt-4 text-gray-600">{message}</p>}
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
