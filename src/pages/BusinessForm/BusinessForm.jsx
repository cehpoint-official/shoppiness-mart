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
import { FaTimes } from "react-icons/fa";
import axios from "axios";

// Dialog Components
const TermsDialog = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-header">
          <h2>Terms and Conditions</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="dialog-content">
          <h3>ShoppinessMart Business Registration Agreement</h3>
          <p>Last Updated: April 4, 2025</p>
          
          <h4>1. INTRODUCTION</h4>
          <p>This Business Registration Agreement ("Agreement") constitutes a legally binding contract between you, the Business Owner ("Seller," "you," or "your") and ShoppinessMart ("Company," "we," "us," or "our") governing your participation on our platform.</p>
          
          <h4>2. ELIGIBILITY</h4>
          <p>By registering your business on our platform, you represent and warrant that:</p>
          <ul>
            <li>You are at least 18 years of age</li>
            <li>You have the legal authority to bind the business to this Agreement</li>
            <li>Your business complies with all applicable laws and regulations</li>
            <li>All information provided during registration is accurate and complete</li>
          </ul>
          
          <h4>3. REGISTRATION APPROVAL</h4>
          <p>All business registrations are subject to approval by ShoppinessMart. We reserve the right to reject any registration at our sole discretion.</p>
          
          <h4>4. COMMISSION STRUCTURE</h4>
          <p>In exchange for access to our platform and customer base, you agree to pay a commission on all sales generated through ShoppinessMart. Standard commission rates range from 5% to 15% depending on product/service category.</p>
          
          <h4>5. PAYMENT TERMS</h4>
          <p>You agree to remit all commission payments within 3-5 business days after the customer's purchase and bill generation. Failure to make timely payments may result in suspension or termination of your account.</p>
          
          <h4>6. PLATFORM RULES</h4>
          <p>You agree to:</p>
          <ul>
            <li>Maintain accurate inventory and pricing information</li>
            <li>Respond to customer inquiries within 24 hours</li>
            <li>Process and fulfill orders promptly</li>
            <li>Comply with our return and refund policies</li>
            <li>Maintain a customer satisfaction rating of at least 4.0 stars</li>
          </ul>
          
          <h4>7. INTELLECTUAL PROPERTY</h4>
          <p>You grant ShoppinessMart a non-exclusive license to use your business name, logo, and product information for marketing purposes. You retain all ownership rights to your intellectual property.</p>
          
          <h4>8. TERM AND TERMINATION</h4>
          <p>This Agreement remains in effect until terminated. Either party may terminate this Agreement with 30 days' written notice. ShoppinessMart may terminate immediately if you breach any provision of this Agreement.</p>
          
          <h4>9. LIMITATION OF LIABILITY</h4>
          <p>ShoppinessMart's liability is limited to direct damages not exceeding the total commissions paid in the three months preceding the claim.</p>
          
          <h4>10. MODIFICATIONS</h4>
          <p>ShoppinessMart reserves the right to modify this Agreement at any time. Continued use of the platform constitutes acceptance of any modifications.</p>
        </div>
        <div className="dialog-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="agree-btn" onClick={onAgree}>I Agree</button>
        </div>
      </div>
    </div>
  );
};

const PreferredPartnerDialog = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-header">
          <h2>Preferred Partner Agreement</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="dialog-content">
          <h3>ShoppinessMart Preferred Partner Program</h3>
          <p>Last Updated: April 4, 2025</p>
          
          <h4>1. PREFERRED PARTNER STATUS</h4>
          <p>This Preferred Partner Agreement ("Agreement") enhances the standard Business Registration Agreement between you ("Preferred Partner") and ShoppinessMart ("Company").</p>
          
          <h4>2. ENHANCED BENEFITS</h4>
          <p>As a Preferred Partner, you will receive:</p>
          <ul>
            <li>Priority placement in search results and category listings</li>
            <li>Featured status in promotional campaigns</li>
            <li>"Preferred Partner" badge on your business profile</li>
            <li>Access to premium analytics dashboard</li>
            <li>Dedicated account manager</li>
            <li>Early access to new platform features</li>
            <li>Invitation to exclusive networking events</li>
          </ul>
          
          <h4>3. ADDITIONAL OBLIGATIONS</h4>
          <p>In exchange for these benefits, you agree to:</p>
          <ul>
            <li>Maintain an average customer rating of at least 4.5 stars</li>
            <li>Process and fulfill all orders within 24 hours</li>
            <li>Respond to customer inquiries within 12 hours</li>
            <li>Maintain a minimum monthly sales volume (category-dependent)</li>
            <li>Participate in at least four promotional events annually</li>
            <li>Provide exclusive offers to ShoppinessMart customers at least quarterly</li>
          </ul>
          
          <h4>4. COMMISSION STRUCTURE</h4>
          <p>Preferred Partners are subject to a premium commission structure, typically 2-5% higher than standard rates, reflecting the enhanced visibility and promotional benefits provided.</p>
          
          <h4>5. PAYMENT TERMS</h4>
          <p>You agree to remit all commission payments within 3 business days after the customer's purchase and bill generation. Expedited payment is required to maintain the cash flow necessary to support premium promotional activities.</p>
          
          <h4>6. PERFORMANCE REVIEWS</h4>
          <p>Your Preferred Partner status will be reviewed quarterly. Failure to meet the obligations outlined in this Agreement may result in reclassification to standard partner status.</p>
          
          <h4>7. TERM AND TERMINATION</h4>
          <p>Either party may terminate this Preferred Partner Agreement with 14 days' written notice, reverting to the standard Business Registration Agreement. ShoppinessMart may terminate immediately if you breach any provision of this Agreement.</p>
          
          <h4>8. EXCLUSIVITY</h4>
          <p>While not requiring absolute exclusivity, Preferred Partners agree to provide ShoppinessMart customers with pricing and offers at least as favorable as those offered on other platforms.</p>
        </div>
        <div className="dialog-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="agree-btn" onClick={onAgree}>I Agree</button>
        </div>
      </div>
    </div>
  );
};

const BusinessForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [preferredPartner, setPreferredPartner] = useState(null);
  const [showPreferredPartnerDialog, setShowPreferredPartnerDialog] = useState(false);
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
    
    // Agreement statuses
    termsAgreed: false,
    isPreferredPartner: false,
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

  const handleCheckboxChange = (e, field) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleViewTerms = (e) => {
    e.preventDefault();
    setShowTermsDialog(true);
  };

  const handleAgreeTerms = () => {
    setTermsAgreed(true);
    setFormData(prev => ({
      ...prev,
      termsAgreed: true
    }));
    setShowTermsDialog(false);
  };

  const handleCloseTerms = () => {
    setShowTermsDialog(false);
  };

  const handlePreferredPartnerChange = (e) => {
    const isPreferred = e.target.value === "yes";
    setPreferredPartner(e.target.value);
    
    if (isPreferred) {
      setShowPreferredPartnerDialog(true);
    } else {
      setFormData(prev => ({
        ...prev,
        isPreferredPartner: false
      }));
    }
  };

  const handleAgreePreferredPartner = () => {
    setFormData(prev => ({
      ...prev,
      isPreferredPartner: true
    }));
    setShowPreferredPartnerDialog(false);
  };

  const handleClosePreferredPartner = () => {
    setPreferredPartner("no");
    setShowPreferredPartnerDialog(false);
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
          formData.confirmPassword &&
          termsAgreed &&
          preferredPartner !== null && 
          (preferredPartner === "no" || (preferredPartner === "yes" && formData.isPreferredPartner))
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
    } else {
      if (!termsAgreed) {
        toast.error("You must agree to the Terms and Conditions to proceed.");
      } else if (currentPage === 3 && preferredPartner === null) {
        toast.error("Please select whether you want to be a Preferred Partner.");
      } else {
        toast.error("Please fill all required fields.");
      }
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
          setIsLoading(false);
          return;
        }

        await addData(); // Add data to Firebase
        // Add notification to adminNotifications collection
        await addDoc(collection(db, "adminNotifications"), {
          message: `New Business/Services registration request from ${formData.firstName} ${formData.lastName} for "${formData.businessName}".${formData.isPreferredPartner ? ' Requested Preferred Partner status.' : ''}`,
          createdAt: new Date().toISOString(),
          read: false,
        });
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
              ${formData.isPreferredPartner ? '<p><strong>We have also noted your interest in our Preferred Partner Program.</strong></p>' : ''}
              
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
    } else {
      if (!termsAgreed) {
        toast.error("You must agree to the Terms and Conditions to proceed.");
      } else if (preferredPartner === null) {
        toast.error("Please select whether you want to be a Preferred Partner.");
      } else if (preferredPartner === "yes" && !formData.isPreferredPartner) {
        toast.error("You must agree to the Preferred Partner terms to proceed as a Preferred Partner.");
      } else {
        toast.error("Please fill all required fields.");
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
        totalPlatformEarningsDue: 0,
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
  
  // Terms and conditions checkbox component
  const TermsCheckbox = () => (
    <div className="terms-checkbox">
      <input
        type="checkbox"
        id="terms"
        checked={termsAgreed}
        onChange={(e) => setTermsAgreed(e.target.checked)}
      />
      <label htmlFor="terms">
        I agree to the <button onClick={handleViewTerms} className="terms-link">Terms and Conditions</button>
      </label>
    </div>
  );

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
                <p>Drag & Drop</p>
                <span>or</span>
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
                <p>Drag & Drop</p>
                <span>or</span>
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
            <div className="item">
              <label>Do you want to join as a Most Preferred Partner?</label>
              <div className="preferred-options">
                <div className="preferred-option">
                  <input
                    type="radio"
                    id="preferred-yes"
                    name="preferred"
                    value="yes"
                    checked={preferredPartner === "yes"}
                    onChange={handlePreferredPartnerChange}
                  />
                  <label htmlFor="preferred-yes">Yes</label>
                </div>
                <div className="preferred-option">
                  <input
                    type="radio"
                    id="preferred-no"
                    name="preferred"
                    value="no"
                    checked={preferredPartner === "no"}
                    onChange={handlePreferredPartnerChange}
                  />
                  <label htmlFor="preferred-no">No</label>
                </div>
              </div>
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
            <TermsCheckbox />
            <div className="btns">
              <button type="button" className="back" onClick={handleBackPage}>
                Back
              </button>
              <button
                className="next flex justify-center items-center gap-3"
                type="submit"
                disabled={isLoading || !termsAgreed || preferredPartner === null || (preferredPartner === "yes" && !formData.isPreferredPartner)}
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

      {/* Terms and Conditions Dialog */}
      <TermsDialog 
        isOpen={showTermsDialog} 
        onClose={handleCloseTerms} 
        onAgree={handleAgreeTerms} 
      />

      {/* Preferred Partner Dialog */}
      <PreferredPartnerDialog 
        isOpen={showPreferredPartnerDialog} 
        onClose={handleClosePreferredPartner} 
        onAgree={handleAgreePreferredPartner} 
      />
    </div>
  );
};

export default BusinessForm;