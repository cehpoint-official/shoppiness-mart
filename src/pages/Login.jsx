import Backimg from "../assets/backimg.png";
import Loginimg from "../assets/loginimg.png";
import ShoppingBag2 from "../assets/ShoppingBag2.png";
import { useParams } from "react-router-dom";
import UserLoginForm from "./LoginType/UserLoginForm";
import BusinessLoginForm from "./LoginType/BusinessLoginForm";
import CauseLoginForm from "./LoginType/CauseLoginForm";

const Login = () => {
  const { userType } = useParams();

  // Render the appropriate login form based on the userType
  const renderLoginForm = () => {
    switch (userType) {
      case "user":
        return <UserLoginForm userType={userType} />;
      case "business":
        return <BusinessLoginForm userType={userType} />;
      case "cause":
        return <CauseLoginForm userType={userType} />;
      default:
        return <p>Invalid user type</p>;
    }
  };

  return (
    <>
      <div className="overflow-hidden">
        <div className="flex flex-wrap">
          {/* <!-- Left Column --> */}
          <div className="w-full sm:w-1/2  relative">
            <div className="absolute inset-0">
              <img
                src={Backimg}
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="mx-10 mt-5">
                <img src={ShoppingBag2} alt="Shopping Bag" className="h-11" />
              </div>
              <div>
                <img src={Loginimg} alt="Login" />
              </div>
            </div>
          </div>

          {/* <!-- Right Column --> */}

          <div className="w-full sm:w-1/2 flex flex-col justify-center p-4">
            {renderLoginForm()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
