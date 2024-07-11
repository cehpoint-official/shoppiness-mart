import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const PeopleSaySection = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Reviews"));
        const reviewsData = [];
        querySnapshot.forEach((doc) => {
          reviewsData.push({ id: doc.id, ...doc.data() });
        });
        console.log(reviewsData);
        setReviews(reviewsData);
      } catch (error) {
        console.log("Error getting documents: ", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="mt-16 mx-auto px-12 md:px-40 pt-8 pb-10 ">
      <div>
        <p className="font-bold md:text-4xl text-3xl text-center font-slab">
          What people say about us
        </p>
        <p className="text-gray-600 text-md md:text-xl text-center mx-auto  md:mt-4 mt-2 ">
          An establishment created to offer assistance and generate funds for
          individuals facing{" "}
        </p>
        <p className="text-gray-600 text-md md:text-xl text-center mx-auto ">
          {" "}
          challenges and hardships{" "}
        </p>
      </div>
      <div className="flex flex-wrap justify-center  md:mt-7">
        <Slider {...settings} className="container">
          {reviews?.map((item) => {
            return (
              <div
                key={item?.id}
                className="bg-white border-2  md:w-80 mt-8 md:mr-4 rounded-xl p-4"
              >
                <div className="mt-3 mx-2 pb-3">
                  <p className="md:text-2xl text-lg font-semibold ">
                    {item?.comment}
                  </p>
                  <p className=" font-normal  text-gray-500 mt-2 text-sm md:text-lg">
                    {item?.description}
                  </p>
                  <div className="gap-1 flex">
                    <i className="bi bi-star-fill text-[#FFD705] text-2xl"></i>
                    <i className="bi bi-star-fill text-[#FFD705] text-2xl"></i>
                    <i className="bi bi-star-fill text-[#FFD705] text-2xl"></i>
                    <i className="bi bi-star-fill text-[#FFD705] text-2xl"></i>
                    <i className="bi bi-star-fill text-[#FFD705] text-2xl"></i>
                  </div>
                  <div className="mt-2 flex ">
                    <img
                      src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                      alt=""
                      className="rounded-full h-16 w-16"
                    />
                    <div className="">
                      <p className="font-medium md:text-xl text-base mt-2 mx-4">
                        {item?.name}
                      </p>
                      <p className="text-[#049D8E] mx-4 text-sm">
                        {item?.post}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default PeopleSaySection;
