import "./UserDashBoard.scss";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UserDashBoard = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const fetchDoc = async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
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
        "Loading..."
      ) : (
        <>
          <img
            src={
              userData.profilePic ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAd5avdba8EiOZH8lmV3XshrXx7dKRZvhx-A&s"
            }
            alt=""
          />
          <h1>{`Name: ${userData.fname}`}</h1>
          <h1>{`Email: ${userData.email}`} </h1>
          <h1>{`Phone: ${userData.phone || "Not Added"}`} </h1>
        </>
      )}
    </div>
  );
};

export default UserDashBoard;
