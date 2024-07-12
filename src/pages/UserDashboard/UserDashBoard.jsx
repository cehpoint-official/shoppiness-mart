import "./UserDashBoard.scss";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.js";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import UserDashboardNav from "../../Components/UserDashboardNav/UserDashboardNav.jsx";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoArrowRedoSharp } from "react-icons/io5";
import Widget from "../../Components/Widget/Widget.jsx";
import money from "../../assets/RegisterBusiness/money-vector.png";
import tag from "../../assets/RegisterBusiness/tag-vector.png";
import giveback from "../../assets/RegisterBusiness/giveback-vector.png";
import cashback from "../../assets/RegisterBusiness/cashback-vector.png";
import Loader from "../../Components/Loader/Loader.jsx";
import BannerImg from "../../assets/RegisterBusiness/bannerImg.png";
import feature from "../../assets/RegisterBusiness/feature.png";
import gift from "../../assets/RegisterBusiness/gift.png";
import cashbackImg from "../../assets/RegisterBusiness/cashback.png";
import storeImg from "../../assets/RegisterBusiness/storeImg.png";
import coupon from "../../assets/RegisterBusiness/coupon.png";

const UserDashBoard = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const fetchDoc = async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
      console.log(docSnap.data());
      setLoading(false);
      console.log(docSnap.data());
    } else {
      alert("No such document!");
    }
  };

  useEffect(() => {
    fetchDoc();
  }, []);

  return (
    <div className="userDashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="userDashboard">
            <UserDashboardNav profilePic={userData.profilePic} />
            <div className="userDashboardContainer">
              <div className="mainDashboard">
                <div className="topSec">
                  <div className="left">
                    <div className="profile">
                      <img
                        src={
                          userData.profilePic ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
                        }
                        alt="err"
                      />
                    </div>
                    <div className="info">
                      <div className="name">
                        <h3>{userData.fname}</h3>
                        <h3>{userData.lname || ""}</h3>
                      </div>
                      <div className="email">
                        <MdOutlineMailOutline />
                        <p>{userData.email}</p>
                      </div>
                      <div className="phone">
                        <FaPhoneAlt />
                        <p>{userData.phone || "Not Added!"}</p>
                      </div>
                      <button>Edit Profile</button>
                    </div>
                  </div>
                  <div className="right">
                    <h2>Let's start Shopping!</h2>
                    <div className="links">
                      <Link to="/online-shop">
                        <div className="link">
                          Online Shop
                          <IoArrowRedoSharp />
                        </div>
                      </Link>

                      <Link to="/offline-shop">
                        <div className="link">
                          Offline Shop
                          <IoArrowRedoSharp />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="widgets">
                <Widget
                  title="Collected Cash backs"
                  heading="RS 2500"
                  icon={money}
                />
                <Widget title="Collected Coupon " heading="04" icon={tag} />
                <Widget title="Give Back" heading="500" icon={giveback} />
                <Widget
                  title="Cash back requests"
                  heading="02"
                  icon={cashback}
                />
              </div>
              <div className="welcomeSec">
                <h2>
                  Hello <span>{userData.fname}</span> , Welcome to your
                  Dashboard
                </h2>
                <p>
                  Thanks for signing up and choosing to support our mission. We
                  would like to help you get started and generating donations
                  from your everyday shopping.
                </p>
                <p>Get great offers & Cashback.</p>
                <button>Show Me how get cashback to give back</button>
              </div>
            </div>
            <div className="banner">
              <div className="item">
                <img src={BannerImg} alt="" />
              </div>
              <div className="item">
                <img src={BannerImg} alt="" />
              </div>
              <div className="item">
                <img src={BannerImg} alt="" />
              </div>
              <div className="item">
                <img src={BannerImg} alt="" />
              </div>
              <div className="item">
                <img src={BannerImg} alt="" />
              </div>
              <div className="item">
                <img src={BannerImg} alt="" />
              </div>
              <div className="item">
                <img src={BannerImg} alt="" />
              </div>
              <div className="item">
                <img src={BannerImg} alt="" />
              </div>
            </div>
            <div className="userDashboardContainer">
              <div className="featuresSec">
                <h2>
                  How do you get happiness with <span>Shoppiness Mart</span>
                </h2>
                <div className="featuresSecLowerSection">
                  <div className="featuresSecItem">
                    <img src={feature} alt="err" />
                    <p>Visit favorite stores listed in Shopping Mart</p>
                  </div>
                  <div className="featuresSecItem">
                    <img src={coupon} alt="err" />
                    <p>Generate a coupon</p>
                  </div>
                  <div className="featuresSecItem">
                    <img src={storeImg} alt="err" />
                    <p>Visit offline shop</p>
                  </div>
                  <div className="featuresSecItem">
                    <img src={gift} alt="err" />
                    <p>Readme your coupon</p>
                  </div>
                  <div className="featuresSecItem">
                    <img src={cashbackImg} alt="err" />
                    <p>
                      Get cashback, you can also give back to support an NGO or
                      cause
                    </p>
                  </div>
                </div>
              </div>
              <div className="popularOfflineShops">
                {/* start here */}
                hu
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashBoard;
