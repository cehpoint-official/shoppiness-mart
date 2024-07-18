// ======================
import img11 from "../assets/homepage/img11.png";
import img12 from "../assets/homepage/img12.png";
import img13 from "../assets/homepage/img13.png";
import bgimg from "../assets/homepage/imagehome.png";
import homepage from "../assets/homepage/homepage.png";
import img14 from "../assets/homepage/img14.png";
import img15 from "../assets/homepage/img15.png";
import img16 from "../assets/homepage/img16.png";
import img18 from "../assets/homepage/img18.png";
import Backimg9 from "../assets/homepage/backimg9.png";
// =========================

import Home1 from "../assets/Home/home1.png"; //use in carasaul
import Logo1 from "../assets/Home/logo1.png"; //use in ngo's
import Blog1 from "../assets/Home/blog1.png"; //use in blog

// ========================
import FAQ from "../Components/FAQ";
import PeopleSaySection from "../Components/PeopleSaySection";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import RoundedCards from "../Components/RoundedCards/RoundedCards";
import Carousel from "../Components/Carousel/Carousel";
import Partners from "../Components/Partners";
// ==========================
import { useState } from "react";
import { db } from "../../firebase"; // Adjust the import path as necessary
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
// ==============================

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
      {/* carousel  */}
      <Carousel img1={Home1} img2={Home1} img3={Home1} />

      {/* our partners */}
      <Partners
        title={"Most preferred online and offline partners "}
        para={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt"
        }
      />
      {/* what is the shopiness mart */}
      <div className="md:pb-40 pb-20">
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

      {/* {cashback deals for help other } */}
      <div
        className="md:gap-20 gap-10 flex justify-center items-center flex-wrap mb-40 px-10 py-10"
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

      {/*why we use this plateform */}
      <RoundedCards
        data={[
          { title: "Offline & Online Shopping", img: img14, id: 1 },
          { title: "Amazing Deals & Cash Back", img: img15, id: 2 },
          { title: "Cashback Charity", img: img16, id: 3 },
        ]}
      />

      {/* how online or offline shop work  */}
      <div className="bg-[#EAEFF2] md:gap-20 flex justify-center items-center flex-wrap px-10 pb-16 my-16">
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

      {/* our popular causes */}
      <PopularCauses />

      {/* NGO's */}
      <div className="m-20 mx-auto px-4 md:px-40 bg-amber-50 pt-10 pb-6 ">
        <p className="font-bold md:text-4xl text-2xl font-slab text-center">
          Raise funds for your cause/NGOs/ charity
        </p>
        <p className="text-gray-600  text-center mx-auto md:text-lg text-sm mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
          Blanditiis,commodi tempora mollitia voluptatem{" "}
        </p>

        <div className="">
          <div className=" flex justify-center items-center flex-wrap gap-2 mt-4">
            <div className="  m-2">
              <img src={Logo1} alt="Loading..." className="w-[100px] " />
            </div>
            <div className="  m-2">
              <img src={Logo1} alt="Loading..." className="w-[100px]" />
            </div>
            <div className=" m-2">
              <img src={Logo1} alt="Loading..." className="w-[100px]" />{" "}
            </div>
            <div className=" m-2">
              <img src={Logo1} alt="Loading..." className="w-[100px]" />{" "}
            </div>
            <div className=" m-2">
              <img src={Logo1} alt="Loading..." className="w-[100px]" />{" "}
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

      {/* Blogs */}
      <div className="mt-10 mx-auto px-12 md:px-40 pt-8 pb-6 ">
        <div>
          <p className="font-bold md:text-4xl text-2xl text-center font-slab">
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
              <img src={Blog1} alt=" " className="" />
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
              <img src={Blog1} alt="" className="" />
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
      <div className="mt-44 flex flex-col justify-center items-center">
        <div className="absolute">
          <img
            src={Backimg9}
            alt="Background"
            className="w-[100%] md:h-[100%] h-[300px]"
          />
        </div>
        <div className="relative text-center">
          <p className="font-bold font-slab md:text-4xl text-2xl ">
            Subscribe to Our Newsletter
          </p>
          <p className="text-gray-600 md:text-base text-sm mx-auto mt-2 px-10">
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
                className="md:text-lg text-sm px-4 py-3 border-2 text-white bg-[#049D8E]"
                type="submit"
              >
                Subscribe
              </button>
            </form>
            {message && <p className="mt-4 text-gray-600">{message}</p>}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <FAQ />

      {/* Reviews  */}
      <PeopleSaySection />
    </div>
  );
};

export default Home;
