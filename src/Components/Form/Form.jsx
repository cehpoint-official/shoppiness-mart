import { useState } from "react";
import "./Form.scss";
import { FaCircleCheck } from "react-icons/fa6";

const Form = () => {
  const [pageFirst, setPageFirst] = useState(true);
  const [pageSecond, setPageSecond] = useState(false);
  const [pageThird, setPageThird] = useState(false);

  const handleNextFirstPage = () => {
    setPageSecond(true);
    setPageFirst(false);
  };
  const handleNextSecondPage = () => {
    setPageThird(true);
    setPageSecond(false);
  };

  const handleBackSecond = () => {
    setPageFirst(true);
    setPageSecond(false);
  };
  const handleBackThird = () => {
    setPageThird(false);
    setPageSecond(true);
  };

  return (
    <div className="form">
      <h1>Register a business/Services</h1>
      <div className="stepper">
        <div className="btn">
          <div className={pageFirst ? "check active" : "check"}>
            <FaCircleCheck />
          </div>
          <button>Business Details</button>
        </div>

        <div className="btn">
          <div className={pageSecond ? "check active" : "check"}>
            <FaCircleCheck />
          </div>
          <button>Shop Details</button>
        </div>

        <div className="btn">
          <div className={pageThird ? "check active" : "check"}>
            <FaCircleCheck />
          </div>
          <button>Create your account</button>
        </div>
      </div>

      <div className="formContainer">
        {pageFirst && (
          <div className="first">
            <h2>hey page one</h2>
            <button onClick={handleNextFirstPage}>Next</button>
          </div>
        )}
        {pageSecond && (
          <div className="first">
            <h2>hey page two</h2>
            <button onClick={handleNextSecondPage}>Next</button>
            <button onClick={handleBackSecond}>back</button>
          </div>
        )}
        {pageThird && (
          <div className="first">
            <h2>hey page three</h2>
            <button onClick={handleBackThird}>back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;

// const url =
//   "https://inrdeals.com/fetch/stores?token=2c3f5a1662f83d1db90c9441012d4b3ffc21bbfb&id=maa443089855";
