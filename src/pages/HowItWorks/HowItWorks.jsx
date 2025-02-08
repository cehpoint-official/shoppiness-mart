import { Link } from "react-router-dom";
import "./HowItworks.scss";
// ================================
import store from "../../assets/homepage/store.png";
import video from "../../assets/homepage/homepage.png";
import Onlinewishes from "../../assets/homepage/Onlinewishes.png";
import card1 from "../../assets/homepage/howitworksCard1.png";
import card2 from "../../assets/homepage/howitworksCard2.png";
import card3 from "../../assets/homepage/howitworksCard3.png";

import signup from "../../assets/RegisterBusiness/signup.png";
import money from "../../assets/RegisterBusiness/money.png";
import bag from "../../assets/RegisterBusiness/bag.jpg";
// =====================================
import { RiSearchFill } from "react-icons/ri";
import RoundedCards from "../../Components/RoundedCards/RoundedCards";
import FAQ from "../../Components/FAQ";

const HowItWorks = () => {
  return (
    <div className="howitworks">
      <div className="howitworksContainer">
        <div className="secOne">
          <div className="left">
            <h1>How SHOPPINESSMART Works </h1>
            <p>
              SHOPPINESSMART makes it easy to turn your everyday online shopping
              into a force for good. Simply join our platform for free by
              signing up on our website or app and select the charities you wish
              to support. Browse through our extensive list of partnered online
              stores and shop for your favorite products at no extra cost. For
              every purchase you make through SHOPPINESSMART, a percentage of
              the sale is automatically donated to your chosen charity. This
              way, you can enjoy your shopping while knowing you&apos;re contributing
              to meaningful causes and making a positive impact on the world. By
              seamlessly integrating charity into your everyday shopping
              experience, SHOPPINESSMART helps you support the causes you care
              about without spending an extra penny.
            </p>
            <Link to="/signup" className="register">
              Sign up for free
            </Link>
          </div>
          <div className="right">
            <img src={store} alt="loading" />
          </div>
        </div>

        <div className="secTwo">
          <h1>How you can start raising</h1>
          <div className="container">
            <div className="left">
              <img src={video} alt="loading" />
            </div>
            <div className="right">
              <div className="points">
                <div className="point">
                  <div className="img">
                    <img src={signup} alt="loading" />
                  </div>
                  <p>
                    <span>Sign up: </span>Join our platform for free by signing
                    up on our website or app and select the charities you wish
                    to support.
                  </p>
                </div>
                <div className="point">
                  <div className="img">
                    <RiSearchFill fontSize={"40px"} />
                  </div>
                  <p>
                    <span>Make a Difference: </span>Enjoy your shopping while
                    knowing you&apos;re contributing to meaningful causes and
                    making a positive impact on the world.
                  </p>
                </div>
                <div className="point">
                  <div className="img">
                    <img src={bag} alt="loading" />
                  </div>
                  <p>
                    <span>Shop: </span>Browse through our extensive list of
                    partnered online stores and shop for your favorite products
                    at no extra cost.
                  </p>
                </div>

                <div className="point">
                  <div className="img">
                    <img src={money} alt="loading" />
                  </div>
                  <p>
                    <span>Donate: </span>For every purchase you make through
                    SHOPPINESSMART, a percentage of the sale is automatically
                    donated to your chosen charity.
                  </p>
                </div>

                <Link to="/signup" className="signup">
                  SIGN UP FOR FREE
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="secThree">
          <div className="left">
            <h5>How it works</h5>
            <h1>
              Online Offline Shopping With Cashback,Deals for you,help to others
            </h1>
            <p>
              When you shop through our platform, whether online or offline, you
              earn cashback on every purchase. Simply browse and select from our
              partnered stores, shop as usual, and enjoy exclusive deals. A
              portion of the cashback you earn is automatically donated to a
              charity of your choice, allowing you to support important causes
              without any extra cost. Track your earnings and contributions
              through your user dashboard, making every purchase a meaningful
              one. Save money and make a difference with Shoppinessmart!
            </p>
            <Link to="/signup" className="shoping">
              Start Shopping
            </Link>
          </div>
          <div className="right">
            <img src={Onlinewishes} alt="loading" />
          </div>
        </div>

        <RoundedCards
          color={"#049D8E1A"}
          data={[
            {
              title: "Buyer",
              img: card1,
              id: 1,
              desc: "Shoppinessmart turns your everyday shopping into a powerful tool for giving back. By shopping through our platform, you not only enjoy exclusive deals and cashback on your purchases, but a portion of this cashback is automatically donated to a charity of your choice. This way, every purchase you make contributes to a greater cause, making your shopping experience both rewarding and impactful.",
            },
            {
              title: "Seller",
              img: card2,
              id: 2,
              desc: "Partnering with Shoppinessmart provides businesses with an opportunity to connect with socially conscious consumers. By offering exclusive deals and participating in our cashback program, sellers can increase their visibility and customer base. This partnership not only drives sales but also enhances your brand’s reputation as a business that supports charitable initiatives, fostering customer loyalty and trust.",
            },
            {
              title: "Volunteer",
              img: card3,
              id: 3,
              desc: "Shoppinessmart also empowers volunteers and charities by providing a steady stream of donations through our platform. This consistent funding helps charities and non-profits to sustain and expand their efforts, making a real difference in communities. Volunteers can promote Shoppinessmart to their networks, ensuring that every purchase made supports their cause, amplifying their impact with minimal effort.",
            },
          ]}
        />
        <FAQ />
        {/* <PeopleSaySection /> */}
      </div>
    </div>
  );
};

export default HowItWorks;
