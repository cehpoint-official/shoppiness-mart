import { useEffect, useState } from "react";
import "./UserProfile.scss";
import { IoCopyOutline } from "react-icons/io5";
import CashbackGiveback from "./../Cashback&GiveBack/CashbackGiveback";
import { useParams } from "react-router-dom";
import Loader from "@/Components/Loader/Loader";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

function formatTimestamp(seconds) {
  const timestamp = seconds * 1000;
  const date = new Date(timestamp);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
  return formattedDate;
}

const UserProfile = () => {
  const { userId } = useParams();
  const [currentPage, setCurrentPage] = useState("coupons");
  const [userDetail, setUserDetail] = useState(null);
  const [couponList, setCouponList] = useState([]);

  useEffect(() => {
    async function getUserData(userId) {
      if (!userId) return;
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetail(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    }
    getUserData(userId);
  }, [userId]);

  useEffect(() => {
    async function getCouponList(userId) {
      if (!userId) return;
      try {
        const collectionRef = collection(db, "coupons");
        const q = query(collectionRef, where("user", "==", userId));
        const querySnapshot = await getDocs(q);
        const result = [];
        querySnapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() });
        });
        setCouponList(result);
      } catch (error) {
        console.log("Error getting Coupons:", error);
      }
    }
    getCouponList(userId);
  }, [userId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!userDetail) return <Loader />;

  return (
    <div className="userProfile">
      <div className="left">
        <div className="top">
          <div className="profile">
            {userDetail?.profilePic && (
              <img src={userDetail.profilePic} alt="Profile" />
            )}
          </div>
          <div className="details">
            <p>Hello,</p>
            <p>{userDetail.fname}</p>
          </div>
        </div>
        <div className="bottom">
          <div className="item" onClick={() => handlePageChange("coupons")}>
            My Coupons
          </div>
          <div className="item" onClick={() => handlePageChange("cashback")}>
            Cashback & Giveback
          </div>
          <div className="item" onClick={() => handlePageChange("settings")}>
            Account Settings
          </div>
        </div>
      </div>

      <div className="right">
        {currentPage === "coupons" && (
          <div className="availableCoupons">
            <h1>Available Coupons</h1>
            {couponList.map((item, index) => {
              console.log(item);
              return (
                <div className="coupon" key={index}>
                  <div className="top">
                    <p className="title">{item.shopName}</p>
                    <p>{formatTimestamp(item.createdAt.seconds)}</p>
                  </div>
                  <div className="bottom">
                    <p className="desc">
                      Enjoy {item.inStoreDiscount}% Off In-Store Purchases +{" "}
                      {item.platformDiscount}% <br /> Cashback at Shoppiness
                      Mart!
                    </p>
                    <div className="flex items-center gap-2 text-blue-700 text-xl font-medium">
                      Coupon code - {item.code}
                      <IoCopyOutline className="cursor-pointer" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentPage === "cashback" && <CashbackGiveback />}

        {currentPage === "settings" && (
          <div className="settings">
            <h1>Account Settings</h1>
            <p>Your account settings details go here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
