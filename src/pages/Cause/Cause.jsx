import "./Cause.scss";
import { Link } from "react-router-dom";
import causeImg from "../../assets/RegisterBusiness/cause.jpg";
import donationImg from "../../assets/RegisterBusiness/donations.png";
import bg from "../../assets/RegisterBusiness/bg2.png";

import ReuseableTop from "../../Components/ReuseableTop/ReuseableTop";
import Support from "../../Components/Support/Support";
import PopularCauses from "../../Components/PopularCauses/PopularCauses";
import PeopleSaySection from "../../Components/PeopleSaySection";
import FAQ from "../../Components/FAQ";
import Card7th1 from "../../assets/card7th1.png";
import Card7th2 from "../../assets/card7th2.png";
import Card7th3 from "../../assets/card7th3.png";
const Cause = () => {
  return (
    <div className="cause">
      <div className="causeContainer">
        <ReuseableTop
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
        <PopularCauses
          data={[
            {
              title: "Healthy Food For All",
              titleSmall: "Child health Care",
              img: Card7th1,
              id: 1,
            },
            {
              title: "Animal Care",
              titleSmall: "Animal Care",
              img: Card7th2,
              id: 2,
            },
            {
              title: "Green World",
              titleSmall: "Green World",
              img: Card7th3,
              id: 3,
            },
          ]}
        />
        <FAQ />
        <PeopleSaySection />
      </div>
    </div>
  );
};

export default Cause;
