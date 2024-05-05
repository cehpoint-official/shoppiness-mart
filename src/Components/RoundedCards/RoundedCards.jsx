import cardOne from "../../assets/RegisterBusiness/cardOne.png";
import cardTwo from "../../assets/RegisterBusiness/cardTwo.png";
import cardThree from "../../assets/RegisterBusiness/cardThree.jpg";
import "./RoundedCards.scss"
const RoundedCards = ({color}) => {
  return (
    <div className="secFour" style={{
      backgroundColor : color
    }}>
      <div className="upperSec">
        <h1>Why you use this platform</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Blanditiis,commodi tempora mollitia voluptatem
        </p>
      </div>
      <div className="lowerSec">
        <div className="lowerCard">
          <img src={cardOne} alt="cardone" />
          <h4>Good Social impact</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
            totam aperiam nesciunt doloremque magni neque placeat, laborum nisi
            tiis,commodi tempora mollitia voluptatem recusandae impedit totam
            aperiam nesciunt doloremque magni neque placeat, laborum nisi
          </p>
        </div>
        <div className="lowerCard">
          <img src={cardTwo} alt="cardone" />
          <h4>Enhance staff participation</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
            totam aperiam nesciunt doloremque magni neque placeat, laborum nisi
            tiis,commodi tempora mollitia voluptatem recusandae impedit totam
            aperiam nesciunt doloremque magni neque placeat, laborum nisi
          </p>
        </div>
        <div className="lowerCard">
          <img src={cardThree} alt="cardone" />
          <h4>Business Growth with Donation</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
            totam aperiam nesciunt doloremque magni neque placeat, laborum nisi
            tiis,commodi tempora mollitia voluptatem recusandae impedit totam
            aperiam nesciunt doloremque magni neque placeat, laborum nisi
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoundedCards;
