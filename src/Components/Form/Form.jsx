import { useState } from "react";
import "./Form.scss";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/RegisterBusiness/logo.png";

const Form = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);

  const handleNextPage = (e) => {
    e.preventDefault();
    setCompletedSteps((prev) => {
      const updatedSteps = [...prev];
      updatedSteps[currentPage - 1] = true;
      return updatedSteps;
    });
    setCurrentPage((prev) => prev + 1);
  };

  const handleBackPage = () => setCurrentPage((prev) => prev - 1);

  const pages = [
    {
      title: "Business Details",
      content: (
        <form className="formFirst">
          <div className="left">
            <div className="item">
              <label>Business/Services Name</label>
              <input type="text" />
            </div>
            <div className="item">
              <label>Business/Services Name</label>
              <input type="text" />
            </div>
            <h3>Business/Services Owner Name</h3>
            <div className="options">
              <label htmlFor="online">Online</label>
              <input id="online" name="options" type="radio" />
              <label htmlFor="offline">Offline</label>
              <input id="offline" type="radio" name="options" />
            </div>
          </div>
          <div className="right">
            <div className="item">
              <label>Contact number</label>
              <p>(The number of the business man or service provider office)</p>
              <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
            </div>

            <div className="item">
              <label>Email Id</label>
              <p>(The number of the business man or service provider office)</p>
              <input type="email" />
            </div>

            <div className="btns">
              <Link className="cancel" to="/register-business">
                Cancel
              </Link>
              <button type="button" onClick={handleNextPage} className="save">
                Save & Next
              </button>
            </div>
          </div>
        </form>
      ),
    },
    {
      title: "Shop Details",
      content: (
        <form className="formSecond">
          <div className="left">
            <div className="item">
              <label>Select Category</label>
              <select>
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
              </select>
            </div>
            <div className="item">
              <label>Location</label>
              <input type="text" />
            </div>
            <div className="item">
              <label>PIN Code</label>
              <input type="text" />
            </div>

            <div className="item">
              <label>Short Description</label>
              <p>(Write a description about your business or service)</p>
              <textarea></textarea>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <h3>Upload Logo</h3>
              <label htmlFor="file1">
                <p>Drag And Drop</p>
                or
                <p className="chooseFile">Choose File</p>
              </label>
              <input type="file" id="file1" />
            </div>

            <div className="item">
              <h3>Add Banner</h3>
              <label htmlFor="file2">
                <p>Drag And Drop</p>
                or
                <p className="chooseFile">Choose File</p>
              </label>
              <input type="file" id="file2" />
            </div>

            <div className="btns">
              <button className="back" onClick={handleBackPage}>
                Back
              </button>
              <button className="next" onClick={handleNextPage}>
                Save & Next
              </button>
            </div>
          </div>
        </form>
      ),
    },
    {
      title: "Create your account",
      content: (
        <form className="formThird">
          <div className="left">
            <div className="item">
              <label>First Name</label>
              <input type="text" />
            </div>
            <div className="item">
              <label>Last Name</label>
              <input type="text" />
            </div>
            <div className="item">
              <label>Mobile number</label>
              <input type="text" />
            </div>
          </div>
          <div className="right">
            <div className="item">
              <label>Email Address</label>
              <input type="email" />
            </div>
            <div className="item">
              <label>Password</label>
              <input type="password" />
            </div>
            <div className="item">
              <label> Confirm Password</label>
              <input type="password" />
            </div>
            <div className="btns">
              <button className="back" onClick={handleBackPage}>
                Back
              </button>
              <button className="next" onClick={() => setSuccess(true)}>
                Create Your Account
              </button>
            </div>
          </div>
        </form>
      ),
    },
  ];

  return success ? (
    <h1>Success</h1>
  ) : (
    <div className="form">
      <div className="nav">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <h1>Register a business/Services</h1>
      </div>
      <div className="stepper">
        {pages.map((page, index) => (
          <div className="btn" key={index}>
            <div className={completedSteps[index] ? "check active" : "check"}>
              <FaCircleCheck />
            </div>
            <h3>{page.title}</h3>
          </div>
        ))}
      </div>
      <div className="formContainer">{pages[currentPage - 1].content}</div>
    </div>
  );
};

export default Form;
