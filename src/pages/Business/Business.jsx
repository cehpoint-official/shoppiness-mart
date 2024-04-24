import { Link } from "react-router-dom";
import "./Business.scss"

const Business = () => {
  return (
    <div className="business">
      <div className="businessContainer">
        <div className="topSection">
          <div className="left">
            <h1>Grow you Online/Offline business with meaningful purpose</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint eos
              atque eligendi, repellat molestiae delectus?
            </p>
            <button>Register your Business/Services</button>
            <Link>Log in to your Account</Link>
          </div>
          <div className="right"></div>
        </div>
      </div>
    </div>
  );
}

export default Business