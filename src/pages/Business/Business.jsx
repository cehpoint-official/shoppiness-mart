import { Link } from "react-router-dom";
import ReuseableTop from "../../Components/ReuseableTop/ReuseableTop";
import FAQ from "../../Components/FAQ";
import Support from "../../Components/Support/Support";
import RoundedCards from "../../Components/RoundedCards/RoundedCards";
import "./Business.scss";
// import cardOne from "../../assets/RegisterBusiness/cardOne.png";
// import cardTwo from "../../assets/RegisterBusiness/cardTwo.png";
// import cardThree from "../../assets/RegisterBusiness/cardThree.jpg";
import personImg from "../../assets/RegisterBusiness/person.png";
import vid from "../../assets/RegisterBusiness/vid.png";
import boyImg from "../../assets/RegisterBusiness/boy.png";
import convoImg from "../../assets/RegisterBusiness/convo.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="business">
      <div className="businessContainer">
        <ReuseableTop
          name="Business/Services"
          title="Grow your Online/Offline business with meaningful purpose"
          paragraph="Join ShoppinessMart and connect with customers who support businesses that give back to social causes."
          img={personImg}
        />
        <div className="secTwo">
          <div className="left">
            <h1>How this platform works for businesses</h1>
            <p>
              ShoppinessMart provides a unique opportunity for businesses to stand out in a competitive market by
              aligning their brand with impactful social causes. When you list your business on our platform, customers
              can choose to support you while contributing to meaningful initiatives. Our system ensures that a portion
              of each transaction made through ShoppinessMart is directed towards causes that resonate with your brand.
              <br /><br />
              Businesses that participate not only gain increased exposure but also build strong connections with socially
              conscious consumers who prefer to shop with purpose. By leveraging our platform, you can reach new
              customers, drive repeat business, and showcase your commitment to making a difference in the community.
              ShoppinessMart is designed to help you grow while creating a lasting impact.
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
              When a business supports social initiatives, it fosters a culture of purpose and engagement among employees.
              Studies have shown that employees are more motivated and productive when they work for a company that
              actively gives back to the community. With ShoppinessMart, your employees can take part in charitable
              initiatives that align with your brand's values, whether through donations, volunteering, or cause-driven
              promotions.
              <br /><br />
              By integrating ShoppinessMart into your business model, you can encourage staff participation in social
              impact programs, enhancing workplace morale and job satisfaction. This not only helps in retaining talent
              but also positions your company as a leader in corporate social responsibility. Together, we can transform
              shopping into a force for good, one transaction at a time.
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
              "Since joining ShoppinessMart, we've experienced a significant boost in customer engagement and loyalty.
              Our customers love knowing that their purchases contribute to important causes, which has strengthened
              our brand's reputation and increased word-of-mouth referrals. The integration process was seamless, and
              we saw immediate benefits in terms of sales growth and customer retention."
              <br /><br />
              "We've always believed in giving back, but with ShoppinessMart, we now have a structured way to connect
              our business with causes that matter. It has not only increased our revenue but also positioned us as a
              socially responsible brand. Our employees and customers are more engaged than ever, and we feel proud
              to be part of this movement."
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
