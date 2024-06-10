import page2 from "../assets/about1.png";
import about2 from "../assets/about2.png";
import page41 from "../assets/SupportMaast/page41.png";

const AboutUs = () => {
  return (
    <div>
      {/* { 1 st page } */}
      <div className="bg-white flex  gap-12 justify-center items-center	 flex-wrap  p-10">
        <div className="md:w-[500px] mt-6 ">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            About Us
          </h1>
          <p className="text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
            totam aperiam nesciunt doloremque magni neque placeat, laborum nisi
            eum quae voluptatum Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem
            recusandae impedit totam aperiam nesciunt doloremque magni neque
            placeat, laborum nisi eum quae voluptatum
          </p>
        </div>

        <div className="mt-6">
          <img
            src={page2}
            alt="Loading..."
            className="w-[432px] h-[300px] rounded-lg"
          />
        </div>
      </div>
      {/* { 2 nd page } */}
      <div className="flex justify-center items-center bg-backgreenColor my-10 py-10">
        <div className="p-6 max-w-4xl">
          <h1 className="text-3xl font-semibold font-slab text-center mb-4">
            Our Story
          </h1>
          <p className="text-parapgraphColor mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
            commodi tempora mollitia voluptatem recusandae impedit totam aperiam
            nesciunt doloremque magni neque placeat, laborum nisi eum quae
            voluptatum.
          </p>
          <p className="text-parapgraphColor mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
            commodi tempora mollitia voluptatem recusandae impedit totam aperiam
            nesciunt doloremque magni neque placeat, laborum nisi eum quae
            voluptatum.
          </p>
          <p className="text-parapgraphColor mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
            commodi tempora mollitia voluptatem recusandae impedit totam aperiam
            nesciunt doloremque magni neque placeat, laborum nisi eum quae
            voluptatum.
          </p>
          <p className="text-parapgraphColor mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
            commodi tempora mollitia voluptatem recusandae impedit totam aperiam
            nesciunt doloremque magni neque placeat, laborum nisi eum quae
            voluptatum.
          </p>
        </div>
      </div>
      {/* { 3 rd page } */}
      <div className=" py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-medium mb-2 font-slab ">
            Our efforts
          </h1>
          <p className="text-sm text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-sm text-parapgraphColor">
            Blanditiis,commodi tempora mollitia voluptatem{" "}
          </p>
        </div>

        <div className="flex justify-center gap-6 flex-wrap px-10 py-10">
          <div className=" bg-white md:w-[400px] w-[250px] shadow-lg rounded-lg">
            <div>
              <img src={page41} alt="Loading..." className="md:h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl text-lg font-semibold">
                Mission and vision
              </h3>
              <p className="text-parapgraphColor text-sm md:text-basic">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum
              </p>
            </div>
          </div>
          <div className=" bg-white md:w-[400px] w-[250px] shadow-lg rounded-lg">
            <div>
              <img src={page41} alt="Loading..." className="md:h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl text-lg font-semibold">
                Mission and vision
              </h3>
              <p className="text-parapgraphColor text-sm md:text-basic">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum
              </p>
            </div>
          </div>
          <div className=" bg-white md:w-[400px] w-[250px] shadow-lg rounded-lg">
            <div>
              <img src={page41} alt="Loading..." className="md:h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl text-lg font-semibold">
                Mission and vision
              </h3>
              <p className="text-parapgraphColor text-sm md:text-basic">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* { 4 rth page } */}
      <div className=" py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-medium mb-2 font-slab ">
            Our Members
          </h1>
          <p className="text-sm text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-sm text-parapgraphColor">
            Blanditiis,commodi tempora mollitia voluptatem{" "}
          </p>
        </div>

        <div className="flex justify-center gap-6 flex-wrap px-10 py-10">
          <div>
            <img src={about2} alt="" />
          </div>
          <div>
            <img src={about2} alt="" />
          </div>
          <div>
            <img src={about2} alt="" />
          </div>
          <div>
            <img src={about2} alt="" />
          </div>
          <div>
            <img src={about2} alt="" />
          </div>
          <div>
            <img src={about2} alt="" />
          </div>
          <div>
            <img src={about2} alt="" />
          </div>
          <div>
            <img src={about2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
