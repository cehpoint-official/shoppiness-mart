import { Link } from "react-router-dom";
import "./HowItworks.scss";
import store from "../../assets/RegisterBusiness/store.png";
import signup from "../../assets/RegisterBusiness/signup.png";
import money from "../../assets/RegisterBusiness/money.png";
import bag from "../../assets/RegisterBusiness/bag.jpg";
import video from "../../assets/RegisterBusiness/vid.png";
import Onlinewishes from "../../assets/RegisterBusiness/Onlinewishes.png";
import card1 from "../../assets/RegisterBusiness/howitworksCard1.png";
import card2 from "../../assets/RegisterBusiness/howitworksCard2.png";
import card3 from "../../assets/RegisterBusiness/howitworksCard3.png";
import { RiSearchFill } from "react-icons/ri";
import RoundedCards from "../../Components/RoundedCards/RoundedCards";
import FAQ from "../../Components/FAQ";

const HowItWorks = () => {
  return (
    <div className="howitworks">
      <div className="howitworksContainer">
        <div className="secOne">
          <div className="left">
            <h1>How Works SHOPPINESSMART</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem
              recusandae impedit totam aperiam nesciunt doloremque magni neque
              placeat, laborum nisi eum quae voluptatum
            </p>
            <Link to="/register" className="register">
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
                    <span>Sign up: </span>Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Blanditiis,commodi tempora mollitia
                    voluptatem recusandae impedit
                  </p>
                </div>
                <div className="point">
                  <div className="img">
                    <RiSearchFill fontSize={"40px"} />
                  </div>
                  <p>
                    <span>Sign up: </span>Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Blanditiis,commodi tempora mollitia
                    voluptatem recusandae impedit
                  </p>
                </div>
                <div className="point">
                  <div className="img">
                    <img src={bag} alt="loading" />
                  </div>
                  <p>
                    <span>Sign up: </span>Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Blanditiis,commodi tempora mollitia
                    voluptatem recusandae impedit
                  </p>
                </div>

                <div className="point">
                  <div className="img">
                    <img src={money} alt="loading" />
                  </div>
                  <p>
                    <span>Sign up: </span>Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Blanditiis,commodi tempora mollitia
                    voluptatem recusandae impedit
                  </p>
                </div>

                <Link className="signup" to="/login">
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem
              recusandae impedit totam aperiam nesciunt doloremque magni neque
              placeat, laborum nisi eum quae voluptatum
            </p>
            <Link to="/register" className="shoping">
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
            { title: "Buyer", img: card1, id: 1 },
            { title: "Seller", img: card2, id: 2 },
            { title: "Volunteer", img: card3, id: 3 },
          ]}
        />
        <FAQ />
        {/* <PeopleSaySection /> */}
      </div>
    </div>
  );
};

export default HowItWorks;
