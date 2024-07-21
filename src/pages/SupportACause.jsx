import FAQ from "../Components/FAQ";
import PeopleSaySection from "../Components/PeopleSaySection";
import supportACause from "../assets/supportACause.png";
import charitiesImg from "../assets/RegisterBusiness/charities.png";
import supportPage1 from "../assets/supportPage1.png";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import Loader from "../Components/Loader/Loader";
import { useState } from "react";

const SupportACause = () => {
  const [loading, setLoading] = useState(true);
  setInterval(() => {
    setLoading(false);
  }, [3000]);
  document.title = "Support A Cause - Shopiness";
  return loading ? (
    <Loader />
  ) : (
    <div className="overflow-hidden">
      {/* 1st page  */}
      <div className="flex flex-wrap  justify-evenly py-16 px-3">
        <div className=" pt-10">
          <h3 className="md:text-4xl text-2xl font-bold font-slab">
            Explore our list of good causes and
          </h3>
          <h3 className="md:text-4xl text-2xl  pb-3 pt-2 font-bold font-slab">
            NGOs that need your support.
          </h3>
          <p className="text-sm">Choose the one you want to support</p>
          <div className="py-5">
            <input
              className="md:w-[80%] w-[70%] border-2 border-grey-500 text-sm ps-3 py-2.5 rounded-md"
              type="text"
              placeholder="Search name of the cause or NGO you want to support.."
            />
            <button className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8 ml-1">
              Find
            </button>
          </div>
          <p className="text-sm">
            You can also{" "}
            <a href="/" className="text-teal-500 underline decoration-1  	">
              Register your own cause/NGO
            </a>
          </p>
        </div>

        <div>
          <img
            className="w-[451px] h-[451px]"
            src={supportACause}
            alt="Loading..."
          />
        </div>
      </div>
      {/* { 2nd page } */}
      {/* <div className="bg-backgreenColor py-10">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2 font-slab">
            Our Popular Causes{" "}
          </h1>
          <p className="text-sm text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-sm text-parapgraphColor">
            Blanditiis,commodi tempora mollitia voluptatem{" "}
          </p>
        </div>

        <div className="flex justify-center gap-10 flex-wrap px-10 py-10">
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>

          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl">
            See all <span className="font-bold">5,000 + </span> Causes{" "}
            <i className="bi bi-arrow-right"></i>{" "}
          </p>
        </div>
      </div> */}
      <PopularCauses />
      {/* { 3rd page } */}
      <div className="my-20">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2 font-slab">
            Our Popular NGOs{" "}
          </h1>
          <p className="text-sm text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-sm text-parapgraphColor">
            Blanditiis,commodi tempora mollitia voluptatem{" "}
          </p>
        </div>

        <div className="flex justify-center gap-10 flex-wrap px-10 py-10">
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>

          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl">
            See all <span className="font-bold">5,000 + </span> Causes{" "}
            <i className="bi bi-arrow-right"></i>{" "}
          </p>
        </div>
      </div>
      {/* { 4th page } */}
      <div className="bg-backgroundLightYellowColor p-10">
        <div className="text-center">
          <h1 className="md:text-3xl text-2xl font-medium mb-2 font-slab ">
            Over 5000+ NGOs and good causes are need your support
          </h1>
        </div>
        <div className="flex justify-center my-10">
          <img src={charitiesImg} alt="load.." className="w-[1000px]" />
        </div>
      </div>
      {/* { 5th page } */}
      <FAQ />
      {/* { 6th page } */}
      <PeopleSaySection />
    </div>
  );
};

export default SupportACause;
