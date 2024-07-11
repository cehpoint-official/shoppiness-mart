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
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Blanditiis,commodi tempora mollitia voluptatem
        </p>
      </div>
      <div className="lowerSec">
        {causes?.map((item, index) => (
          <div className="lowerCard" key={index}>
            <img
              src="https://shoppinessmart.com/assets/card7th1-9ad9884f.png"
              alt="card"
            />
            <h4>{item.title}</h4>
            <span>{item.category}</span>
            <h6>{item.support}</h6>
            <p>{item?.description}</p>
          </div>
        ))}
      </div>
      <p className="seeAll underline">
        See all <span>5,000 +</span> Causes
      </p>
    </div>
  );
};

export default PopularCauses;
