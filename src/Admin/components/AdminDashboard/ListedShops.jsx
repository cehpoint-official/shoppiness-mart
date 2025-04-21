import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";

const ListedShops = ({ startDate, endDate }) => {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to parse date strings like "21 Jan 2025"
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split(" ");
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    return new Date(parseInt(year), months[month], parseInt(day));
  };

  // Helper function to format date to string like "21 Jan 2025"
  const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      try {
        // Parse string dates to Date objects
        const parsedStartDate = parseDate(startDate);
        const parsedEndDate = parseDate(endDate);
        
        // Create a query against the businessDetails collection
        const businessRef = collection(db, "businessDetails");
        
        // Query shops based on string date format
        const querySnapshot = await getDocs(businessRef);
        
        // Process data for chart display - filter manually since createdDate is a string
        const shops = [];
        querySnapshot.forEach((doc) => {
          const shopData = { id: doc.id, ...doc.data() };
          
          // Parse the shop's createdDate
          if (shopData.createdDate) {
            const shopDate = parseDate(shopData.createdDate);
            
            // Filter based on date range
            if (shopDate >= parsedStartDate && shopDate <= parsedEndDate) {
              // Add parsed date for later use
              shopData.parsedDate = shopDate;
              shops.push(shopData);
            }
          }
        });
        
        // Organize data by month (or based on activeTab)
        const organizedData = processShopData(shops, activeTab, parsedStartDate, parsedEndDate);
        setChartData(organizedData);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, [startDate, endDate, activeTab]);

  // Process shop data based on selected tab (Monthly, Weekly, Today)
  const processShopData = (shops, tabType, start, end) => {
    // Initialize data structure based on tab type
    let processedData = [];
    
    if (tabType === "Monthly") {
      // Create monthly buckets for the date range
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const startMonth = start.getMonth();
      const endMonth = end.getMonth();
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      
      // Initialize the data structure with months in range
      for (let year = startYear; year <= endYear; year++) {
        const monthStart = year === startYear ? startMonth : 0;
        const monthEnd = year === endYear ? endMonth : 11;
        
        for (let month = monthStart; month <= monthEnd; month++) {
          processedData.push({
            month: months[month],
            year: year,
            label: `${months[month]} ${year}`,
            offline: 0,
            online: 0,
          });
        }
      }
      
      // Count shops by month and type
      shops.forEach(shop => {
        // Use the parsedDate we created during filtering
        const shopDate = shop.parsedDate;
        
        const monthIndex = shopDate.getMonth();
        const year = shopDate.getFullYear();
        
        const dataPoint = processedData.find(
          d => d.month === months[monthIndex] && d.year === year
        );
        
        if (dataPoint) {
          // Determine if shop is online or offline
          if (shop.isOnline) {
            dataPoint.online += 1;
          } else {
            dataPoint.offline += 1;
          }
        }
      });
      
      // Simplify the labels for display if single year
      if (startYear === endYear) {
        processedData = processedData.map(item => ({
          ...item,
          month: item.month, // Use only month for x-axis
        }));
      } else {
        processedData = processedData.map(item => ({
          ...item,
          month: item.label, // Use month + year for x-axis
        }));
      }
    } else if (tabType === "Weekly") {
      // Implementation for weekly view
      // Number of weeks between start and end
      const msPerWeek = 7 * 24 * 60 * 60 * 1000;
      const weekCount = Math.ceil((end - start) / msPerWeek);
      
      for (let i = 0; i < weekCount; i++) {
        const weekStart = new Date(start.getTime() + (i * msPerWeek));
        const weekEnd = new Date(Math.min(weekStart.getTime() + msPerWeek - 1, end.getTime()));
        
        processedData.push({
          month: `Week ${i+1}`, // Using "month" as the x-axis label
          start: weekStart,
          end: weekEnd,
          startLabel: formatDate(weekStart),
          endLabel: formatDate(weekEnd),
          offline: 0,
          online: 0,
        });
      }
      
      // Count shops by week
      shops.forEach(shop => {
        const shopDate = shop.parsedDate;
        
        const weekData = processedData.find(
          w => shopDate >= w.start && shopDate <= w.end
        );
        
        if (weekData) {
          if (shop.isOnline) {
            weekData.online += 1;
          } else {
            weekData.offline += 1;
          }
        }
      });
      
      // Format week labels to show date ranges
      processedData = processedData.map((week, i) => ({
        ...week,
        month: `${week.startLabel} - ${week.endLabel}`
      }));
    } else if (tabType === "Today") {
      // Implementation for daily view (Today)
      // For "Today", we might show hourly data
      for (let hour = 0; hour < 24; hour++) {
        processedData.push({
          month: `${hour}:00`, // Using month as the x-axis label
          hour: hour,
          offline: 0,
          online: 0,
        });
      }
      
      // Filter for today's shops
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayShops = shops.filter(shop => {
        const shopDate = shop.parsedDate;
        const shopDay = new Date(shopDate);
        shopDay.setHours(0, 0, 0, 0);
        return shopDay.getTime() === today.getTime();
      });
      
      // Count by hour
      todayShops.forEach(shop => {
        const shopDate = shop.parsedDate;
        const hour = shopDate.getHours();
        
        if (shop.isOnline) {
          processedData[hour].online += 1;
        } else {
          processedData[hour].offline += 1;
        }
      });
    }
    
    return processedData;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 shadow-lg rounded-lg text-xs sm:text-sm">
          <p className="text-gray-600 mb-1 sm:mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Offline Shops</span>
              <span className="ml-1 sm:ml-2 font-semibold">
                {payload[0] ? payload[0].value : 0}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>Online Shops</span>
              <span className="ml-1 sm:ml-2 font-semibold">
                {payload[1] ? payload[1].value : 0}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Listed Shops</h2>
        <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
          {startDate} - {endDate}
        </div>
      </div>

      <TabGroup activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4 sm:mt-6 h-[250px] sm:h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm sm:text-base">No shops found in the selected date range</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ 
                top: 20, 
                right: 5, 
                left: -20, 
                bottom: 30 
              }}
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
                tick={{ fill: "#666", fontSize: '10px' }}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  // For mobile screens, abbreviate month names further if needed
                  if (window.innerWidth < 640 && value.length > 10) {
                    return value.substring(0, 8) + '...';
                  }
                  return value;
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: '10px' }}
                tickFormatter={(value) =>
                  value === 0 ? "0" : value < 1000 ? value : `${value / 1000}K`
                }
                width={30}
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
        )}
      </div>

      <div className="flex flex-col xs:flex-row gap-3 xs:gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded" />
          <span>Offline Shops</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded" />
          <span>Online Shops</span>
        </div>
      </div>
    </div>
  );
};

export default ListedShops;

const TabGroup = ({ activeTab, setActiveTab }) => (
  <div className="inline-flex bg-gray-100 rounded-full p-1 overflow-x-auto max-w-full">
    {["Monthly", "Weekly", "Today"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap ${
          activeTab === tab ? "bg-white text-black shadow-sm" : "text-blue-500"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);