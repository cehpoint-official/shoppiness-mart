import { FaUsers, FaBox, FaTicketAlt, FaUserPlus } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Dashboard() {
  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex  justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <button className="px-4 py-1.5 bg-gray-100 rounded flex items-center gap-1 border border-black">
          Today <IoMdArrowDropdown className="text-lg" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FaUsers className="text-white" />}
          title="Total Customer"
          value="10"
          color="bg-teal-600"
          border="border-teal-600"
        />
        <StatCard
          icon={<FaBox className="text-white" />}
          title="Total Product"
          value="20"
          color="bg-orange-400"
          border="border-orange-400"
        />
        <StatCard
          icon={<FaTicketAlt className="text-white" />}
          title="Claimed Coupons"
          value="10"
          color="bg-red-400"
          border="border-red-400"
        />
        <StatCard
          icon={<FaUserPlus className="text-white" />}
          title="New Customer"
          value="07"
          color="bg-gray-500"
          border="border-gray-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ClaimedCoupons />
        <NewCustomers />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, border }) {
  return (
    <div className={`bg-white h-[130px] p-4 rounded-t-lg shadow-sm border-b-4 ${border}`}>
      <div className="flex justify-between items-start relative">
        <div>
          <p className="text-3xl font-semibold mb-1">{value}</p>
          <p className="text-gray-600">{title}</p>
        </div>
        <div className={`p-3 absolute -right-2 top-16 rounded-md ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function ClaimedCoupons() {
  const coupons = [
    {
      id: "#ZTY7878",
      name: "Tithi Mondal",
      contact: "email@gmail.com\n+91 7036804082",
      offer: "20% off",
    },
    {
      id: "#ZTY7878",
      name: "Pinki Mondal",
      contact: "email@gmail.com\n+91 7036804082",
      offer: "20% off",
    },
    {
      id: "#ZTY7878",
      name: "Puja Mondal",
      contact: "email@gmail.com\n+91 7036804082",
      offer: "20% off",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-medium">Claimed Coupons</h2>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          3
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-left text-sm text-gray-600">
            <tr>
              <th className="pb-4">Coupon ID</th>
              <th className="pb-4">Name</th>
              <th className="pb-4">Contact</th>
              <th className="pb-4">Offer</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {coupons.map((coupon, index) => (
              <tr key={index} className="border-t">
                <td className="py-4">{coupon.id}</td>
                <td>{coupon.name}</td>
                <td className="whitespace-pre-line">{coupon.contact}</td>
                <td>{coupon.offer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewCustomers() {
  const customers = [
    {
      name: "Taki Uchiha",
      email: "email@gmail.com",
      avatar: "https://v0.dev/placeholder.svg",
    },
    {
      name: "Mia Nohara",
      email: "email@gmail.com",
      avatar: "https://v0.dev/placeholder.svg",
    },
    {
      name: "Raj Roy",
      email: "email@gmail.com",
      avatar: "https://v0.dev/placeholder.svg",
    },
    {
      name: "Pihu Prajapati",
      email: "email@gmail.com",
      avatar: "https://v0.dev/placeholder.svg",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-medium">New Customers</h2>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          7
        </span>
      </div>
      <div className="space-y-4">
        {customers.map((customer, index) => (
          <div key={index} className="flex items-center gap-3">
            <img
              src={customer.avatar || "/placeholder.svg"}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{customer.name}</p>
              <p className="text-sm text-gray-600">{customer.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
