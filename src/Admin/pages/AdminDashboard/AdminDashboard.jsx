import { BsCalendar4} from "react-icons/bs"
import { FaStore, FaChartPie } from "react-icons/fa"
import { MdStorefront } from "react-icons/md"
import { BiDonateHeart } from "react-icons/bi"
import { HiOutlineTicket } from "react-icons/hi"
import GeneratedCoupons from '../../components/AdminDashboard/GeneratedCoupons'
import ListedShops from '../../components/AdminDashboard/ListedShops'


const donationData = [
  {
    name: "Priti Mondal",
    email: "user@gmail.com",
    amount: "Rs.1600",
    color: "#8b5cf6",
  },
  {
    name: "Joy Pal",
    email: "email@gmail.com",
    amount: "Rs.250",
    color: "#f59e0b",
  },
  {
    name: "Ajay Mondal",
    email: "abcd@gmail.com",
    amount: "Rs.1000",
    color: "#3b82f6",
  },
]

const AdminDashboard = () => {

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <BsCalendar4 className="text-blue-600" />
            <span>12 Jan, 2023 - 12 Jan, 2024</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <StatsCard icon={BiDonateHeart} value="100" label="Total NGOs/ Causes" bgColor="bg-orange-500" />
          <StatsCard icon={MdStorefront} value="98" label="Total Offline Shop" bgColor="bg-green-500" />
          <StatsCard icon={FaStore} value="02" label="Total Online Shop" bgColor="bg-red-500" />
          <StatsCard icon={FaChartPie} value="60" label="Total Cashback requests" bgColor="bg-purple-500" />
          <StatsCard icon={HiOutlineTicket} value="100" label="Generated Coupons" bgColor="bg-blue-500" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GeneratedCoupons />
          <ListedShops />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Shops */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Active Shops</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <MdStorefront className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span>Active Shops</span>
                    <span>200 (98%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-orange-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MdStorefront className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span>Inactive Shops</span>
                    <span>20 (2%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[2%] bg-orange-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Donations */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Top Donations</h2>
            <div className="space-y-4">
              {donationData.map((donor, index) => (
                <div key={index} className="flex items-center justify-between">
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
                    </div>
                  </div>
                  <div className="font-medium">{donor.amount}</div>
                </div>
              ))}
            </div>
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