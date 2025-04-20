import img11 from "../assets/homepage/img11.png";
import img12 from "../assets/homepage/img12.png";
import img13 from "../assets/homepage/img13.png";
import bgimg from "../assets/homepage/imagehome.png";
import img18 from "../assets/homepage/img18.png";
import Backimg9 from "../assets/homepage/backimg9.png";
import supportACause from "../assets/homeheader.png";
import FAQ from "../Components/FAQ";
import PeopleSaySection from "../Components/PeopleSaySection";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import RoundedCards from "../Components/RoundedCards/RoundedCards";
import Partners from "../Components/Partners";
import Loader from "../Components/Loader/Loader";

import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Gift, ShoppingBag } from "lucide-react";

const Home = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    roundedCardsData: [],
    blogsData: [],
    shopsData: [],
    causeLogos: [],
    bannerImage: null,
    homeVideo: null,
  });
  const [loading, setLoading] = useState({
    main: true,
    banner: true,
    causes: true,
    video: true,
  });
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    const { name, email } = formData;

    if (!email) return setMessage("Please enter a valid email address.");
    if (!name) return setMessage("Please enter your name.");

    try {
      await addDoc(collection(db, "newsletter"), {
        name,
        email,
        date: new Date(),
        timestamp: new Date(),
      });
      setMessage("Successfully subscribed!");
      setTimeout(() => setMessage(""), 5000);
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Subscription failed. Please try again.");
    }
  };

  // Fetch data from Firebase with priority loading for video
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch the home video with high priority
        const homeVideosDoc = await getDoc(doc(db, "content", "homeVideos"));

        // Process home video data immediately
        let homeVideo = {
          url: null,
          type: null,
          thumbnail: null,
        };

        if (homeVideosDoc.exists() && homeVideosDoc.data().items?.length > 0) {
          const sortedItems = [...homeVideosDoc.data().items].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          homeVideo.url = sortedItems[0]?.url || null;
          homeVideo.type = sortedItems[0]?.type || null;
          homeVideo.thumbnail = sortedItems[0]?.thumbnail || null;

          // Update video state immediately
          setData((prev) => ({ ...prev, homeVideo }));
          setLoading((prev) => ({ ...prev, video: false }));

          // Correct way to preload video - don't use link preload for video
          if (homeVideo.url) {
            const videoElement = document.createElement("video");
            videoElement.style.display = "none";
            videoElement.preload = "auto";
            videoElement.src = homeVideo.url;
            document.body.appendChild(videoElement);

            // Remove the element after a reasonable time for preloading
            setTimeout(() => {
              document.body.removeChild(videoElement);
            }, 5000);
          }
        } else {
          setLoading((prev) => ({ ...prev, video: false }));
        }

        // Then fetch the rest of the data in parallel
        const [
          whyThisPlatformDocs,
          businessDetailsDocs,
          blogsDocs,
          bannerDoc,
          causesDocs,
        ] = await Promise.all([
          // Other fetch operations remain the same
          getDocs(collection(db, "WhyThisPlatform")),
          getDocs(collection(db, "businessDetails")),
          getDocs(
            query(
              collection(db, "blogs"),
              where("status", "==", "Published"),
              orderBy("createdAt", "desc"),
              limit(3)
            )
          ),
          getDoc(doc(db, "content", "banners")),
          getDocs(
            query(
              collection(db, "causeDetails"),
              where("status", "==", "Active"),
              limit(6)
            )
          ),
        ]);

        // Process fetched data
        const roundedCardsData = whyThisPlatformDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const shopsData = businessDetailsDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const blogsData = blogsDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Process banner image
        let bannerImage = null;
        if (bannerDoc.exists() && bannerDoc.data().items?.length > 0) {
          const sortedItems = [...bannerDoc.data().items].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          bannerImage = sortedItems[0]?.url || null;
        }

        // Process cause logos
        const causeLogos = causesDocs.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((cause) => cause.logoUrl);

        // Update state with all fetched data
        setData((prev) => ({
          ...prev,
          roundedCardsData,
          blogsData,
          shopsData,
          causeLogos,
          bannerImage,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, main: false, causes: false }));
      }
    };

    fetchData();
  }, []);

  // Handle banner image preloading
  useEffect(() => {
    if (data.bannerImage) {
      setLoading((prev) => ({ ...prev, banner: true }));

      const img = new Image();
      img.onload = () => setLoading((prev) => ({ ...prev, banner: false }));
      img.onerror = () => {
        console.log("Error loading banner image");
        setLoading((prev) => ({ ...prev, banner: false }));
      };
      img.src = data.bannerImage;
    } else {
      setLoading((prev) => ({ ...prev, banner: false }));
    }
  }, [data.bannerImage]);

  // Handle video element autoplay and metadata loading
  useEffect(() => {
    if (videoRef.current && data.homeVideo?.url) {
      const videoElement = videoRef.current;

      // Function to handle video loaded
      const handleVideoLoaded = () => {
        if (videoElement.readyState >= 3) {
          // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
          setLoading((prev) => ({ ...prev, video: false }));
        }
      };

      // Set up event listeners
      videoElement.addEventListener("loadeddata", handleVideoLoaded);
      videoElement.addEventListener("canplay", handleVideoLoaded);

      // Handle user interaction to enable autoplay
      const enableAutoplay = () => {
        if (videoElement && videoElement.paused) {
          videoElement.muted = true; // Mute the video to allow autoplay
          videoElement.play().catch((err) => {
            console.warn("Autoplay still failed:", err);
          });
        }
      };

      // Add one-time event listeners for user interaction
      const interactionEvents = ["click", "touchstart", "keydown", "scroll"];
      interactionEvents.forEach((event) => {
        document.addEventListener(event, enableAutoplay, { once: true });
      });

      // Clean up event listeners
      return () => {
        videoElement.removeEventListener("loadeddata", handleVideoLoaded);
        videoElement.removeEventListener("canplay", handleVideoLoaded);
        interactionEvents.forEach((event) => {
          document.removeEventListener(event, enableAutoplay);
        });
      };
    }
  }, [data.homeVideo?.url]);

  // Format date function
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp.toDate()).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full p-10">
        <div className="w-full md:w-1/2 space-y-8 md:pr-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#049D8E]/10 text-[#049D8E] font-medium text-sm">
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span>Shop with purpose</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            <span className="relative">
              Cashback
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-[#049D8E]/20 -z-10 transform -rotate-1"></span>
            </span>{" "}
            to <span className="text-[#049D8E]">giveback</span>
          </h1>

          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Shop at Shoppiness Mart, earn cashback on purchases from our listed
            shops, and use it to treat yourself or support listed NGOs and
            charitable causes. Your donations help spread kindness and create
            positive change, turning everyday shopping into meaningful actions!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link to="/signup" className="group">
              <button className="bg-[#049D8E] hover:bg-[#038275] text-white py-2 px-6 rounded transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 font-medium">
                Sign up and Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <div className="flex items-center gap-2 text-gray-600">
              <Gift className="w-5 h-5 text-[#049D8E]" />
              <span className="text-sm">
                Join today and start generating cashback
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-">
          {loading.banner ? (
            <div className="animate-pulse bg-gray-200 rounded-lg w-full h-64 md:h-80"></div>
          ) : (
            <img
              src={data.bannerImage || supportACause}
              alt="Cashback to giveback illustration"
              className="w-full h-full object-contain"
              style={{ maxWidth: "600px" }}
            />
          )}
        </div>
      </div>

      {/* Partners section */}
      <Partners
        title="Most preferred online and offline partners"
        para="Shoppinessmart aims to partner with businesses that align with our mission of giving back to the community. We seek partners who share our values of sustainability, ethical practices, and customer satisfaction."
        shopsData={data.shopsData}
        isLoading={loading.main}
      />

      {/* What is Shopiness Mart section */}
      <div className="md:pb-40 pb-10">
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
            <h1 className="md:text-4xl text-3xl font-semibold mt-16 md:mt-12 font-slab">
              What is ShoppinessMart?
            </h1>
            <p className="text-gray-500 md:mt-7 mt-3 md:text-2xl text-sm">
              Shoppinessmart is a platform that turns your everyday online
              shopping into a force for good. By simply shopping through our
              website or app, you can support your favorite charities without
              spending a penny extra. We&apos;ve partnered with hundreds of
              popular online stores, and for every purchase made through our
              platform, a percentage of the sale is donated to your chosen
              charity. It's that easy to make a difference.
            </p>
          </div>
        </div>
      </div>

      {/* Cashback deals section with improved video handling */}
      <div
        className="gap-20 flex justify-center items-center flex-wrap py-20 px-10 mb-10"
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="md:w-[550px] md:mt-6">
          {/* <p className="text-xl mb-2">How it works</p> */}
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            Cashback Deals for you to help others.
          </h1>
          <p className="text-parapgraphColor text-sm md:text-lg">
            Collaborate with established cashback platforms or create an
            in-house cashback system. Determine a suitable cashback
            percentage or reward system based on purchase amounts, categories,
            or partner stores. Offer flexible redemption options,
            such as cash transfers, gift cards, or donations to charity. Clearly
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
          {loading.video ? (
            <div className="w-full h-[225px] md:h-[281px] bg-gray-200 rounded-lg flex items-center justify-center">
              <Loader />
            </div>
          ) : data.homeVideo?.url ? (
            <div className="w-full h-[225px] md:h-[281px] bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                muted // Important: muted videos can autoplay without user interaction
                playsInline // Important for mobile browsers
                loop // Optional: loop the video
                className="w-full h-full object-cover"
                poster={data.homeVideo.thumbnail || ""}
                preload="auto"
                controls // Show controls so user can unmute
              >
                <source src={data.homeVideo.url} type={data.homeVideo.type} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="w-[400px] h-[225px] md:w-[500px] md:h-[281px] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No video available</p>
            </div>
          )}
        </div>
      </div>

      {/* Why use this platform */}
      {loading.main ? (
        <Loader />
      ) : (
        <RoundedCards data={data.roundedCardsData} />
      )}

      {/* How shopping works section */}
      <div className="bg-[#EAEFF2] gap-20 flex justify-center items-center flex-wrap px-10 pb-16 mb-16">
        <div className="mt-6">
          <img src={img18} alt="Loading..." className="w-[500px]" />
        </div>
        <div className="md:w-[400px] md:mt-6">
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
            <Link to="offline-shop">
              <button className="bg-[#434343] text-white font-medium rounded-md text-sm md:text-base h-[40px] w-[150px] mt-4">
                Offline Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular causes */}
      <PopularCauses />

      {/* NGO's section */}
      <div className="m-20 mx-auto px-4 md:px-40 bg-amber-50 pt-10 pb-6">
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
          {loading.causes ? (
            <div className="flex justify-center w-full py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : data.causeLogos.length > 0 ? (
            <>
              {data.causeLogos.map((cause) => (
                <div className="m-2" key={cause.id}>
                  <img
                    src={cause.logoUrl}
                    alt={cause.name || "Cause logo"}
                    className="w-[100px] h-[100px] rounded-full object-cover"
                  />
                </div>
              ))}
              <div>
                <button
                  className="bg-[#FFD705] text-blue-950 text-xl font-bold rounded-full w-[100px] h-[100px] px-2 flex items-center justify-center"
                  onClick={() => {
                    navigate("/support");
                    window.scrollTo(0, 0);
                  }}
                >
                  View All
                </button>
              </div>
            </>
          ) : (
            <div className="text-center w-full py-4">
              <p className="text-gray-500">
                No active causes available at the moment.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center pb-5">
          <p
            className="bg-[#FFD705] rounded-lg w-full md:w-72 py-2 inline-block cursor-pointer"
            onClick={() => {
              navigate("/cause-form");
              window.scrollTo(0, 0);
            }}
          >
            Create Your Own Fundraising Store
          </p>
        </div>
      </div>

      {/* Blogs section */}
      {loading.main ? (
        <Loader />
      ) : (
        <div className="mt-10 mx-auto px-6 md:px-40 pt-8 pb-6">
          <div>
            <p className="font-bold text-3xl md:text-4xl text-center font-slab">
              Recently Posted Blog
            </p>
            <p className="text-gray-600 text-sm md:text-lg text-center mx-auto mt-2">
              Share stories of how Shoppinessmart donations have made a
              difference in people's lives.
            </p>
          </div>

          {data.blogsData.length > 0 ? (
            <div className="grid grid-cols-12 gap-4 mt-10">
              {/* Main featured blog */}
              <div className="lg:col-span-5 col-span-12">
                <div>
                  <img
                    src={data.blogsData[0]?.thumbnail}
                    alt={data.blogsData[0]?.title}
                    className="w-full h-auto rounded-lg object-cover aspect-video"
                  />
                  <p className="font-medium text-lg mt-4">
                    {data.blogsData[0]?.title}
                  </p>
                  <p className="text-gray-500 text-sm md:text-base">
                    {data.blogsData[0]?.content?.substring(0, 120)}...{" "}
                    <Link to={`/blogs/${data.blogsData[0]?.id}`}>
                      <span className="text-[#049D8E] font-medium">
                        Read More...
                      </span>
                    </Link>
                  </p>
                  <p className="text-gray-400 mt-4">
                    By {data.blogsData[0]?.author},{" "}
                    {formatDate(data.blogsData[0]?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Smaller blog entries */}
              <div className="lg:col-span-7 col-span-12 mx-5">
                {data.blogsData.slice(1, 3).map((blog, index) => (
                  <div
                    key={blog.id}
                    className={`lg:flex ${index === 0 ? "mb-4" : ""}`}
                  >
                    <img
                      src={blog?.thumbnail}
                      alt={blog?.title}
                      className="lg:w-1/3 w-full h-auto rounded-lg object-cover aspect-video"
                    />
                    <div className="lg:ml-4 mt-4 lg:mt-0">
                      <p className="font-medium text-lg">{blog?.title}</p>
                      <p className="text-gray-500 text-sm md:text-base">
                        {blog?.content?.substring(0, 120)}...{" "}
                        <Link to={`/blogs/${blog.id}`}>
                          <span className="text-[#049D8E] text-sm md:text-base font-medium">
                            {" "}
                            Read More...
                          </span>
                        </Link>
                      </p>
                      <p className="text-gray-400 mt-4">
                        By {blog?.author}, {formatDate(blog?.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center mt-10">
              <p className="text-gray-500">
                No blog posts available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/blogs">
              <button className="bg-[#049D8E] text-white py-2 px-6 rounded-lg transition duration-300">
                View All Blogs
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Newsletter section */}
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
              className="flex flex-col justify-center items-center mt-8 md:mt-16"
              onSubmit={handleSubscribe}
            >
              <input
                type="text"
                name="name"
                className="text-gray-900 bg-white border-2 p-3 rounded-xl w-full md:w-[400px] mb-4"
                placeholder="Enter your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                className="text-gray-900 bg-white border-2 p-3 rounded-xl w-full md:w-[400px] mb-4"
                placeholder="Enter your Email here"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <button
                className="text-lg px-4 py-3 border-2 text-white bg-[#049D8E] rounded-xl w-full md:w-auto"
                type="submit"
              >
                Subscribe
              </button>
            </form>
            {message && <p className="mt-4 text-gray-600">{message}</p>}
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <FAQ />

      {/* Reviews section */}
      <PeopleSaySection />
    </div>
  );
};

export default Home;
