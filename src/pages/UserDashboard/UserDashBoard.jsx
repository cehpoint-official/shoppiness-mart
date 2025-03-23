import "./UserDashBoard.scss";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../firebase.js";
import { useState, useEffect, useCallback } from "react";
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
import UserTransactions from "./UserTransactions.jsx";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer.js";

const UserDashBoard = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userId } = useParams();
  const [cashbackCollected, setCashbackCollected] = useState([]);
  const [cashbackRequest, setCashbackRequest] = useState([]);
  const [isFetchingCoupons, setIsFetchingCoupons] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // Adding state for tab navigation

  // Skeleton Components
  const SkeletonWidget = () => (
    <div className="bg-white h-full w-full rounded-lg p-4 shadow-md animate-pulse mb-3">
      <div className="h-12 w-12 bg-gray-200 rounded-full mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  const ProfileSkeleton = () => (
    <div className="flex gap-4 animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );

  const fetchCouponData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const collected = [];
      const request = [];

      querySnapshot.forEach((doc) => {
        const couponsData = doc.data();
        if (couponsData.userId === userId && couponsData.status === "Pending") {
          request.push({ id: doc.id, ...couponsData });
        }
        if (couponsData.userId === userId && couponsData.status === "Claimed") {
          collected.push({ id: doc.id, ...couponsData });
        }
      });

      setCashbackCollected(collected);
      setCashbackRequest(request);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setIsFetchingCoupons(false);
    }
  }, [userId]);

  const handleSave = async (updatedData) => {
    try {
      await setDoc(doc(db, "users", userData.uid), updatedData, {
        merge: true,
      });
      console.log(updatedData);
      
      dispatch(userExist(updatedData));
       setUserData(updatedData);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          dispatch(userExist(data));
        } else {
          alert("No such document!");
          dispatch(userNotExist());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [userId, dispatch]);

  useEffect(() => {
    fetchCouponData();
  }, [fetchCouponData]);

  // Tab navigation handler
  const renderTabContent = () => {
    switch (activeTab) {
      case "transactions":
        return <UserTransactions userId={userId} />;
      case "dashboard":
      default:
        return renderDashboardContent();
    }
  };

  // Main dashboard content
  const renderDashboardContent = () => (
    <>
      <div className="widgets">
        {loading ? (
          <>
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
          </>
        ) : (
          <>
            <Widget
              title="Collected Cash backs"
              heading={userData.collectedCashback || "0"}
              icon={money}
            />
            <Widget
              title="Collected Coupon"
              heading={
                isFetchingCoupons ? "0" : cashbackCollected.length.toString()
              }
              icon={tag}
            />
            <Widget
              title="Give Back"
              heading={userData.givebackAmount || "0"}
              icon={giveback}
            />
            <Widget
              title="Cash back requests"
              heading={
                isFetchingCoupons ? "0" : cashbackRequest.length.toString()
              }
              icon={cashback}
            />
          </>
        )}
      </div>

      <div className="welcomeSec">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-10 bg-gray-200 rounded w-48"></div>
          </div>
        ) : (
          <>
            <h2>
              Hello <span>{userData.fname}</span>, Welcome to your Dashboard
            </h2>
            <p>
              Thanks for signing up and choosing to support our mission. We
              would like to help you get started and generating donations from
              your everyday shopping.
            </p>
            <p>Get great offers & Cashback.</p>
            <Link to={`/user-dashboard/${userId}/howitworks`}>
              <button>Show Me how get cashback to give back</button>
            </Link>
          </>
        )}
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
                Get cashback, you can also give back to support an NGO or cause
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
            <img
              src={video}
              alt="loading"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="right">
            <div className="points">
              <div className="point">
                <div className="img">
                  <img src={signup} alt="loading" />
                </div>
                <p>
                  <span>Sign up: </span>Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Blanditiis,commodi tempora mollitia
                  voluptatem recusandae impedit
                </p>
              </div>
              <div className="point">
                <div className="img">
                  <RiSearchFill fontSize={"40px"} />
                </div>
                <p>
                  <span>Browse: </span>Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Blanditiis,commodi tempora mollitia
                  voluptatem recusandae impedit
                </p>
              </div>
              <div className="point">
                <div className="img">
                  <img src={bag} alt="loading" />
                </div>
                <p>
                  <span>Shop: </span>Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Blanditiis,commodi tempora mollitia
                  voluptatem recusandae impedit
                </p>
              </div>
              <div className="point">
                <div className="img">
                  <img src={money2} alt="loading" />
                </div>
                <p>
                  <span>Raise: </span>Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Blanditiis,commodi tempora mollitia
                  voluptatem recusandae impedit
                </p>
              </div>

              {!userId && (
                <Link className="signup" to="/login">
                  SIGN UP FOR FREE
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="userDashboard">
      <UserDashboardNav profilePic={userData.profilePic} userId={userId} />
      <div className="userDashboardContainer">
        <div className="mainDashboard">
          <div className="topSec">
            <div className="left">
              {loading ? (
                <ProfileSkeleton />
              ) : (
                <>
                  <div className="profile">
                    <img
                      src={
                        userData.profilePic ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
                      }
                      alt="user profile"
                      className="rounded-full w-24 h-24 object-cover"
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
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="right">
              <h2>Let&apos;s start Shopping!</h2>
              <div className="links">
                <Link to={`/user-dashboard/${userId}/online-shop`}>
                  <div className="link">
                    Online Shop
                    <IoArrowRedoSharp />
                  </div>
                </Link>
                <Link to={`/user-dashboard/${userId}/offline-shop`}>
                  <div className="link">
                    Offline Shop
                    <IoArrowRedoSharp />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* New navigation tabs */}
          <div className="dashboard-tabs mt-6 mb-4 border-b">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-2 px-4 font-medium transition-colors duration-200 ${
                  activeTab === "dashboard" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`py-2 px-4 font-medium transition-colors duration-200 ${
                  activeTab === "transactions" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                Transactions
              </button>
            </div>
          </div>
        </div>

        {/* Content based on selected tab */}
        {renderTabContent()}
      </div>

      {isDialogOpen && (
        <EditProfileDialog
          userData={userData}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
        />
      )}

      <Footer />
    </div>
  );
};

export default UserDashBoard;