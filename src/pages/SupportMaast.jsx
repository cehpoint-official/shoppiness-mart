import FAQ from "../Components/FAQ";
import OurEfforts from "../Components/OurEfforts";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import headerImg from "../assets/SupportMaast/header.png";
import page2 from "../assets/SupportMaast/page2.png";
import page3 from "../assets/SupportMaast/page3.png";
import playingworld from "../assets/SupportMaast/playingworld.png";
import savenature from "../assets/SupportMaast/savenature.png";
import blooddonate from "../assets/SupportMaast/blooddonate.png";
import { useState } from "react";
import DonationDialog from "../Components/DonationDialog";

const SupportMasst = () => {
  document.title = "Support Maast - Shopiness";
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Update all your donate buttons to use this handler
  const handleDonateClick = () => {
    setIsDialogOpen(true);
  };
  return (
    <div className=" overflow-hidden">
      {/* { 1st page } */}
      <div>
        <img src={headerImg} alt="Loading..." className=" w-full h-full" />
      </div>

      {/* { what is maast } */}
      <div className="bg-backgreenColor flex  gap-12 justify-center items-center	 flex-wrap  p-10">
        <div className="md:w-[400px] mt-6 ">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            What is MAAST?
          </h1>
          <p className="text-parapgraphColor">
            MAAST is an initiative designed to create a positive impact on
            society by supporting various charitable causes. Through the MAAST
            program, users can contribute to meaningful projects that focus on
            areas such as hunger relief, nutrition, emergency aid, support for
            the elderly, and children&apos;s welfare. By participating in MAAST,
            individuals can donate, volunteer, or raise awareness to help
            transform lives and communities.
          </p>
          <div>
            <button
              onClick={handleDonateClick}
              className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8 mt-4"
            >
              Donate
            </button>
          </div>
        </div>

        <div className="mt-6">
          <img
            src={page2}
            alt="Loading..."
            className="w-[432px] h-[300px] rounded-lg"
          />
        </div>
      </div>
      {/* { support maast and other charities } */}
      <div className="bg-backgroundLightYellowColor gap-12 flex justify-center items-center flex-wrap p-10 ">
        <div className="mt-6">
          <img
            src={page3}
            alt="Loading..."
            className="w-[432px] h-[300px] rounded-lg"
          />
        </div>

        <div className="md:w-[400px] mt-6 ">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            Support MAAST and Other Charities
          </h1>
          <p className="text-parapgraphColor">
            ShoppinessMart is committed to making a difference by turning
            everyday online shopping into a powerful force for good. Through our
            platform, you can support a variety of charities, including the
            MAAST initiative and others, without spending any extra money. By
            simply shopping through ShoppinessMart, a percentage of your
            purchase is donated to the cause you care about. It’s an effortless
            way to contribute to a better world.
          </p>
          <div>
            <button
              onClick={handleDonateClick}
              className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8 mt-4"
            >
              Donate
            </button>
          </div>
        </div>
      </div>

      {/* { our efforts } */}
      <OurEfforts />

      {/* { 5th page } */}
      <div className="bg-backgreenColor py-20">
        <div className="text-center">
          <h1 className="md:text-4xl text-3xl font-medium mb-2 font-slab  ">
            Events
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
              <img
                src={blooddonate}
                alt="Loading..."
                className="md:h-[297px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="text-lg md:text-xl font-semibold ">
                Blood Donations Camp
              </h3>
              <p className="text-[#F8BD00] my-3 md:text-lg text-sm">
                8:00 AM - 10 AM
              </p>
              <div>
                <button className="bg-teal-500 text-white font-medium rounded-md md:py-2.5 py-2 md:px-8 px-4 md:text-lg text-sm">
                  Read More
                </button>
              </div>
            </div>
          </div>
          <div className=" bg-white md:w-[400px] w-[250px] shadow-lg rounded-lg">
            <div>
              <img src={savenature} alt="Loading..." className="md:h-[297px]" />
            </div>

            <div className="text-center p-4">
              <h3 className="text-lg md:text-xl font-semibold ">
                Save The Nature
              </h3>
              <p className="text-[#F8BD00] my-3 md:text-lg text-sm">
                8:00 AM - 10 AM
              </p>
              <div>
                <button className="bg-teal-500 text-white font-medium rounded-md md:py-2.5 py-2 md:px-8 px-4 md:text-lg text-sm">
                  Read More
                </button>
              </div>
            </div>
          </div>
          <div className=" bg-white md:w-[400px] w-[250px] shadow-lg rounded-lg">
            <div>
              <img
                src={playingworld}
                alt="Loading..."
                className="md:h-[297px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="text-lg md:text-xl font-semibold ">
                Playing For World
              </h3>
              <p className="text-[#F8BD00] my-3 md:text-lg text-sm">
                8:00 AM - 10 AM
              </p>
              <div>
                <button className="bg-teal-500 text-white font-medium rounded-md md:py-2.5 py-2 md:px-8 px-4 md:text-lg text-sm">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* { 6th page } */}
      {/* <div className="py-20">
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
      {/* { 7th page } */}
      <FAQ />
      <DonationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default SupportMasst;
