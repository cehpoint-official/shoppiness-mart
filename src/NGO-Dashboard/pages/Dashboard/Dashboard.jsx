import { MdLocalPhone } from "react-icons/md";
import { LiaEnvelopeSolid } from "react-icons/lia";
import { BsFillHeartPulseFill } from "react-icons/bs";
import { FaHandHoldingWater } from "react-icons/fa";
import { RiShoppingBagLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
function Dashboard() {
  const newSupporters = [
    {
      name: "Taki Uchiha",
      email: "email@gmail.com",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      name: "Mia Nohara",
      email: "email@gmail.com",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      name: "Raj Roy",
      email: "email@gmail.com",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      name: "Pihu Prajapati",
      email: "email@gmail.com",
      image: "/placeholder.svg?height=50&width=50",
    },
  ];

  const recentTranslocations = [
    {
      merchant: "SPHOPINESSMART",
      date: "02 Jun",
      amount: "Rs. 2000",
      status: "Payment recived",
    },
    {
      merchant: "SPHOPINESSMART",
      date: "02 May",
      amount: "Rs. 2000",
      status: "Payment recived",
    },
    {
      merchant: "SPHOPINESSMART",
      date: "02 May",
      amount: "Rs. 2000",
      status: "Payment recived",
    },
  ];
  const { user, loading } = useSelector((state) => state.ngoUserReducer);
  console.log(user);

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
              <button className="mt-4 px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors">
                Cause/NGO Details
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-2 ">
          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total Donations</p>
              <h3 className="text-3xl font-bold mt-1">RS 2500</h3>
            </div>
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <FaHandHoldingWater className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total Supporters</p>
              <h3 className="text-3xl font-bold mt-1">500</h3>
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
              7
            </span>
          </div>
          <div className="space-y-4">
            {newSupporters.map((supporter, index) => (
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
            ))}
          </div>
        </div>

        {/* Recent Translocation */}
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold">Recent Translocation</h3>
            <span className="bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded-full">
              3
            </span>
          </div>
          <div className="space-y-2">
            {recentTranslocations.map((transaction, index) => (
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
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-medium">
                    {transaction.amount}
                  </p>
                  <p className="text-sm text-gray-600">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
