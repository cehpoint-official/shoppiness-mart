import "./SuccessPage.scss";
import submitted from "../../assets/RegisterBusiness/submitted.png";
import { Link } from "react-router-dom";
const SuccessPage = ({ link, title }) => {
  return (
    <div className="success">
      <img src={submitted} alt="loading" />
      <h1>Your {title} Details are successfully Submitted</h1>
      <p>
        Thank you for registering with us! 🎉 We&apos;re thrilled to have you on
        board. Our team will connect with you shortly to discuss the next steps.
        Sit tight! 😊
      </p>
      <Link to={link}>OK</Link>
    </div>
  );
};

export default SuccessPage;
