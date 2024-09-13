import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./PopularCauses.scss";

const PopularCauses = () => {
  const [causes, setCauses] = useState(null);
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const docRef = doc(db, "Causes", "OxT3LtS6aO3GhZ2NbEeo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCauses(docSnap.data().causesList);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    };

    fetchCauses();
  }, []);

  return (
    <div className="causes">
      <div className="upperSec">
        <h1>Our Popular Causes</h1>
        <p>Addressing these challenges requires a multifaceted approach</p>
      </div>
      <div className="lowerSec">
        {causes?.map((item, index) => (
          <div className="lowerCard" key={index}>
            <img src={item.img} alt="card" />
            <h4>{item.title}</h4>
            <span>{item.category}</span>
            <h6>{item.support}</h6>
            <p>{item?.description}</p>
          </div>
        ))}
      </div>
      <p className="seeAll underline flex gap-2 items-center justify-center">
        <div>
          See all <span>5,000 +</span> Causes
        </div>
        <div>
          <i className="bi bi-arrow-right"></i>{" "}
        </div>
      </p>
    </div>
  );
};

export default PopularCauses;
