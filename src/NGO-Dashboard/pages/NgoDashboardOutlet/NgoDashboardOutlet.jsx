import { Outlet, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "./../../components/DashboardHeader/DashboardHeader";
import "./NgoDashboardOutlet.scss";
import { db } from "../../../../firebase";
import {
  ngoUserExist,
  ngoUserNotExist,
} from "../../../redux/reducer/ngoUserReducer";
import Loader from "../../../Components/Loader/Loader";

function App() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Fetch NGO details from Firestore
  const fetchCauseDetails = async () => {
    try {
      const docRef = doc(db, "causeDetails", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);

        dispatch(ngoUserExist(data));
      } else {
        console.error("No such document!");
        dispatch(ngoUserNotExist());
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      dispatch(ngoUserNotExist());
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when the `id` changes
  useEffect(() => {
    fetchCauseDetails();
  }, [id]);

  // Memoize userData to avoid unnecessary re-renders
  const memoizedUserData = useMemo(() => userData, [userData]);
  console.log(memoizedUserData);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="dashboardOutlet">
      <Sidebar userData={memoizedUserData} className="fixed" />
      <div className="main-content overflow-y-auto h-screen">
        <DashboardHeader userData={memoizedUserData} />
        <Outlet /> {/* This renders the nested routes */}
      </div>
    </div>
  );
}

export default App;
