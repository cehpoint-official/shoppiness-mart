import { useState } from "react";
import "./Form.scss";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/RegisterBusiness/logo.png";

const Form = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
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
          <for className="right">
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
              <button onClick={handleNextPage} className="save">
                Save & Next
              </button>
            </div>
          </for>
        </form>
      ),
    },
    {
      title: "Shop Details",
      content: (
        <div className="formSecond">
          <div className="left">
            <div className="item">
              <label>Select Catagory</label>
              <select>
                <option value="one">One</option>
                <option value="one">Two</option>
                <option value="one">Three</option>
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
              <label htmlFor="file">
                <p>Drag And Drop</p>
                or
                <p>Choose File</p>
              </label>
              <input type="file" id="file" />
            </div>

            <div className="item">
              <h3>Add Banner</h3>
              <label htmlFor="file">
                <p>Drag And Drop</p>
                or
                <p>Choose File</p>
              </label>
              <input type="file" id="file" />
            </div>

            <div className="btns">
              <button onClick={handleNextPage}>Next</button>
              <button onClick={handleBackPage}>Back</button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Create your account",
      content: (
        <div className="first">
          <h2>hey page three</h2>
          <button onClick={handleBackPage}>Back</button>
        </div>
      ),
    },
  ];

  return (
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
            <div
              className={currentPage === index + 1 ? "check active" : "check"}
            >
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
