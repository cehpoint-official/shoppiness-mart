import { Link } from "react-router-dom";
import ReuseableTop from "../../Components/ReuseableTop/ReuseableTop";
import FAQ from "../../Components/FAQ";
import Support from "../../Components/Support/Support";
import RoundedCards from "../../Components/RoundedCards/RoundedCards";
import "./Business.scss";

import personImg from "../../assets/RegisterBusiness/person.png";
import vid from "../../assets/RegisterBusiness/vid.png";
import boyImg from "../../assets/RegisterBusiness/boy.png";
import convoImg from "../../assets/RegisterBusiness/convo.png";

const Business = () => {
  return (
    <div className="business">
      <div className="businessContainer">
        <ReuseableTop
          title="Grow you Online/Offline business with meaningful purpose"
          paragraph=" Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint eos
          atque eligendi, repellat molestiae delectus?"
          name="Business/Services"
          img={personImg}
        />
        <div className="secTwo">
          <div className="left">
            <h1>How this platform works for businesses</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem
              recusandae impedit totam aperiam nesciunt doloremque magni neque
              placeat, laborum nisi eum quae voluptatum atum Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Blanditiis,commodi tempora
              mollitia voluptatem recusandae impedit totam aperiam nesciunt
              doloremque magni neque placeat, laborum nisi eum quae voluptatum{" "}
            </p>
            <Link to="/signup">Sign Up</Link>
          </div>
          <div className="right">
            <img src={vid} alt="person" />
          </div>
        </div>

        <div className="secThree">
          <div className="left">
            <img src={boyImg} alt="person" />
          </div>
          <div className="right">
            <h1>Enhance staff participation</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem
              recusandae impedit totam aperiam nesciunt doloremque magni neque
              placeat, laborum nisi eum quae voluptatum ng elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum{" "}
            </p>
            <div className="links">
              <Link className="online">Online Shopping</Link>
              <Link className="offline">Offline Shopping</Link>
            </div>
          </div>
        </div>

        <RoundedCards />

        <div className="secFive">
          <div className="left">
            <h1>What are other businesses saying about ShoppinessMart</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi eum quae voluptatum Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem
              recusandae impedit totam aperiam nesciunt doloremque magni neque
              placeat, laborum nisi eum quae voluptatum
            </p>
            <Link to="/signUp">Sign Up for free</Link>
          </div>
          <div className="right">
            <img src={convoImg} alt="convoImg" />
          </div>
        </div>
        <FAQ />
        <Support num="5,000 +" />
      </div>
    </div>
  );
};

export default Business;
