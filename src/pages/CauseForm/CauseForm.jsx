import { useState } from "react";
import "./CauseForm.scss";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/RegisterBusiness/logo.png";
import SuccessPage from "../../Components/SuccessPage/SuccessPage";
import { db, storage } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Form = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  const [causeDetails, setCauseDetails] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");

  //next page
  const handleNextPage = (e) => {
    e.preventDefault();

    setCompletedSteps((prev) => {
      const updatedSteps = [...prev];
      updatedSteps[currentPage - 1] = true;
      return updatedSteps;
    });

    setCurrentPage((prev) => prev + 1);
  };

  //previous page
  const handleBackPage = () => setCurrentPage((prev) => prev - 1);

  //create Account
  const handleCreateAccount = (e) => {
    e.preventDefault();
    addData();
    handleNextPage(e);
    setSuccess(true);
  };

  //setting and uploading logo
  const handleFileChangeLogo = async (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) {
      await uploadFile(file);
    }
  };

  //setting and uploading banner
  const handleFileChangeBanner = async (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    if (file) {
      await uploadFile(file);
    }
  };

  // uplod photo function with percentage
  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const metadata = {
        contentType: "image/jpeg",
      };
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(`${progress}%`);
          switch (snapshot.state) {
            case "paused":
              setUploadProgress(progress);
              break;
            case "running":
              setUploadProgress(`Uploded ${progress}%`);

              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              reject("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              reject("User canceled the upload");
              break;
            case "storage/unknown":
              reject("Unknown error occurred, inspect error.serverResponse");
              break;
            default:
              reject("An error occurred");
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  //Adding All data  to firestore DB
  const addData = async () => {
    try {
      const logoUrl = logoFile ? await uploadFile(logoFile) : "";
      const bannerUrl = bannerFile ? await uploadFile(bannerFile) : "";
      await addDoc(collection(db, "causeDetails"), {
        ...causeDetails,
        logoUrl,
        bannerUrl,
      });
    } catch (e) {
      alert(e.message);
    }
  };

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
                  setCauseDetails({
                    ...causeDetails,
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
                  setCauseDetails({
                    ...causeDetails,
                    shortDesc: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>
          <div className="right">
            <h3>Cause Type</h3>
            <div className="options">
              <label htmlFor="individual">Individual</label>
              <input
                id="individual"
                name="options"
                type="radio"
                value="individual"
                onClick={(e) =>
                  setCauseDetails({
                    ...causeDetails,
                    type: e.target.value,
                  })
                }
              />
              <label htmlFor="organisation">Group / Organisation</label>
              <input
                id="organisation"
                type="radio"
                name="options"
                value="organisation"
                onClick={(e) =>
                  setCauseDetails({
                    ...causeDetails,
                    type: e.target.value,
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
                  setCauseDetails({
                    ...causeDetails,
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
                  setCauseDetails({
                    ...causeDetails,
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
                  setCauseDetails({
                    ...causeDetails,
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
                  setCauseDetails({
                    ...causeDetails,
                    shortDesc: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>
          <div className="right">
            {uploadProgress !== "" ? (
              <p className="uploadProgress">{uploadProgress.slice(0, 12)}</p>
            ) : (
              ""
            )}
            <div className="item">
              <h3>Upload Logo</h3>
              <label htmlFor="file1">
                <p>Drag And Drop</p>
                or
                <p className="chooseFile">Choose File</p>
              </label>
              <input type="file" id="file1" onChange={handleFileChangeLogo} />
            </div>

            <div className="item">
              <h3>Add Banner</h3>
              <label htmlFor="file2">
                <p>Drag And Drop</p>
                or
                <p className="chooseFile">Choose File</p>
              </label>
              <input type="file" id="file2" onChange={handleFileChangeBanner} />
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
        <form className="formThird" onSubmit={handleCreateAccount}>
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
              <button className="next" type="submit">
                Create Your Account
              </button>
            </div>
          </div>
        </form>
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
      <div className="formContainer">
        {success ? <SuccessPage /> : pages[currentPage - 1].content}
      </div>
    </div>
  );
};

export default Form;
