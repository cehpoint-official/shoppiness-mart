import { useState } from "react";
import "./CauseForm.scss";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/RegisterBusiness/logo.png";
// import { addDoc, collection } from "firebase/firestore";
// import { db, storage } from "../../firebase.js";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Form = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  const [businessDetails, setBusinessDetails] = useState({});
  const [shopDetails, setShopDetails] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

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
      title: "Cause / NGO Details",
      content: (
        <form className="causeformFirst" onSubmit={handleNextPage}>
          <div className="left">
            <div className="item">
              <label>Cause/NGO Name</label>
              <input
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    name: e.target.value,
                  })
                }
                type="text"
              />
            </div>
            <div className="item">
              <label>Short Description</label>
              <p>(Write a description about your Cause/NGO)</p>
              <textarea
                className="causeDesc"
                onChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    shortDesc: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>
          <div className="right">
            <h3>Cause Type</h3>
            <div className="options">
              <label htmlFor="online">Individual</label>
              <input
                id="online"
                name="options"
                type="radio"
                value="online"
                onClick={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    mode: e.target.value,
                  })
                }
              />
              <label htmlFor="offline">Group / Organisation</label>
              <input
                id="offline"
                type="radio"
                name="options"
                value="offline"
                onClick={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    mode: e.target.value,
                  })
                }
              />
            </div>
            <div className="btns">
              <Link className="cancel" to="/register-business">
                Cancel
              </Link>
              <button type="submit" className="save">
                Save & Next
              </button>
            </div>
          </div>
        </form>
      ),
    },
    {
      title: "About Cause / NGO",
      content: (
        <form className="formSecond" onSubmit={handleNextPage}>
          <div className="left">
            <div className="item">
              <label>Select Category</label>
              <select
                onChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    cat: e.target.value,
                  })
                }
              >
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
              </select>
            </div>
            <div className="item">
              <label>Location</label>
              <input
                type="text"
                onChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    location: e.target.value,
                  })
                }
              />
            </div>
            <div className="item">
              <label>PIN Code</label>
              <input
                type="text"
                onChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    pincode: e.target.value,
                  })
                }
              />
            </div>

            <div className="item">
              <label>Short Description</label>
              <p>(Write a description about your Cause/NGO)</p>
              <textarea
                onChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    shortDesc: e.target.value,
                  })
                }
              ></textarea>
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
              <input
                type="file"
                id="file1"
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </div>

            <div className="item">
              <h3>Add Banner</h3>
              <label htmlFor="file2">
                <p>Drag And Drop</p>
                or
                <p className="chooseFile">Choose File</p>
              </label>
              <input
                type="file"
                id="file2"
                onChange={(e) => setBannerFile(e.target.files[0])}
              />
            </div>

            <div className="btns">
              <button className="back" onClick={handleBackPage}>
                Back
              </button>
              <button type="submit" className="next">
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

        <h1>Register a Cause/NGO</h1>
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
      <div className="progress">
        {pages.map((_, index) => (
          <div
            className={completedSteps[index] ? "complete active" : "complete"}
            key={index}
          ></div>
        ))}
      </div>
      <div className="formContainer">{pages[currentPage - 1].content}</div>
    </div>
  );
};

export default Form;
