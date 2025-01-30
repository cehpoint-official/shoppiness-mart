import { collection, getDocs } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { db } from "../../../firebase";

const GiveBackForm = () => {
  const [ngos, setNgos] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "causeDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        data.push({ id: doc.id, ...shopData });
      });
      setNgos(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-2">Select NGO</label>
          <select className="w-full bg-gray-200 rounded p-2 text-sm border-0">
            <option>Select NGO...</option>
            {ngos.map((ngo, index) => (
              <option key={index} value={ngo.causeName}>
                {ngo.causeName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Enter Amount</label>
          <input
            type="text"
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
            placeholder="Enter amount"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white rounded py-3 text-sm mt-6"
        >
          Give Back
        </button>
      </form>
    </div>
  );
};

export default GiveBackForm;
