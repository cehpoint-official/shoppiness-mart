import { useState } from "react";
import "./BusinessForm.scss";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/RegisterBusiness/logo.png";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, storage } from "../../../firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SuccessPage from "../../Components/SuccessPage/SuccessPage";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
const BusinessForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  const [formData, setFormData] = useState({
    // Business Details (Page 1)
    businessName: "",
    owner: "",
    mode: "",
    contact: "",
    businessEmail: "",

    // Shop Details (Page 2)
    cat: "",
    location: "",
    pincode: "",
    shortDesc: "",

    // Account Details (Page 3)
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          formData.businessName &&
          formData.owner &&
          formData.mode &&
          formData.contact &&
          formData.businessEmail
        );
      case 2:
        return (
          formData.cat &&
          formData.location &&
          formData.pincode &&
          formData.shortDesc
        );
      case 3:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.mobileNumber &&
          formData.email &&
          formData.password &&
          formData.confirmPassword
        );
      default:
        return true;
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    if (validateCurrentPage()) {
      setCompletedSteps((prev) => {
        const updatedSteps = [...prev];
        updatedSteps[currentPage - 1] = true;
        return updatedSteps;
      });
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleBackPage = (e) => {
    e.preventDefault();
    setCurrentPage((prev) => prev - 1);
  };

  const checkEmailExists = async (email) => {
    const businessRef = collection(db, "businessDetails");
    const q = query(businessRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (validateCurrentPage()) {
      setIsLoading(true);
      try {
        // Check if email already exists
        const emailExists = await checkEmailExists(formData.email);

        if (emailExists) {
          toast.error(
            "This email is already registered. Please use a different email address."
          );
          // Keep the user on the same page
          setIsLoading(false);
          return;
        }

        await addData(); // Add data to Firebase
        // Send confirmation email
        try {
          await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
            email: formData.email,
            title:
              "ShoppinessMart - Business/Services Registration Confirmation",
            body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">Thank you for registering with ShoppinessMart!</h2>
              
              <p>Dear ${formData.firstName} ${formData.lastName},</p>
              
              <p>We have received your Business/Services registration request for "${formData.businessName}". Our team will review your application and get back to you soon.</p>
              
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
        toast.success("Business registered successfully!");
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
      return; // Stop if the file format is invalid
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

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const metadata = {
        contentType: file.type,
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

  const addData = async () => {
    try {
      const logoUrl = logoFile ? await uploadFile(logoFile) : "";
      const bannerUrl = bannerFile ? await uploadFile(bannerFile) : "";

      await addDoc(collection(db, "businessDetails"), {
        ...formData,
        logoUrl,
        bannerUrl,
        status: "Pending",
        rate: "0",
        totalPlatformEarnings: 0,
        totalPlatformEarningsPaid: 0,
        totalPlatformEarningsDue :0,
        createdDate: formatDate(new Date()),
      });
    } catch (e) {
      throw new Error(e.message);
    }
  };
  function formatDate(date) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }
  const pages = [
    {
      title: "Business Details",
      content: (
        <form className="formFirst" onSubmit={handleNextPage}>
          <div className="left">
            <div className="item">
              <label>Business/Services Name</label>
              <input
                required
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange(e, "businessName")}
              />
            </div>
            <div className="item">
              <label>Business/Services Owner Name</label>
              <input
                required
                type="text"
                value={formData.owner}
                onChange={(e) => handleInputChange(e, "owner")}
              />
            </div>
            <h3>Business/Services Type</h3>
            <div className="options">
              <label htmlFor="Online">Online</label>
              <input
                id="online"
                name="options"
                type="radio"
                value="Online"
                required
                checked={formData.mode === "Online"}
                onChange={(e) => handleInputChange(e, "mode")}
              />
              <label htmlFor="Offline">Offline</label>
              <input
                id="offline"
                type="radio"
                name="options"
                value="Offline"
                required
                checked={formData.mode === "Offline"}
                onChange={(e) => handleInputChange(e, "mode")}
              />
            </div>
          </div>
          <div className="right">
            <div className="item">
              <label>Contact number</label>
              <p>(The number of the business man or service provider office)</p>
              <input
                required
                type="tel"
                value={formData.contact}
                onChange={(e) => handleInputChange(e, "contact")}
              />
            </div>
            <div className="item">
              <label>Email Id</label>
              <p>(The email of the business or service provider)</p>
              <input
                required
                type="email"
                value={formData.businessEmail}
                onChange={(e) => handleInputChange(e, "businessEmail")}
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
                value={formData.cat}
                onChange={(e) => handleInputChange(e, "cat")}
              >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Grocery">Grocery</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Beauty">Beauty</option>
                <option value="Sport">Sport</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
            <div className="item">
              <label>Location</label>
              <input
                required
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange(e, "location")}
              />
            </div>
            <div className="item">
              <label>PIN Code</label>
              <input
                required
                type="number"
                value={formData.pincode}
                onChange={(e) => handleInputChange(e, "pincode")}
              />
            </div>
            <div className="item">
              <label>Short Description</label>
              <p>(Write a description about your business or service)</p>
              <textarea
                required
                value={formData.shortDesc}
                onChange={(e) => handleInputChange(e, "shortDesc")}
              ></textarea>
            </div>
          </div>
          <div className="right">
            {uploadProgress !== "" && (
              <p className="uploadProgress">{uploadProgress.slice(0, 12)}</p>
            )}
            <div className="item">
              <h3>Add Logo</h3>
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
                type="file"
                id="file2"
                accept="image/*"
                onChange={handleFileChangeBanner}
              />
            </div>
            <div className="btns">
              <button type="button" className="back" onClick={handleBackPage}>
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
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />
            </div>
            <div className="item">
              <label>Last Name</label>
              <input
                required
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
            </div>
            <div className="item">
              <label>Mobile number</label>
              <input
                required
                type="tel"
                value={formData.mobileNumber}
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
                value={formData.email}
                onChange={(e) => handleInputChange(e, "email")}
              />
            </div>
            <div className="item">
              <label>Password</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange(e, "password")}
              />
            </div>
            <div className="item">
              <label>Confirm Password</label>
              <input
                required
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange(e, "confirmPassword")}
              />
            </div>
            <div className="btns">
              <button type="button" className="back" onClick={handleBackPage}>
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
        {success ? (
          <SuccessPage link="/" title="Business/Services" />
        ) : (
          pages[currentPage - 1].content
        )}
      </div>
    </div>
  );
};

export default BusinessForm;
