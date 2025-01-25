import React from "react";

const About = () => {
  return (
    <div className="p-10">
      <h1 className="text-2xl mb-10">About Us</h1>
      <div className="px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl font-medium text-gray-900 ">
            Welcome to Shoppiness Mart, where your shopping makes a difference!
          </h2>
        </div>
        <div className="mt-8 text-xl">
          <p className="text-gray-500">
            At Shoppiness Mart, we believe that every purchase has the power to
            create positive change. Our platform is designed to connect your
            everyday shopping with meaningful causes and NGOs. By shopping with
            us, you not only get access to a wide range of products but also
            contribute to the betterment of communities and support causes that
            matter.
          </p>
          <p className="mt-4 text-gray-500">
            Our unique feature allows anyone to register their causes and raise
            funds directly through our platform. Whether you're an individual
            with a personal cause, an NGO, or a community group, Shoppiness Mart
            provides you with the tools and visibility to reach a larger
            audience and garner support.
          </p>
          <p className="mt-4 text-gray-500">
            Join us in making the world a better place, one purchase at a time.
            Together, we can turn shopping into a powerful force for good.
          </p>
          <p className="mt-4 text-gray-500">
            Welcome to the Shoppiness Mart community, where your choices matter.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 underline text-xl"
            >
              Know More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
