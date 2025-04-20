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
          <p className="text-sm text-parapgraphColor px-4">
            Our efforts focus on supporting numerous charity projects and
          </p>
          <p className="text-sm text-parapgraphColor px-4">
            fostering a community of giving through seamless and effortless
            actions.
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
              <p className="text-parapgraphColor text-sm md:text-basic my-2 mx-2">
                At ShoppinessMart, our mission is to revolutionize online
                shopping by integrating effortless giving into every purchase.
                We envision a world where supporting meaningful causes is a
                seamless part of everyday life. Our platform is designed to make
                philanthropy accessible, enabling everyone to contribute to
                positive change through their regular shopping habits.
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
              <p className="text-parapgraphColor text-sm md:text-basic my-2 mx-2">
                We are committed to supporting a wide range of charity projects
                that make a real difference in people's lives. From providing
                hunger relief and emergency aid to supporting education and
                healthcare initiatives, our partnerships with various
                organizations ensure that your contributions go where they are
                needed most. Together, we are building stronger communities and
                fostering a better future for all.
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
              <p className="text-parapgraphColor text-sm md:text-basic my-2 mx-2">
                The ShoppinessMart Foundation organizes and participates in
                numerous events to raise awareness and funds for important
                causes. Through charity drives, community events, and special
                campaigns, we engage with our users and partners to amplify our
                impact. These events not only provide critical support to our
                partner organizations but also bring our community together in
                the spirit of giving and solidarity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurEfforts;
