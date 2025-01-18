import "./UserDashBoard.scss";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase.js";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import UserDashboardNav from "../../Components/UserDashboardNav/UserDashboardNav.jsx";
import Footer from "../../Components/Footer.jsx";
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
import { MdOutlineArrowForwardIos } from "react-icons/md";
import signup from "../../assets/RegisterBusiness/signup.png";
import money2 from "../../assets/RegisterBusiness/money.png";
import bag from "../../assets/RegisterBusiness/bag.jpg";
import video from "../../assets/RegisterBusiness/vid.png";
import { RiSearchFill } from "react-icons/ri";
import EditProfileDialog from "./EditProfileDialog.jsx";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer.js";

const UserDashBoard = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { userId } = useParams();
  const handleSave = async (updatedData) => {
    try {
      // Update the Firestore document with the new data
      await setDoc(doc(db, "users", userData.uid), updatedData, {
        merge: true,
      });

      // Dispatch the updated user data to Redux
      dispatch(userExist(updatedData));

      // Update local state
      setUserData(updatedData);

      console.log("User data updated successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  const fetchDoc = async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData(data);
      dispatch(userExist(data));
      setLoading(false);
      // console.log(data);
    } else {
      alert("No such document!");
      dispatch(userNotExist());
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
            <UserDashboardNav
              profilePic={userData.profilePic}
              userId={userId}
            />
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
                        alt="user profile"
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
                      <button
                        onClick={() => setIsDialogOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Edit Profile
                      </button>
                      {isDialogOpen && (
                        <EditProfileDialog
                          userData={userData}
                          onClose={() => setIsDialogOpen(false)}
                          onSave={handleSave}
                        />
                      )}
                    </div>
                  </div>
                  <div className="right">
                    <h2>Let&apos;s start Shopping!</h2>
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
                <h2>
                  Popular <span>Offline</span> Shops close to you
                </h2>
                <div className="shopsContainer">
                  <div className="offlineShop">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1717529137998-14eb452fe28e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="err"
                    />
                    <h1>Food</h1>
                    <p>Food Show best food offers</p>
                    <div className="cashback">10% cashback</div>
                  </div>

                  <div className="offlineShop">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1717529137998-14eb452fe28e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="err"
                    />
                    <h1>Food</h1>
                    <p>Food Show best food offers</p>
                    <div className="cashback">10% cashback</div>
                  </div>

                  <div className="offlineShop">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1717529137998-14eb452fe28e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="err"
                    />
                    <h1>Food</h1>
                    <p>Food Show best food offers</p>
                    <div className="cashback">10% cashback</div>
                  </div>

                  <div className="offlineShop">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1717529137998-14eb452fe28e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="err"
                    />
                    <h1>Food</h1>
                    <p>Food Show best food offers</p>
                    <div className="cashback">10% cashback</div>
                  </div>

                  <div className="viewMoreBtn">
                    <div className="text">
                      <span>View</span>
                      <span>More</span>
                    </div>
                    <div className="moreIcon">
                      <MdOutlineArrowForwardIos />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="moneyRaisingSec">
              <h1>Start raising from Online Stores</h1>
              <div className="container">
                <div className="left">
                  <img src={video} alt="loading" />
                </div>
                <div className="right">
                  <div className="points">
                    <div className="point">
                      <div className="img">
                        <img src={signup} alt="loading" />
                      </div>
                      <p>
                        <span>Sign up: </span>Lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Blanditiis,commodi tempora
                        mollitia voluptatem recusandae impedit
                      </p>
                    </div>
                    <div className="point">
                      <div className="img">
                        <RiSearchFill fontSize={"40px"} />
                      </div>
                      <p>
                        <span>Browse: </span>Lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Blanditiis,commodi tempora
                        mollitia voluptatem recusandae impedit
                      </p>
                    </div>
                    <div className="point">
                      <div className="img">
                        <img src={bag} alt="loading" />
                      </div>
                      <p>
                        <span>Shop: </span>Lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Blanditiis,commodi tempora
                        mollitia voluptatem recusandae impedit
                      </p>
                    </div>

                    <div className="point">
                      <div className="img">
                        <img src={money2} alt="loading" />
                      </div>
                      <p>
                        <span>Raise: </span>Lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Blanditiis,commodi tempora
                        mollitia voluptatem recusandae impedit
                      </p>
                    </div>

                    <Link className="signup" to="/login">
                      SIGN UP FOR FREE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashBoard;
