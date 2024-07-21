import { Link } from "react-router-dom";
import page41 from "../assets/SupportMaast/page41.png";
import { useState } from "react";
import Loader from "../Components/Loader/Loader";
const Blogs = () => {
  const [loading, setLoading] = useState(true);
  setInterval(() => {
    setLoading(false);
  }, [3000]);
  const blogs = [
    {
      photo: "df",
      title: "Blog title number 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,comm odiempora mollitia voluptatem recusandae impedit totam aperiam nesciu",
    },
    {
      photo: "df",
      title: "Blog title number 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,comm odiempora mollitia voluptatem recusandae impedit totam aperiam nesciu",
    },
    {
      photo: "df",
      title: "Blog title number 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,comm odiempora mollitia voluptatem recusandae impedit totam aperiam nesciu",
    },
    {
      photo: "df",
      title: "Blog title number 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,comm odiempora mollitia voluptatem recusandae impedit totam aperiam nesciu",
    },
    {
      photo: "df",
      title: "Blog title number 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,comm odiempora mollitia voluptatem recusandae impedit totam aperiam nesciu",
    },
    {
      photo: "df",
      title: "Blog title number 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,comm odiempora mollitia voluptatem recusandae impedit totam aperiam nesciu",
    },
  ];

  return loading ? (
    <Loader />
  ) : (
    <div>
      {/* { 1st page } */}
      <div className="flex justify-center items-center bg-backgreenColor py-10">
        <div className="p-6 max-w-4xl">
          <h1 className="text-3xl font-semibold font-slab text-center mb-4">
            Our Story
          </h1>
          <p className="text-paragraphColor mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
            commodi tempora mollitia voluptatem recusandae impedit totam aperiam
            nesciunt doloremque magni neque placeat, laborum nisi eum quae
            voluptatum.
          </p>
          <div className="flex items-center justify-center">
            <Link to="/signup">
              <button className="bg-[#047E72] text-white px-20 py-1 mt-5 rounded-lg">
                Sign Up for Free
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* { blogs  } */}
      <div className="py-20">
        <div className="flex flex-wrap justify-center gap-6 px-10">
          {blogs?.map((item, index) => (
            <div
              className="bg-white shadow-lg rounded-lg w-full sm:w-[250px] md:w-[300px] lg:w-[400px] flex flex-col"
              key={index}
            >
              <div>
                <img
                  src={page41}
                  alt="Loading..."
                  className="w-full h-auto md:h-[291px] object-cover"
                />
              </div>
              <div className="text-center p-4 flex-grow">
                <h3 className="text-lg md:text-xl font-semibold">
                  {item?.title}
                </h3>
                <p className="text-paragraphColor text-sm md:text-base">
                  {item?.description}
                </p>
              </div>
              <div className="flex items-center justify-center pb-4">
                <button className="bg-[#047E72] text-white px-8 py-1 mt-5 rounded-sm text-sm md:text-base">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
