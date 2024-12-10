import { Link } from "react-router-dom";
import "./RoundedCards.scss";

const RoundedCards = ({ color, data }) => {
  return (
    <div
      className="secFour"
      style={{
        backgroundColor: color
      }}
    >
      <div className="upperSec">
        <h1>Why you use this platform</h1>
        <p>
          Shoppinessmart creates a win-win-win situation for shoppers,
          charities, and businesses by making charitable giving an effortless
          part of the shopping experience.
        </p>
      </div>
      <div className="lowerSec">
        {data.map((e) => (
          <Link to={e.link}>
            <div className="lowerCard" key={e.id}>
              <img src={e.img} alt="card" />
              <h4>{e.title}</h4>
              <p>{e.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoundedCards;
