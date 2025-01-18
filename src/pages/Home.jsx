// ======================
import img11 from "../assets/homepage/img11.png";
import img12 from "../assets/homepage/img12.png";
import img13 from "../assets/homepage/img13.png";
import bgimg from "../assets/homepage/imagehome.png";
import homepage from "../assets/homepage/homepage.png";

import img18 from "../assets/homepage/img18.png";
import Backimg9 from "../assets/homepage/backimg9.png";
// =========================

import Home1 from "../assets/Home/home1.png"; //use in carasaul
import Logo1 from "../assets/Home/logo1.png"; //use in ngo's
import supportACause from "../assets/homeheader.png";

// ========================
import FAQ from "../Components/FAQ";
import PeopleSaySection from "../Components/PeopleSaySection";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import RoundedCards from "../Components/RoundedCards/RoundedCards";
import Carousel from "../Components/Carousel/Carousel";
import Partners from "../Components/Partners";
import Loader from "../Components/Loader/Loader";
// ==========================
import { useState, useEffect } from "react";
import { db } from "../../firebase"; // Adjust the import path as necessary
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
// ==============================

const Home = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [roundedCardsData, setRoundedCardsData] = useState([]);
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "WhyThisPlatform"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
        setRoundedCardsData(data);
      });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }

    try {
      const querySnapshot = await getDocs(collection(db, "BlogsHome"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
        setBlogsData(data);
      });
      setLoading(false);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  // console.log(roundedCardsData);
  // console.log(blogsData);

  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className=" overflow-hidden">
      {/* carousel  */}
      {/* <Carousel img1={Home1} img2={Home1} img3={Home1} /> */}
      <div className="flex flex-wrap items-center justify-center w-full p-10">
        <div className="rounded-lg px-6 max-w-xl justify-between ">
          <h1 className="text-5xl font-bold text-blue-900 mb-4 font-slab">
            Cashback to giveback
          </h1>
          <p className="text-gray-700 mb-6 text-xl">
            Shop at Soppiness Mart, earn cashback to spread joy—use it for
            yourself or donate to charity, sharing kindness exponentially.
          </p>
          <Link href="/signup">
            <button className="bg-[#049D8E] text-white py-2 px-4 rounded-lg transition duration-300">
              Sign up and Get Started
            </button>
          </Link>
        </div>
        <div>
          <img src={supportACause} alt="Cashback to giveback illustration" />
        </div>
      </div>

      {/* our partners */}
      <Partners
        title={"Most preferred online and offline partners "}
        para={
          "Shoppinessmart aims to partner with businesses that align with our mission of giving back to the community. We seek partners who share our values of sustainability, ethical practices, and customer satisfaction."
        }
      />
      {/* what is the shopiness mart */}
      <div className=" md:pb-40 pb-10">
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
              What is ShoppinessMart?
            </h1>
            <p className="  text-gray-500 md:mt-7 mt-3  md:text-2xl text-sm">
              Shoppinessmart is a platform that turns your everyday online
              shopping into a force for good. By simply shopping through our
              website or app, you can support your favorite charities without
              spending a penny extra. We've partnered with hundreds of popular
              online stores, and for every purchase made through our platform, a
              percentage of the sale is donated to your chosen charity. It’s
              that easy to make a difference.
            </p>
          </div>
        </div>
      </div>

      {/* {cashback deals for help other } */}
      <div
        className="gap-20 flex justify-center items-center flex-wrap py-20 px-10 mb-10"
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="md:w-[550px] md:mt-6  ">
          <p className="text-xl mb-2 ">How it works</p>
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            Cashback Deals for you to help others.
          </h1>
          <p className="text-parapgraphColor text-sm md:text-lg">
            Collaborate with established cashback platforms or create an
            in-house cashback system. Cashback Determine a suitable cashback
            percentage or reward system based on purchase amounts, categories,
            or partner stores. Redemption Offer flexible redemption options,
            such as cash transfers, gift cards, or donations to charity.Clearly
            communicate cashback offers through marketing channels and user
            interfaces.
          </p>
          <div className="flex gap-2">
            <Link to="/signup">
              <button className="bg-teal-500 text-white font-medium rounded-md text-sm md:text-base h-[40px] w-[150px] mt-4">
                Sign up for free
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <img src={homepage} alt="Loading..." className="w-[400px]" />
        </div>
      </div>

      {/*why we use this platform */}
      <RoundedCards data={roundedCardsData} />

      {/* how online or offline shop work  */}
      <div className="bg-[#EAEFF2] gap-20 flex justify-center items-center flex-wrap px-10 pb-16 mb-16">
        <div className="mt-6">
          <img src={img18} alt="Loading..." className="w-[500px]" />
        </div>
        <div className="md:w-[400px] md:mt-6  ">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            How online and offline shopping works
          </h1>
          <p className="text-parapgraphColor text-sm md:text-lg">
            Discover the joy of shopping while making a positive impact.
            Shoppinessmart online shopping allows you to support charities while
            enjoying your favorite online stores.
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

      {/* <!-- NGO's --> */}
      <div className="m-20 mx-auto px-4 md:px-40 bg-amber-50 pt-10 pb-6 ">
        <p className="font-bold md:text-4xl text-3xl font-slab text-center">
          Raise funds for your cause/NGOs/ charity
        </p>
        <p className="text-gray-600 text-center mx-auto md:text-lg text-sm mt-4">
          Shoppinessmart makes it effortless to support the causes you care
          about.
        </p>
        <p className="text-gray-600 md:text-lg text-sm text-center mx-auto">
          By simply shopping through our platform, you can contribute to a
          better world without spending a penny more.
        </p>

        <div className="flex justify-center items-center flex-wrap gap-2 mt-4">
          <div className="m-2">
            <img src={Logo1} alt="Loading..." className="w-[100px]" />
          </div>
          <div className="m-2">
            <img src={Logo1} alt="Loading..." className="w-[100px]" />
          </div>
          <div className="m-2">
            <img src={Logo1} alt="Loading..." className="w-[100px]" />
          </div>
          <div className="m-2">
            <img src={Logo1} alt="Loading..." className="w-[100px]" />
          </div>
          <div className="m-2">
            <img src={Logo1} alt="Loading..." className="w-[100px]" />
          </div>
          <div>
            <button className="bg-[#FFD705] text-blue-950 text-xl font-bold rounded-full w-[100px] h-[100px] px-2 flex items-center justify-center">
              View All
            </button>
          </div>
        </div>

        <div className="md:mx-20 mx-10 mt-16">
          <div className="flex justify-center items-center w-full">
            <input
              type="search"
              className="py-2 px-10 w-full text-gray-900 bg-amber-50 border-2"
              placeholder="Search name of the cause or NGO you want to support.."
              required
            />
            <i className="bi bi-search text-2xl px-2 py-1 border-2"></i>
          </div>
        </div>
        <div className="mt-10 text-center pb-5">
          <p className="bg-[#FFD705] rounded-lg w-full md:w-72 py-2 inline-block">
            Create Your Own Fundraising Store
          </p>
        </div>
      </div>

      {/* Blogs */}
      <div className="mt-10 mx-auto px-6 md:px-40 pt-8 pb-6">
        <div>
          <p className="font-bold text-3xl md:text-4xl text-center font-slab">
            Recently Posted Blog
          </p>
          <p className="text-gray-600 text-sm md:text-lg text-center mx-auto mt-2">
            Share stories of how Shoppinessmart donations have made a difference
            in people's lives.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-10">
          <div className="lg:col-span-5 col-span-12">
            <div>
              <img src={blogsData[1].img} alt="" className="w-full" />
              <p className="font-medium text-lg mt-4">{blogsData[1].title}</p>
              <p className="text-gray-500 text-sm md:text-base">
                {blogsData[1].desc}{" "}
                <span className="text-[#049D8E] font-medium">Read More...</span>
              </p>
              <p className="text-gray-400 mt-4">
                By {blogsData[0].auther}, 10 Mar 2024
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 col-span-12 mx-5">
            <div className="lg:flex mb-4">
              <img src={blogsData[0].img} alt=" " className="lg:w-1/3 w-full" />
              <div className="lg:ml-4 mt-4 lg:mt-0">
                <p className="font-medium text-lg">{blogsData[0].title}</p>
                <p className="text-gray-500 text-sm md:text-base">
                  {blogsData[0].desc}
                  <span className="text-[#049D8E] text-sm md:text-base font-medium">
                    {" "}
                    Read More...
                  </span>
                </p>
                <p className="text-gray-400 mt-4">
                  By {blogsData[1].auther}, 15 July 2024
                </p>
              </div>
            </div>
            <div className="lg:flex">
              <img src={blogsData[2].img} alt="" className="lg:w-1/3 w-full" />
              <div className="lg:ml-4 mt-4 lg:mt-0">
                <p className="font-medium text-lg">{blogsData[2].title}</p>
                <p className="text-gray-500 text-sm md:text-base">
                  {blogsData[2].desc}{" "}
                  <span className="text-[#049D8E] text-sm md:text-base font-medium">
                    {" "}
                    Read More...
                  </span>
                </p>
                <p className="text-gray-400 mt-4">
                  By {blogsData[2].auther}, 09 April 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NewsLetter */}
      <div className="relative mt-44 py-20 flex flex-col justify-center items-center">
        <div className="absolute inset-0">
          <img
            src={Backimg9}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative text-center p-4">
          <p className="font-bold font-slab text-2xl md:text-4xl">
            Subscribe to Our Newsletter
          </p>
          <p className="text-gray-600 text-sm md:text-base mx-auto mt-2 max-w-lg">
            Improving your small businesses growth through Onir app. It also
          </p>
          <div className="w-full max-w-lg mx-auto">
            <form
              className="flex flex-col md:flex-row justify-center items-center mt-8 md:mt-16"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                className="text-gray-900 bg-white border-2 p-3 rounded-xl w-full md:w-[400px] mb-4 md:mb-0 md:mr-4"
                placeholder="Enter your Email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                className="text-lg px-4 py-3 border-2 text-white bg-[#049D8E] rounded-xl"
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
