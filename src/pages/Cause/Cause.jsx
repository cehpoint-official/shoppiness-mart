import "./Cause.scss";
import { Link } from "react-router-dom";
import causeImg from "../../assets/RegisterBusiness/cause.jpg";
import donationImg from "../../assets/RegisterBusiness/donations.png";
import bg from "../../assets/RegisterBusiness/bg2.png";

import ReuseableTop from "../../Components/ReuseableTop/ReuseableTop";
import Support from "../../Components/Support/Support";
import PopularCauses from "../../Components/PopularCauses/PopularCauses";
import FAQ from "../../Components/FAQ";
const Cause = () => {
  return (
    <div className="cause">
      <div className="causeContainer">
        <ReuseableTop
          title="Get wholehearted support for all causes and NGOs"
          paragraph="ShoppinessMart helps NGOs and social causes raise funds effortlessly through online shopping contributions."
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
                  Register your NGO or cause on ShoppinessMart to start receiving support from shoppers worldwide.
                </p>
              </div>
              <div className="point">
                <h5>2. Get donations through online shopping</h5>
                <p>
                  Every time a customer makes a purchase through our platform, a portion of the sale is donated to your cause.
                </p>
              </div>
              <div className="point">
                <h5>3. You Can Raise more</h5>
                <p>
                  Spread the word and encourage more people to shop via ShoppinessMart to boost your donations.
                </p>
              </div>
            </div>
            <div className="link">
              <Link to="/cause-form">Register a Causes/NGO</Link>
            </div>
          </div>
        </div>

        <Support num="6,000 +" />
        <PopularCauses />
        <FAQ />
        {/* <PeopleSaySection /> */}
      </div>
    </div>
  );
};

export default Cause;
