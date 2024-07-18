import page41 from "../assets/SupportMaast/page41.png";
import efforts2 from "../assets/oureffort2.png";
import efforts3 from "../assets/oureffort3.png";

const OurEfforts = () => {
  return (
    <div>
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
              <img src={efforts2} alt="Loading..." className="md:h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl text-lg font-semibold">
                Charity projects
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
              <img src={efforts3} alt="Loading..." className="md:h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl text-lg font-semibold">
                Foundation and events
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
    </div>
  );
};

export default OurEfforts;
