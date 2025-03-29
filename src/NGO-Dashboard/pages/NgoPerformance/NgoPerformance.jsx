import { useCallback, useEffect, useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import TransactionHistory from "./TransactionHistory";
import Supporters from "./Supporters";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";

const NgoPerformance = () => {
  const [givebacks, setGivebacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("performance");
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "givebackCashbacks"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const GivebackHistoryData = doc.data();
        if (GivebackHistoryData.ngoId === id) {
          data.push({ id: doc.id, ...GivebackHistoryData });
        }
      });
      setGivebacks(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalDonations = givebacks
    .filter((item) => item.status === "Completed")
    .reduce((sum, item) => sum + item.amount, 0);

  const supporterIds = new Set(
    givebacks
      .filter((item) => item.status === "Completed")
      .map((item) => item.userId)
  );
  const totalSupporters = supporterIds.size;
console.log(givebacks);

  if (currentView === "transactionHistory") {
    return <TransactionHistory onBack={() => setCurrentView("performance")} givebacks={givebacks} />;
  }
  if (currentView === "supporters") {
    return <Supporters onBack={() => setCurrentView("performance")} givebacks={givebacks}/>;
  }

  return (
    <div className="p-10">
      <h2 className="text-xl mb-6">Cause/NGO Performance</h2>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <p className="text-gray-500">Total Donations</p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-300 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-medium">RS. {totalDonations}</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="text-gray-500 mr-4">Transaction History</span>
            <button
              onClick={() => setCurrentView("transactionHistory")}
              className="w-10 h-10 bg-[#FDB022] rounded-full flex items-center justify-center"
            >
              <HiArrowRight className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <p className="text-gray-500">Total Supporters</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-300 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-medium">{totalSupporters} Users</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="text-gray-500 mr-4">Supporters History</span>
            <button
              onClick={() => setCurrentView("supporters")}
              className="w-10 h-10 bg-[#FDB022] rounded-full flex items-center justify-center"
            >
              <HiArrowRight className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoPerformance;
