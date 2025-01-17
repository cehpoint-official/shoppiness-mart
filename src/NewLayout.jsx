import Footer from "./Components/Footer";
import { Outlet, useParams } from "react-router-dom";
import UserDashboardNav from "./Components/UserDashboardNav/UserDashboardNav";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Loader from "./Components/Loader/Loader";

const NewLayout = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const fetchDoc = async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
      setLoading(false);
    } else {
      alert("No such document!");
    }
  };

  useEffect(() => {
    fetchDoc();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <div className="new-layout">
      <UserDashboardNav userId={userId} profilePic={userData.profilePic} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default NewLayout;
