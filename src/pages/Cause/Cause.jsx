import React from "react";
import causeImg from "../../assets/RegisterBusiness/cause.jpg";
import donationImg from "../../assets/RegisterBusiness/donations.png";
import bg from "../../assets/RegisterBusiness/bg2.png";
import "./Cause.scss";
import {Link} from "react-router-dom"
import SecOne from "../../Component/SecOne/SecOne";
import Support from "../../Component/Support/Support";
import PopularCauses from "../../Component/PopularCauses";
import PeopleSaySection from "../../Component/PeopleSaySection";
import FAQ from "../../Component/FAQ";

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

        <div className="secTwo">
          <div className="left">
            <img src={donationImg} alt="donationImg" />
          </div>
          <div className="right">
            <img src={bg} alt="" />
            <h5>HOW TO GET STARTED</h5>
            <h1>Get donations for your cause/NGO</h1>
            <div className="points">
              <div className="point">
                <h5>1. Sign up your cause</h5>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nostrum, dolores.
                </p>
              </div>
              <div className="point">
                <h5>2. Get donations through online shopping</h5>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nostrum, dolores.
                </p>
              </div>
              <div className="point">
                <h5>3. You Can Raise more</h5>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nostrum, dolores.
                </p>
              </div>
            </div>
            <div className="link">
              <Link to="/">Register a Causes/NGO</Link>
            </div>
          </div>
        </div>

        <Support num="6,000 +" />
        <PopularCauses/>
        <FAQ/>
        <PeopleSaySection/>
      </div>
    </div>
  );
};

export default Cause;
