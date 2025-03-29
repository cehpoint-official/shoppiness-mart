import { useState, useEffect } from "react"
import { BsCalendar4 } from "react-icons/bs"
import { FaStore, FaChartPie } from "react-icons/fa"
import { MdStorefront } from "react-icons/md"
import { BiDonateHeart } from "react-icons/bi"
import { HiOutlineTicket } from "react-icons/hi"
import GeneratedCoupons from '../../components/AdminDashboard/GeneratedCoupons'
import ListedShops from '../../components/AdminDashboard/ListedShops'
import AdminTransactions from "../../components/AdminDashboard/AdminTransactions"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../../../../firebase"
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const AdminDashboard = () => {
  const [donationData, setDonationData] = useState([])
  const [shopData, setShopData] = useState({
    active: 0,
    inactive: 0,
    total: 0,
    activePercentage: 0,
    inactivePercentage: 0
  })
  const [isLoadingDonations, setIsLoadingDonations] = useState(true)
  const [isLoadingShops, setIsLoadingShops] = useState(true)
  
  // Stats states
  const [totalNGOs, setTotalNGOs] = useState(0)
  const [totalShops, setTotalShops] = useState(0)
  const [totalOnlineShops, setTotalOnlineShops] = useState(0)
  const [totalCashbackRequests, setTotalCashbackRequests] = useState(0)
  const [totalCoupons, setTotalCoupons] = useState(0)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  
  // Add date range state
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear() - 1, 0, 1))
  const [endDate, setEndDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Format date for display
  const formatDateRange = () => {
    return `${formatDateForQuery(startDate)} - ${formatDateForQuery(endDate)}`
  }

  // Format date for Firestore query in "1 Jan 2024" format
  const formatDateForQuery = (date) => {
    const day = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true)
        
        // Fetch total NGOs from causeDetails collection
        const ngosSnapshot = await getDocs(collection(db, "causeDetails"))
        setTotalNGOs(ngosSnapshot.size)
        
        // Fetch shops from businessDetails collection
        const shopsSnapshot = await getDocs(collection(db, "businessDetails"))
        let validShopsCount = 0
        let onlineShopsCount = 0
        
        shopsSnapshot.forEach((doc) => {
          const shopData = doc.data()
          
          // Only count shops with status "Active" or "Inactive"
          if (shopData.status === "Active" || shopData.status === "Inactive") {
            validShopsCount++
            
            // Count online shops with valid status
            if (shopData.mode === "Online") {
              onlineShopsCount++
            }
          }
        })
        
        setTotalShops(validShopsCount)
        setTotalOnlineShops(onlineShopsCount)
        
        // Fetch cashback requests from userTransactions collection
        const cashbackSnapshot = await getDocs(collection(db, "userTransactions"))
        setTotalCashbackRequests(cashbackSnapshot.size)
        
        // Fetch generated coupons from coupons collection
        const couponsSnapshot = await getDocs(collection(db, "coupons"))
        setTotalCoupons(couponsSnapshot.size)
        
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoadingStats(false)
      }
    }
    
    fetchStats()
  }, [])

  // Fetch donations with date range filter
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoadingDonations(true)
        
        // Format dates for query
        const startDateStr = formatDateForQuery(startDate)
        const endDateStr = formatDateForQuery(endDate)
        
        // Create a query against the directDonationRequests collection with date range filter
        const q = query(
          collection(db, "directDonationRequests"), 
          where("status", "==", "verified"),
          where("createdAt", ">=", startDateStr),
          where("createdAt", "<=", endDateStr)
        )
        
        // Get the documents that match the query
        const querySnapshot = await getDocs(q)
        
        // Map the documents to the required format
        const donations = querySnapshot.docs.map((doc, index) => {
          const data = doc.data()
          
          // Generate a color based on index to keep it visually consistent
          const colors = ["#8b5cf6", "#f59e0b", "#3b82f6", "#ef4444", "#10b981"]
          
          return {
            id: doc.id,
            name: data.name || "Anonymous Donor",
            email: data.email || "No Email",
            amount: `Rs.${data.amount || 0}`,
            color: colors[index % colors.length],
            date: data.createdAt || 'Unknown date'
          }
        })
        
        // Sort by amount (highest first)
        const sortedDonations = donations.sort((a, b) => {
          // Extract numeric values from the amount strings
          const amountA = parseFloat(a.amount.replace('Rs.', ''))
          const amountB = parseFloat(b.amount.replace('Rs.', ''))
          return amountB - amountA
        })
        
        // Take only the top 3 donations
        setDonationData(sortedDonations.slice(0, 3))
      } catch (error) {
        console.error("Error fetching donations:", error)
        // Set empty array in case of error
        setDonationData([])
      } finally {
        setIsLoadingDonations(false)
      }
    }

    fetchDonations()
  }, [startDate, endDate]) // Re-fetch when date range changes

  // Fetch shop data without date filtering
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoadingShops(true)
        
        // Fetch all shops from businessDetails collection - no date filtering
        const shopsSnapshot = await getDocs(collection(db, "businessDetails"))
        
        // Initialize counters
        let activeCount = 0
        let inactiveCount = 0
        
        shopsSnapshot.forEach((doc) => {
          const shopData = doc.data()
          // Count active and inactive shops based on status
          if (shopData.status === "Active") {
            activeCount++
          } else if (shopData.status === "Inactive") {
            inactiveCount++
          }
        })
        
        const totalShops = activeCount + inactiveCount
        
        // Calculate percentages
        const activePercentage = totalShops > 0 ? Math.round((activeCount / totalShops) * 100) : 0
        const inactivePercentage = totalShops > 0 ? 100 - activePercentage : 0
        
        setShopData({
          active: activeCount,
          inactive: inactiveCount,
          total: totalShops,
          activePercentage,
          inactivePercentage
        })
      } catch (error) {
        console.error("Error fetching shops:", error)
        // Reset shop data in case of error
        setShopData({
          active: 0,
          inactive: 0,
          total: 0,
          activePercentage: 0,
          inactivePercentage: 0
        })
      } finally {
        setIsLoadingShops(false)
      }
    }
    
    fetchShops()
  }, [])

  // Handle date selection
  const handleDateRangeApply = (start, end) => {
    setStartDate(start)
    setEndDate(end)
    setShowDatePicker(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="relative">
            <button 
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <BsCalendar4 className="text-blue-600" />
              <span>{formatDateRange()}</span>
            </button>
            
            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white p-4 rounded-lg shadow-lg z-10">
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={date => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="w-full p-2 border rounded"
                      dateFormat="d MMM yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={date => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="w-full p-2 border rounded"
                      dateFormat="d MMM yyyy"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded text-sm"
                      onClick={() => setShowDatePicker(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      onClick={() => handleDateRangeApply(startDate, endDate)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {isLoadingStats ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-200 w-12 h-12"></div>
                    <div>
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <StatsCard icon={BiDonateHeart} value={totalNGOs.toString()} label="Total NGOs/ Causes" bgColor="bg-orange-500" />
              <StatsCard icon={MdStorefront} value={totalShops.toString()} label="Total Shops" bgColor="bg-green-500" />
              <StatsCard icon={FaStore} value={totalOnlineShops.toString()} label="Total Online Shop" bgColor="bg-red-500" />
              <StatsCard icon={FaChartPie} value={totalCashbackRequests.toString()} label="Total Cashback requests" bgColor="bg-purple-500" />
              <StatsCard icon={HiOutlineTicket} value={totalCoupons.toString()} label="Generated Coupons" bgColor="bg-blue-500" />
            </>
          )}
        </div>

        {/* Charts Grid - Pass date range to components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Currently it is showing the data for the current month, week and day and not the selected date range */}
          <GeneratedCoupons 
            startDate={formatDateForQuery(startDate)} 
            endDate={formatDateForQuery(endDate)} 
          />
          <ListedShops 
            startDate={formatDateForQuery(startDate)} 
            endDate={formatDateForQuery(endDate)} 
          />
        </div>

        {/* Transactions Section - Pass date range */}
        <div className="mb-6">
          <AdminTransactions 
            startDate={formatDateForQuery(startDate)} 
            endDate={formatDateForQuery(endDate)} 
          />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Shops */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Active Shops</h2>
            {isLoadingShops ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading shop data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <MdStorefront className="w-6 h-6 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span>Active Shops</span>
                      <span>{shopData.active} ({shopData.activePercentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${shopData.activePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MdStorefront className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span>Inactive Shops</span>
                      <span>{shopData.inactive} ({shopData.inactivePercentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${shopData.inactivePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Donations */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Top Donations</h2>
            {isLoadingDonations ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading donations...</p>
              </div>
            ) : donationData.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                <p>No verified donations found in selected date range</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donationData.map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: donor.color }}
                      >
                        {donor.name[0]}
                      </div>
                      <div>
                        <div className="font-medium">{donor.name}</div>
                        <div className="text-sm text-gray-500">{donor.email}</div>
                        <div className="text-xs text-gray-400">{donor.date}</div>
                      </div>
                    </div>
                    <div className="font-medium">{donor.amount}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

const StatsCard = ({ icon: Icon, value, label, bgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  </div>
)