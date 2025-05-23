import { Link } from "react-router-dom";
import "./ReuseableTop.scss";
const ReuseableTop = (props) => {
  const { name, title, paragraph, img } = props;
  return (
    <div className="ReuseableTop">
      <div className="left">
        <h1>{title}</h1>
        <p>{paragraph}</p>
        <div className="links">
          <Link
            to={name === "Business/Services" ? "/business-form" : "/cause-form"}
            className="register"
          >
            Register your {name}
          </Link>
          <Link
            to={
              name === "Business/Services" ? "/login/business" : "/login/cause"
            }
          >
            Log in to your Account
          </Link>
        </div>
      </div>
      <div className="right">
        <img src={img} alt="person" />
      </div>
    </div>
  );
};

export default ReuseableTop;
