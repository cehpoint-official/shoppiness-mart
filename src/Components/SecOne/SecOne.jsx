import { Link } from "react-router-dom";
import "./SecOne.scss";
const SecOne = (props) => {
  const { name, title, paragraph, img } = props;
  return (
    <div className="secOne">
      <div className="left">
        <h1>{title}</h1>
        <p>{paragraph}</p>
        <div className="links">
          <div className="register">Register your {name}</div>
          <Link to="/login">Log in to your Account</Link>
        </div>
      </div>
      <div className="right">
        <img src={img} alt="person" />
      </div>
    </div>
  );
};

export default SecOne;
