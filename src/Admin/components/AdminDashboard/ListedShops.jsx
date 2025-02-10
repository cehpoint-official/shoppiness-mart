import { useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
const ListedShops = () => {
  const [activeTab, setActiveTab] = useState("Monthly");

  const data = [
    { month: "Jan", offline: 2500, online: 500 },
    { month: "Feb", offline: 3000, online: 400 },
    { month: "Mar", offline: 2800, online: 600 },
    { month: "Apr", offline: 2200, online: 800 },
    { month: "May", offline: 2000, online: 1000 },
    { month: "Jun", offline: 1800, online: 900 },
    { month: "Jul", offline: 2000, online: 800 },
    { month: "Aug", offline: 2500, online: 600 },
    { month: "Sep", offline: 3000, online: 500 },
    { month: "Oct", offline: 4000, online: 700 },
    { month: "Nov", offline: 5000, online: 1200 },
    { month: "Dec", offline: 6000, online: 1800 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg">
          <p className="text-gray-600 mb-2">March, 2024</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Offline Shops</span>
              <span className="ml-2 font-semibold">400</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>Online Shops</span>
              <span className="ml-2 font-semibold">200</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl font-semibold mb-6">Listed Shops</h2>

      <TabGroup activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
          >
            <defs>
              <linearGradient id="colorOffline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666" }}
              ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]}
              tickFormatter={(value) =>
                value === 0 ? "0" : `${value / 1000}K`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="offline"
              stroke="#4ade80"
              fill="url(#colorOffline)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="online"
              stroke="#facc15"
              fill="url(#colorOnline)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded" />
          <span>Offline Shops</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded" />
          <span>Online Shops</span>
        </div>
      </div>
    </div>
  );
};

export default ListedShops;
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

