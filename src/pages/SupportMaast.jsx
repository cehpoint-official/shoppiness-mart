import FAQ from "../Components/FAQ";
import headerImg from "../assets/SupportMaast/header.png";
import page2 from "../assets/SupportMaast/page2.png";
import page3 from "../assets/SupportMaast/page3.png";
import page41 from "../assets/SupportMaast/page41.png";
import page42 from "../assets/SupportMaast/page42.png";
import page43 from "../assets/SupportMaast/page43.png";
const SupportMasst = () => {
  document.title = "Support Maast - Shopiness";
  return (
    <div className="px-12 overflow-hidden">
      {/* { 1st page } */}
      <div>
        <img src={headerImg} alt="Loading..." className=" w-full h-full" />
      </div>

      {/* { 2nd page } */}
      <div className="bg-backgreenColor flex justify-center items-start  p-20 ">
        <div className="w-[400px] mr-8 ">
          <h1 className="text-4xl font-semibold mb-4">What is MAAST?</h1>
          <p className="text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
            totam aperiam nesciunt doloremque magni neque placeat, laborum nisi
            eum quae voluptatum .voluptatem recusandae impedit totam aperiam
            nesciunt doloremque magni neque placeat, laborum nisi eum quae
            voluptatum
          </p>
        </div>
        <div>
          <img
            src={page2}
            alt="Loading..."
            className="w-[432px] h-[300px] ml-8"
          />
        </div>
      </div>
      {/* { 3rd page } */}
      <div className="bg-backgroundLightYellowColor flex justify-center items-start p-20 ">
        <div>
          <img
            src={page3}
            alt="Loading..."
            className="w-[432px] h-[300px] mr-8"
          />
        </div>
        <div className="w-[400px] ml-8 ">
          <h1 className="text-4xl font-semibold mb-4">
            Support MAAST and Other Charities
          </h1>
          <p className="text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia .Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Blanditiis,commodi tempora mollitia
          </p>
          <div>
            <button className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8 mt-4">
              Donate
            </button>
          </div>
        </div>
      </div>

      {/* { 4th page } */}
      <div className=" py-10">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2 ">Our efforts</h1>
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
              <img src={page41} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Mission and vision</h3>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={page42} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Charity projects</h3>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum
              </p>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={page43} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">Foundation and events</h3>
              <p className="text-parapgraphColor">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* { 5th page } */}
      <div className="bg-backgreenColor py-10">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2 ">Events</h1>
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
              <img src={page41} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">We Want To Help</h3>
              <p className="text-[#F8BD00] my-3 text-lg">8:00 AM - 10 AM</p>
              <div>
                <button className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8">
                  Read More
                </button>
              </div>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={page41} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">We Want To Help</h3>
              <p className="text-[#F8BD00] my-3 text-lg">8:00 AM - 10 AM</p>
              <div>
                <button className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8">
                  Read More
                </button>
              </div>
            </div>
          </div>
          <div className=" bg-white w-[400px] my-5 shadow-lg rounded-lg">
            <div>
              <img src={page41} alt="Loading..." className="h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-xl font-semibold">We Want To Help</h3>
              <p className="text-[#F8BD00] my-3 text-lg">8:00 AM - 10 AM</p>
              <div>
                <button className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* { 6th page } */}
      <div className="py-10">
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
              <img src={page41} alt="Loading..." className="h-[297px]" />
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
              <img src={page41} alt="Loading..." className="h-[297px]" />
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
              <img src={page41} alt="Loading..." className="h-[297px]" />
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
              <img src={page41} alt="Loading..." className="h-[297px]" />
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
              <img src={page41} alt="Loading..." className="h-[297px]" />
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
              <img src={page41} alt="Loading..." className="h-[297px]" />
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
      </div>
      {/* { 7th page } */}
      <FAQ />
    </div>
  );
};

export default SupportMasst;
