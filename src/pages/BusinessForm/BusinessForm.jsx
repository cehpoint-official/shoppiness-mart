import { useState } from "react";
import "./BusinessForm.scss";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/RegisterBusiness/logo.png";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../config/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SuccessPage from "../../Components/SuccessPage/SuccessPage";

const BusinessForm = () => {
  //states
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    owner: "",
    mode: "",
    contact: "",
    email: "",
    cat: "",
    location: "",
    pincode: "",
    shortDesc: "",
  });
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
          setUploadProgress(progress);
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
      await addDoc(collection(db, "businessDetails"), {
        ...businessDetails,
        logoUrl,
        bannerUrl,
      });
    } catch (e) {
      alert(e.message);
    }
  };

  const pages = [
    {
      title: "Business Details",
      content: (
        <form className="formFirst" onSubmit={handleNextPage}>
          <div className="left">
            <div className="item">
              <label>Business/Services Name</label>
              <input
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    businessName: e.target.value,
                  })
                }
                required
                type="text"
              />
            </div>
            <div className="item">
              <label>Business/Services Owner Name</label>
              <input
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    owner: e.target.value,
                  })
                }
                required
                type="text"
              />
            </div>
            <h3>Business/Services Type</h3>
            <div className="options">
              <label htmlFor="online">Online</label>
              <input
                id="online"
                name="options"
                type="radio"
                value="online"
                required
                onClick={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    mode: e.target.value,
                  })
                }
              />
              <label htmlFor="offline">Offline</label>
              <input
                id="offline"
                type="radio"
                name="options"
                value="offline"
                required
                onClick={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    mode: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="right">
            <div className="item">
              <label>Contact number</label>
              <p>(The number of the business man or service provider office)</p>
              <input
                type="tel"
                required
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    contact: e.target.value,
                  })
                }
              />
            </div>

            <div className="item">
              <label>Email Id</label>
              <p>(The number of the business man or service provider office)</p>
              <input
                type="email"
                required
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    email: e.target.value,
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
      title: "Shop Details",
      content: (
        <form className="formSecond" onSubmit={handleNextPage}>
          <div className="left">
            <div className="item">
              <label>Select Category</label>
              <select
                required
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
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
                required
                type="text"
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    location: e.target.value,
                  })
                }
              />
            </div>
            <div className="item">
              <label>PIN Code</label>
              <input
                required
                type="number"
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    pincode: e.target.value,
                  })
                }
              />
            </div>

            <div className="item">
              <label>Short Description</label>
              <p>(Write a description about your business or service)</p>
              <textarea
                required
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
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
              <h3>Add Logo</h3>
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
              <input required type="text" />
            </div>
            <div className="item">
              <label>Last Name</label>
              <input required type="text" />
            </div>
            <div className="item">
              <label>Mobile number</label>
              <input required type="text" />
            </div>
          </div>
          <div className="right">
            <div className="item">
              <label>Email Address</label>
              <input required type="email" />
            </div>
            <div className="item">
              <label>Password</label>
              <input required type="password" />
            </div>
            <div className="item">
              <label> Confirm Password</label>
              <input required type="password" />
            </div>
            <div className="btns">
              <button className="back" onClick={handleBackPage}>
                Back
              </button>
              <button className="next">Create Your Account</button>
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

export default BusinessForm;
