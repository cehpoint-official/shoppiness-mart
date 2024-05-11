import FAQ from "../Components/FAQ";
import PeopleSaySection from "../Components/PeopleSaySection";
import supportACause from "../assets/supportACause.png";
import supportPage1 from "../assets/supportPage1.png";
const SupportACause = () => {
  // border-2 border-red-500
  document.title = "Support A Cause - Shopiness";
  return (
    <div className="px-12 overflow-hidden">
      {/* 1st page  */}
      <div className="flex flex-wrap  justify-evenly py-16 px-3">
        <div className=" pt-10">
          <h3 className="text-4xl font-bold">
            Explore our list of good causes and
          </h3>
          <h3 className="text-4xl font-medium pb-3">
            NGOs that need your support.
          </h3>
          <p className="text-sm">Choose the one you want to support</p>
          <div className="py-5">
            <input
              className="border-2 border-grey-500 text-sm ps-3 py-2.5 rounded-md w-[80%]"
              type="text"
              placeholder="Search name of the cause or NGO you want to support.."
            />
            <button className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8 ml-1">
              Find
            </button>
          </div>
          <p className="text-sm">You can also Register your own cause/NGO</p>
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
      <div className="bg-backgreenColor py-10">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2 ">Our Popular Causes </h1>
          <p className="text-sm text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-sm text-parapgraphColor">
            Blanditiis,commodi tempora mollitia voluptatem{" "}
          </p>
        </div>

        <div className="flex justify-between flex-wrap px-10 py-10">
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-md">See all 5000 + Causes </p>
        </div>
      </div>
      {/* { 3rd page } */}
      <div className="my-20">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2 ">Our Popular NGOs</h1>
          <p className="text-sm text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-sm text-parapgraphColor">
            Blanditiis,commodi tempora mollitia voluptatem{" "}
          </p>
        </div>

        <div className="flex justify-between flex-wrap px-10 py-10">
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={supportPage1} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 ">children education </p>
              <p className="font-medium py-2">400 Supports, 5,000000 raised</p>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-md">See all 5000 + Causes </p>
        </div>
      </div>
      {/* { 4th page } */}
      <div className="bg-backgroundLightYellowColor p-10">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2 ">
            Over 5000+ NGOs and good causes are need your support
          </h1>
        </div>
        <div className="flex flex-wrap justify-around my-10">
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
          <div>
            <img
              src={supportPage1}
              alt="loading..."
              className="w-[216px] m-5"
            />
          </div>
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
