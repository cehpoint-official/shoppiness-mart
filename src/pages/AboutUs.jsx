import page2 from "../assets/about1.png";
import about2 from "../assets/about2.png";
import OurEfforts from "../Components/OurEfforts";
import Loader from "../Components/Loader/Loader";
import { useState } from "react";
const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  setInterval(() => {
    setLoading(false);
  }, [3000]);
  return loading ? (
    <Loader />
  ) : (
    <div>
      {/* { About us } */}
      <div className="bg-white flex  gap-12 justify-center items-center	 flex-wrap  p-10">
        <div className="md:w-[500px] mt-6 ">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            About Us
          </h1>
          <p className="text-parapgraphColor">
            At ShoppinessMart, we believe in the power of everyday actions to
            create extraordinary impact. Our platform transforms your routine
            online shopping into a meaningful contribution to the causes you
            care about, making it easier than ever to make a difference. Our
            mission is simple yet powerful: to enable everyone to support
            charitable causes effortlessly through their regular online
            shopping. We aim to build a community where generosity is integrated
            into daily life, fostering a culture of giving and compassion.
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
      {/* { our story } */}
      <div className="flex justify-center items-center bg-backgreenColor my-10 py-10">
        <div className="p-6 max-w-4xl">
          <h1 className="text-3xl font-semibold font-slab text-center mb-4">
            Our Story
          </h1>
          <p className="text-parapgraphColor mb-4">
            The idea for ShoppinessMart was born out of a simple yet profound
            realization: every day, millions of people shop online, spending
            countless hours and dollars on purchases. What if we could harness
            that activity to support important causes without asking shoppers to
            spend any extra money? This thought sparked a journey that led to
            the creation of ShoppinessMart.
          </p>
          <p className="text-parapgraphColor mb-4">
            Our founders were deeply inspired by the notion that small actions,
            when multiplied by millions, can lead to significant change. They
            envisioned a platform where every online purchase could contribute
            to a better world. With backgrounds in technology, e-commerce, and
            social impact, they set out to build a solution that would
            seamlessly integrate philanthropy into everyday
          </p>
          <p className="text-parapgraphColor mb-4">
            Creating ShoppinessMart was no small feat. It required forging
            partnerships with hundreds of popular online stores, developing a
            user-friendly interface, and ensuring that the donation process was
            transparent and efficient. Our team worked tirelessly to build a
            platform that not only makes online shopping convenient but also
            enables meaningful contributions to various charitable causes.
          </p>
        </div>
      </div>
      {/* { our efforts } */}
      <OurEfforts />

      {/* { 4 rth page } */}
      <div className=" py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-medium mb-2 font-slab ">
            Our Members
          </h1>
          <p className="text-sm text-parapgraphColor">
            Our members are passionate individuals dedicated to making a
          </p>
          <p className="text-sm text-parapgraphColor">
            difference through their everyday shopping
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
