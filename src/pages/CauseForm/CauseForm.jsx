import { useState } from "react";
import "./CauseForm.scss";
import { FaCircleCheck } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/RegisterBusiness/logo.png";
import SuccessPage from "../../Components/SuccessPage/SuccessPage";
import { db, storage } from "../../../firebase.js";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import axios from "axios";
const CauseForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  const [causeDetails, setCauseDetails] = useState({
    // Page 1 fields
    causeName: "",
    aboutCause: "",
    type: "",

    // Page 2 fields
    cat: "",
    location: "",
    pincode: "",
    shortDesc: "",

    // Page 3 fields
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e, field) => {
    const { value } = e.target;

    setCauseDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          causeDetails.causeName && causeDetails.aboutCause && causeDetails.type
        );
      case 2:
        return (
          causeDetails.cat &&
          causeDetails.location &&
          causeDetails.pincode &&
          causeDetails.shortDesc
        );
      case 3:
        return (
          causeDetails.firstName &&
          causeDetails.lastName &&
          causeDetails.mobileNumber &&
          causeDetails.email &&
          causeDetails.password &&
          causeDetails.confirmPassword
        );
      default:
        return true;
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault();

    // Validate current page fields
    if (validateCurrentPage()) {
      setCompletedSteps((prev) => {
        const updatedSteps = [...prev];
        updatedSteps[currentPage - 1] = true; // Mark current step as completed
        return updatedSteps;
      });

      setCurrentPage((prev) => prev + 1); // Move to the next page
    }
  };

  const handleBackPage = (e) => {
    e.preventDefault();
    setCurrentPage((prev) => prev - 1);
  };

  const checkEmailExists = async (email) => {
    const causeRef = collection(db, "causeDetails");
    const q = query(causeRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (validateCurrentPage()) {
      setIsLoading(true);
      try {
        // Check if email already exists
        const emailExists = await checkEmailExists(causeDetails.email);

        if (emailExists) {
          toast.error(
            "This email is already registered. Please use a different email address."
          );
          // Keep the user on the same page
          setIsLoading(false);
          return;
        }

        await addData(); // Add data to Firebase
        // Add notification to adminNotifications collection
        await addDoc(collection(db, "adminNotifications"), {
          message: `New Cause/NGO registration request from ${causeDetails.firstName} ${causeDetails.lastName} for "${causeDetails.causeName}".`,
          createdAt: new Date().toISOString(),
          read: false,
        });
        // Send confirmation email
        try {
          await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
            email: causeDetails.email,
            title: "ShoppinessMart - Cause/NGO Registration Confirmation",
            body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">Thank you for registering with ShoppinessMart!</h2>
              
              <p>Dear ${causeDetails.firstName} ${causeDetails.lastName},</p>
              
              <p>We have received your Cause/NGO registration request for "${causeDetails.causeName}". Our team will review your application and get back to you soon.</p>
              
              <p>Please note:</p>
              <ul>
                <li>The review process typically takes 2-3 business days</li>
                <li>You will receive another email once your registration is approved</li>
                <li>If we need any additional information, we will contact you at this email address</li>
              </ul>
              
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              
              <p>Best regards,<br>
              The ShoppinessMart Team</p>
            </div>
          `,
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
        }
        setSuccess(true);
        toast.success("NGO registered successfully!");
      } catch (error) {
        toast.error("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Validate file format
  const validateFileFormat = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedFormats.includes(file.type)) {
      toast.error("Only .png, .jpeg, and .jpg formats are allowed.");
      return false;
    }
    return true;
  };

  const handleFileChangeLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file format
    if (!validateFileFormat(file)) {
      return;
    }

    setLogoFile(file);
    await uploadFile(file);
  };

  const handleFileChangeBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file format
    if (!validateFileFormat(file)) {
      return;
    }

    setBannerFile(file);
    await uploadFile(file);
  };

  // Upload photo function with percentage
  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      const metadata = {
        contentType: file.type, // Use the file's MIME type
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
              setUploadProgress(`Uploaded ${progress}%`);
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

  // Adding All data to firestore DB
  const addData = async () => {
    try {
      const logoUrl = logoFile ? await uploadFile(logoFile) : "";
      const bannerUrl = bannerFile ? await uploadFile(bannerFile) : "";

      await addDoc(collection(db, "causeDetails"), {
        ...causeDetails,
        logoUrl,
        bannerUrl,
        status: "Pending",
        createdDate: formatDate(new Date()),
        totalDonationAmount: 0,
        totalGiveBacks: 0,
      });
    } catch (e) {
      throw new Error(e.message); // Throw error to handle in handleCreateAccount
    }
  };
  function formatDate(date) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }
  const pages = [
    {
      title: "Cause / NGO Details",
      content: (
        <form className="causeformFirst" onSubmit={handleNextPage}>
          <div className="left">
            <div className="item">
              <label>Cause/NGO Name</label>
              <input
                required
                value={causeDetails.causeName}
                onChange={(e) => handleInputChange(e, "causeName")}
                type="text"
              />
            </div>
            <div className="item">
              <label>About Cause</label>
              <p>(Write a description about your Cause/NGO)</p>
              <textarea
                required
                className="causeDesc"
                value={causeDetails.aboutCause}
                onChange={(e) => handleInputChange(e, "aboutCause")}
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
                required
                checked={causeDetails.type === "individual"}
                onChange={(e) => handleInputChange(e, "type")}
              />
              <label htmlFor="organisation">Group / Organisation</label>
              <input
                id="organisation"
                type="radio"
                name="options"
                value="organisation"
                required
                checked={causeDetails.type === "organisation"}
                onChange={(e) => handleInputChange(e, "type")}
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
                required
                value={causeDetails.cat}
                onChange={(e) => handleInputChange(e, "cat")}
              >
                <option value="">Select category</option>
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
              </select>
            </div>
            <div className="item">
              <label>Location</label>
              <input
                type="text"
                required
                value={causeDetails.location}
                onChange={(e) => handleInputChange(e, "location")}
              />
            </div>
            <div className="item">
              <label>PIN Code</label>
              <input
                type="number"
                required
                value={causeDetails.pincode}
                onChange={(e) => handleInputChange(e, "pincode")}
              />
            </div>
            <div className="item">
              <label>Short Description</label>
              <p>(Write a description about your Cause/NGO)</p>
              <textarea
                required
                value={causeDetails.shortDesc}
                onChange={(e) => handleInputChange(e, "shortDesc")}
              ></textarea>
            </div>
          </div>
          <div className="right">
            {uploadProgress !== "" && (
              <p className="uploadProgress">{uploadProgress.slice(0, 12)}</p>
            )}
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
                accept="image/*"
                onChange={handleFileChangeLogo}
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
                required
                accept="image/*"
                type="file"
                id="file2"
                onChange={handleFileChangeBanner}
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
        <form className="formThird" onSubmit={handleCreateAccount}>
          <div className="left">
            <div className="item">
              <label>First Name</label>
              <input
                required
                type="text"
                value={causeDetails.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />
            </div>
            <div className="item">
              <label>Last Name</label>
              <input
                required
                type="text"
                value={causeDetails.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
            </div>
            <div className="item">
              <label>Mobile number</label>
              <input
                required
                type="number"
                value={causeDetails.mobileNumber}
                onChange={(e) => handleInputChange(e, "mobileNumber")}
              />
            </div>
          </div>
          <div className="right">
            <div className="item">
              <label>Email Address</label>
              <input
                required
                type="email"
                value={causeDetails.email}
                onChange={(e) => handleInputChange(e, "email")}
              />
            </div>
            <div className="item">
              <label>Password</label>
              <input
                required
                type="password"
                value={causeDetails.password}
                onChange={(e) => handleInputChange(e, "password")}
              />
            </div>
            <div className="item">
              <label>Confirm Password</label>
              <input
                required
                type="password"
                value={causeDetails.confirmPassword}
                onChange={(e) => handleInputChange(e, "confirmPassword")}
              />
            </div>
            <div className="btns">
              <button className="back" onClick={handleBackPage}>
                Back
              </button>
              <button
                className="next flex justify-center items-center gap-3"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Your Account"
                )}
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
        {success ? (
          <SuccessPage link="/" title="Cause/NGO" />
        ) : (
          pages[currentPage - 1].content
        )}
      </div>
    </div>
  );
};

export default CauseForm;
