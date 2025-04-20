
import "./RoundedCards.scss"

const RoundedCards = ({color,data}) => {
  return (
    <div
      className="secFour"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="upperSec">
        <h1>Why you use this platform</h1>
        <p>
        Shoppinessmart creates a win-win-win situation for shoppers, charities, and businesses by making charitable giving an effortless part of the shopping experience.
        </p>
      </div>
      <div className="lowerSec">
        {data.map((e) => (
          <div className="lowerCard" key={e.id}>
            <img className="p-4" src={e.img} alt="card" />
            <h4>{e.title}</h4>
            <p className="text-justify mx-4">
              {e.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundedCards;
