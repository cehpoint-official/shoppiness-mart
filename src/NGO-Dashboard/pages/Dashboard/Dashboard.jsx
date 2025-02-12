import { MdLocalPhone } from "react-icons/md";
import { LiaEnvelopeSolid } from "react-icons/lia";
import { BsFillHeartPulseFill } from "react-icons/bs";
import { FaHandHoldingWater } from "react-icons/fa";
import { RiShoppingBagLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Link, useParams } from "react-router-dom";

function Dashboard() {
  const [givebacks, setGivebacks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Calculate total donations (sum of completed transactions)
  const totalDonations = givebacks
    .filter((item) => item.status === "Completed")
    .reduce((sum, item) => sum + item.amount, 0);

  // Calculate total supporters (unique userIds with completed status)
  const supporterIds = new Set(
    givebacks
      .filter((item) => item.status === "Completed")
      .map((item) => item.userId)
  );
  const totalSupporters = supporterIds.size;

  // New supporters (sorted by most recent date and unique by userId)
  const uniqueSupporters = new Set();
  const newSupporters = givebacks
    .filter((item) => item.status === "Completed")
    .sort(
      (a, b) =>
        new Date(b.paidAt || b.requestedAt) -
        new Date(a.paidAt || a.requestedAt)
    )
    .filter((item) => {
      if (!uniqueSupporters.has(item.userId)) {
        uniqueSupporters.add(item.userId);
        return true;
      }
      return false;
    })
    .slice(0, 4) // Limit to 4 unique supporters
    .map((item) => ({
      name: item.userName,
      email: item.userEmail,
      image: item.userPic,
    }));

  // Recent transactions (completed status only)
  const recentTransactions = givebacks
    .filter((item) => item.status === "Completed")
    .sort(
      (a, b) =>
        new Date(b.paidAt || b.requestedAt) -
        new Date(a.paidAt || a.requestedAt)
    )
    .slice(0, 3) // Limit to 3 transactions
    .map((item) => ({
      merchant: "SPHOPINESSMART",
      date: new Date(item.paidAt || item.requestedAt).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      amount: `Rs. ${item.amount}`,
      status: "Payment received",
    }));

  const { user } = useSelector((state) => state.ngoUserReducer);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* NGO Info Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <img
              src={user?.logoUrl}
              alt="NGO Logo"
              className="w-20 h-20 rounded-full"
            />
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{user?.causeName}</h2>
              <div className="space-y-1 mt-2">
                <p className="text-gray-600 flex items-center gap-2">
                  <LiaEnvelopeSolid className="w-4 h-4" />
                  {user?.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <MdLocalPhone className="w-4 h-4" />
                  {user?.mobileNumber}
                </p>
              </div>
              <Link to={`/ngo-dashboard/${id}/details`}>
                <button className="mt-4 px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors">
                  Cause/NGO Details
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total Donations</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : (
                <h3 className="text-3xl font-bold mt-1">
                  Rs. {totalDonations}
                </h3>
              )}
            </div>
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <FaHandHoldingWater className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total Supporters</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : (
                <h3 className="text-3xl font-bold mt-1">{totalSupporters}</h3>
              )}
            </div>
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <BsFillHeartPulseFill className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-3">
        {/* New Supporters */}
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold">New Supporters</h3>
            <span className="bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded-full">
              {newSupporters.length}
            </span>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
                  </div>
                </div>
              ))
            ) : newSupporters.length > 0 ? (
              newSupporters.map((supporter, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img
                    src={supporter.image || "/placeholder.svg"}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{supporter.name}</p>
                    <p className="text-sm text-gray-600">{supporter.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No new supporters found.</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <span className="bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded-full">
              {recentTransactions.length}
            </span>
          </div>
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                  </div>
                </div>
              ))
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <RiShoppingBagLine className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.merchant}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-medium">
                      {transaction.amount}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No recent transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
