import { Link } from "react-router-dom";
import ReuseableTop from "../../Components/ReuseableTop/ReuseableTop";
import FAQ from "../../Components/FAQ";
import Support from "../../Components/Support/Support";
import RoundedCards from "../../Components/RoundedCards/RoundedCards";
import "./Business.scss";
import cardOne from "../../assets/RegisterBusiness/cardOne.png";
import cardTwo from "../../assets/RegisterBusiness/cardTwo.png";
import cardThree from "../../assets/RegisterBusiness/cardThree.jpg";
import personImg from "../../assets/RegisterBusiness/person.png";
import vid from "../../assets/RegisterBusiness/vid.png";
import boyImg from "../../assets/RegisterBusiness/boy.png";
import convoImg from "../../assets/RegisterBusiness/convo.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState,useEffect } from "react";

const Business = () => {
  const [roundedCardsData, setRoundedCardsData] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "WhyThisPlatform"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
        setRoundedCardsData(data);
      });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };
  console.log(roundedCardsData);

  useEffect(() => {
    fetchData();
  }, []);

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
            <Link to="/business-form">Sign Up</Link>
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
              <Link to="/online-shop" className="online">Online Shopping</Link>
              <Link to="/offline-shop" className="offline">Offline Shopping</Link>
            </div>
          </div>
        </div>

        <RoundedCards
          data={roundedCardsData}
        />

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
            <Link to="/business-form">Sign Up for free</Link>
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
