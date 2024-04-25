import { Link } from "react-router-dom";
import img1 from "../../assets/RegisterBusiness/person.png"
import "./Business.scss"

const Business = () => {
  return (
    <div className="business">
      <div className="businessContainer">
        <div className="secOne">
          <div className="left">
            <h1>Grow you Online/Offline business with meaningful purpose</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint eos
              atque eligendi, repellat molestiae delectus?
            </p>
            <div className="links">
              <div className="register">Register your Business/Services</div>
              <Link>Log in to your Account</Link>
            </div>
          </div>
          <div className="right">
            <img src={img1} alt="person" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Business