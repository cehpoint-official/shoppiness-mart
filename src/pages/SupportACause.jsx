import React from "react";
import FAQ from "../Component/FAQ";
import PeopleSaySection from "../Component/PeopleSaySection";
import supportACause from "../assets/supportACause.png";
const SupportACause = () => {
  document.title = "Support A Cause - Shopiness";
  return (
    <div className="px-12 overflow-hidden">
      {/* 1st page  */}
      <div className="carousel mx-auto  p-4  ">
        <div className="flex flex-row  space-x-4 ">
          <div className="carousel-item w-64 lg:w-full  transition-transform translate-x-2">
            <img src={supportACause} className="" alt="Slide 1" />
          </div>
          <div className="carousel-item w-64 lg:w-full">
            <img src={supportACause} className="" alt="Slide 2" />
          </div>
          <div className="carousel-item w-64 lg:w-auto">
            <img src={supportACause} className="" alt="Slide 3" />
          </div>
        </div>
      </div>

      <FAQ />
      <PeopleSaySection />
    </div>
  );
};

export default SupportACause;
