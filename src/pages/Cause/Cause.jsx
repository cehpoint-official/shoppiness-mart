import React from "react";
import causeImg from "../../assets/RegisterBusiness/cause.jpg";
import "./Cause.scss";
import SecOne from "../../Component/Business/SecOne";

const Cause = () => {
  return (
    <div className="cause">
      <div className="causeContainer">
        <SecOne
          title="Get wholehearted support for all causes and NGOs"
          paragraph="Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia"
          name="Cause/NGO"
          img={causeImg}
        />
      </div>
    </div>
  );
};

export default Cause;
