import { Outlet, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "./../../components/DashboardHeader/DashboardHeader";
import Loader from "../../../Components/Loader/Loader";
import { db } from "../../../../firebase.js";
import {
  businessUserExist,
  businessUserNotExist,
} from "../../../redux/reducer/businessUserReducer.js";
import "./DashboardOutlet.scss";

function DashboardOutlet() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Fetch business details from Firestore
  const fetchBusinessDetails = async () => {
    try {
      const docRef = doc(db, "businessDetails", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        dispatch(businessUserExist(data));
      } else {
        console.error("No such document!");
        dispatch(businessUserNotExist());
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      dispatch(businessUserNotExist());
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when the `id` changes
  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  // Memoize userData to avoid unnecessary re-renders
  const memoizedUserData = useMemo(() => userData, [userData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboardOutlet">
      <Sidebar userData={memoizedUserData} />
      <div className="main-content">
        <DashboardHeader userData={memoizedUserData} />
        <Outlet /> {/* This renders the nested routes */}
      </div>
    </div>
  );
}

export default DashboardOutlet;
