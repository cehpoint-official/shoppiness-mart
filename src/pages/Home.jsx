import Home1 from "../assets/Home/home1.png";
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
import img11 from "../assets/Home/img11.png";
import img12 from "../assets/Home/img12.png";
import img13 from "../assets/Home/img13.png";
import img14 from "../assets/Home/img14.png";
import img15 from "../assets/Home/img15.png";
import img16 from "../assets/Home/img16.png";
import img17 from "../assets/Home/img17.png";
import Logo1 from "../assets/Home/logo1.png";
import Logo2 from "../assets/Home/logo2.png";
import Logo3 from "../assets/Home/logo3.png";
import Logo4 from "../assets/Home/logo4.png";
import Logo5 from "../assets/Home/logo5.png";
import Blog1 from "../assets/Home/blog1.png";
import Blog2 from "../assets/Home/blog2.png";
import Blog3 from "../assets/Home/blog3.png";
import Backimg9 from "../assets/Home/backimg9.png";
import PeopleSaySection from "../Components/PeopleSaySection";
import FAQ from "../Components/FAQ";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import page3 from "../assets/SupportMaast/page3.png";
import RoundedCards from "../Components/RoundedCards/RoundedCards";
import Card7th1 from "../assets/card7th1.png";
import Card7th2 from "../assets/card7th2.png";
import Card7th3 from "../assets/card7th3.png";
import Carousel from "../Components/Carousel/Carousel";

const Home = () => {
  return (
    <div className=" overflow-hidden">
      {/* 1st Page  */}
      <Carousel img1={Home1} img2={Home1} img3={Home1} />

      {/* 2nd page */}
      <div className="mt-10 mx-auto px-4 md:px-40 bg-[#EEFAF9] py-12 mb-40 ">
        <div>
          <h1 className="font-bold md:text-4xl text-3xl text-center font-slab ">
            Most preferred online and offline partners{" "}
          </h1>
          <p className="text-gray-600 md:text-xl text-sm text-center mx-auto  md:mt-8 mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
            totam aperiam nesciunt
          </p>
        </div>

        <div className="">
          <div className="text-[#047E72] font-medium text-lg text-center md:mt-10 mt-4">
            Online partners
          </div>
          <div className="flex justify-center items-center flex-wrap gap-9">
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

          <div className="flex justify-center items-center flex-wrap gap-9">
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
            See all <span className="font-bold">5,000 + </span> Causes{" "}
            <i className="bi bi-arrow-right"></i>{" "}
          </p>
        </div>
      </div>
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
              What is ShoppinessMart?
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
      {/* 4th page */}
      <RoundedCards
        data={[
          { title: "Offline & Online Shopping", img: img14, id: 1 },
          { title: "Amazing Deals & Cash Back", img: img15, id: 2 },
          { title: "Cashback Charity", img: img16, id: 3 },
        ]}
      />
      {/* 6th page  */}
      <div className="bg-backgroundLightYellowColor gap-12 flex justify-center items-center flex-wrap p-10 ">
        <div className="mt-6">
          <img src={page3} alt="Loading..." className="w-[432px] h-[300px]" />
        </div>
        <div className="md:w-[400px] mt-6 ">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            Support MAAST and Other Charities
          </h1>
          <p className="text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia .Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Blanditiis,commodi tempora mollitia
          </p>
          <div className="flex gap-2">
            <button className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8 mt-4">
              Online Shopping
            </button>
            <button className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8 mt-4">
              Offline Shopping
            </button>
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
      <div className="mt-10 mx-auto px-4 md:px-40 bg-amber-50 pt-10 pb-6 ">
        <p className="font-bold text-5xl font-slab text-center">
          Raise funds for your cause/NGOs/ charity
        </p>
        <p className="text-gray-600  text-center mx-auto text-xl mt-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
        </p>
        <p className="text-gray-600 text-xl  text-center mx-auto  ">
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
        <p className="font-bold text-5xl text-center font-slab">
          Recently Posted Blog
        </p>
        <p className="text-gray-600 text-xl text-center mx-auto  mt-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
        </p>
        <p className="text-gray-600 text-xl   text-center mx-auto  ">
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
          <p className="font-bold font-slab text-5xl">
            Subscribe to Our Newsletter
          </p>
          <p className="text-gray-600 text-xl mx-auto mt-5">
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
