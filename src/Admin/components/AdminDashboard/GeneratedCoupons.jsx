import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsChevronRight } from "react-icons/bs";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../../../firebase";

const GeneratedCoupons = ({ startDate, endDate }) => {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    claimed: 0,
    pendingPercentage: 0,
    claimedPercentage: 0
  });

  const navigate = useNavigate();
  const { userId } = useParams();

  // Function to filter coupons based on selected tab
  const filterCouponsByTimeFrame = (allCoupons) => {
    const now = new Date();
    let startDate = new Date();
    
    switch(activeTab) {
      case "Today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "Weekly":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "Monthly":
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
    }
    
    // Filter coupons based on createdAt date
    return allCoupons.filter(coupon => {
      if (!coupon.createdAt) return false;
      
      // Handle different timestamp formats
      let couponDate;
      if (coupon.createdAt.toDate) {
        // Firestore Timestamp
        couponDate = coupon.createdAt.toDate();
      } else if (coupon.createdAt instanceof Date) {
        // JavaScript Date
        couponDate = coupon.createdAt;
      } else if (typeof coupon.createdAt === 'string') {
        // ISO string
        couponDate = new Date(coupon.createdAt);
      } else {
        // Fallback - use current date
        couponDate = new Date();
      }
      
      return couponDate >= startDate;
    });
  };

  // Fetch all coupons and apply filters client-side
  useEffect(() => {
    const fetchAllCoupons = async () => {
      try {
        setLoading(true);
        
        // Fetch all coupons, sorted by creation date
        const q = query(
          collection(db, "coupons"),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const allCouponsList = [];
        
        querySnapshot.forEach((doc) => {
          allCouponsList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Store all coupons
        setCoupons(allCouponsList);
        
        // Apply time filter
        const filteredCoupons = filterCouponsByTimeFrame(allCouponsList);
        
        // Count stats for filtered coupons
        let pendingCount = 0;
        let claimedCount = 0;
        
        filteredCoupons.forEach((coupon) => {
          if (coupon.status === "Claimed") {
            claimedCount++;
          } else if (coupon.status === "Pending") {
            pendingCount++;
          }
        });
        
        const totalCount = filteredCoupons.length;
        
        // Calculate percentages
        const claimedPercentage = totalCount > 0 
          ? Math.round((claimedCount / totalCount) * 100) 
          : 0;
        
        const pendingPercentage = totalCount > 0 
          ? Math.round((pendingCount / totalCount) * 100) 
          : 0;
        
        setStats({
          total: totalCount,
          pending: pendingCount,
          claimed: claimedCount,
          pendingPercentage,
          claimedPercentage
        });
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllCoupons();
  }, [activeTab]);

  // Handler for View All button
  const handleViewAll = () => {
    // Navigate to coupons page
    navigate(`/admin/${userId}/shoppiness/users/coupons`);
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl font-semibold mb-6">Generated Coupons</h2>

      <TabGroup activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6 bg-green-50 rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white text-xl font-bold w-12 h-12 rounded-xl flex items-center justify-center">
            {loading ? "..." : coupons.length}
          </div>
          <span className="text-lg">All Coupons</span>
        </div>
        <button 
          className="text-green-500 flex items-center gap-1"
          onClick={handleViewAll}
        >
          View All <BsChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-3xl font-bold">{loading ? "..." : stats.total}</div>
          <div className="text-gray-500">Total</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-3xl font-bold">{loading ? "..." : stats.pending}</div>
          <div className="text-gray-500">Pending</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-3xl font-bold">{loading ? "..." : stats.claimed}</div>
          <div className="text-gray-500">Claimed</div>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="12"
                />
                {/* Pending arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${stats.pendingPercentage * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />
                {/* Claimed arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ff7f7f"
                  strokeWidth="12"
                  strokeDasharray={`${stats.claimedPercentage * 2.51} 251`}
                  transform={`rotate(${stats.pendingPercentage * 3.6 - 90} 50 50)`}
                />
              </svg>
              
              {/* Add center text with total count */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Pending ({stats.pending})</span>
                  <span>{stats.pendingPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${stats.pendingPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Claimed ({stats.claimed})</span>
                  <span>{stats.claimedPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-[#ff7f7f] rounded-full" 
                    style={{ width: `${stats.claimedPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GeneratedCoupons;

const TabGroup = ({ activeTab, setActiveTab }) => (
  <div className="inline-flex bg-gray-100 rounded-full p-1">
    {["Monthly", "Weekly", "Today"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-1 rounded-full text-sm ${
          activeTab === tab ? "bg-white text-black shadow-sm" : "text-blue-500"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);