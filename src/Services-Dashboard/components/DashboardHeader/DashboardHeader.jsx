import React, { useEffect, useState } from "react";
import "./DashboardHeader.scss";
import { CiSearch } from "react-icons/ci";
import { IoIosNotifications } from "react-icons/io";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import  { db } from "../../../../firebase";
const DashboardHeader = () => {
  const { id } = useParams();
  const [shopdetail, setShopDetail] = useState({});

  useEffect(() => {
    async function getShopInfo(id) {
      if (!id) return;
      try {
        const shopDocRef = doc(db, "businessDetails", id);
        const shopDocSnap = await getDoc(shopDocRef);
        if (shopDocSnap.exists()) {
          setShopDetail(shopDocSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    }
    getShopInfo(id);
  }, [id]);

  console.log(shopdetail);
  

  return (
    <div className="dashboard-header">
      <div className="title">
        <h1>{shopdetail.owner}👋</h1>
      </div>
      <div className="profile-sec">
        <div className="search-bar">
          <CiSearch />
          <input type="text" placeholder="Search  Here" />
        </div>
        <div className="notifications">
          <IoIosNotifications />
        </div>
        <div className="profile">
          <img
            src={shopdetail.logoUrl}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
