import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

const Givebacks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const itemsPerPage = 5;

  // Extended sample data with 20 entries
  const allDonations = [
    {
      id: 1,
      ngo: "MAAST",
      date: "02 Jan, 2024",
      name: "Tithi Mondal",
      email: "email@gmail.com",
      amount: 1300,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 2,
      ngo: "MAAST",
      date: "02 Jan, 2024",
      name: "Tithi Mondal",
      email: "email@gmail.com",
      amount: 1500,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 3,
      ngo: "MAAST",
      date: "02 Jan, 2024",
      name: "Tithi Mondal",
      email: "email@gmail.com",
      amount: 600,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 4,
      ngo: "SUN",
      date: "02 Jan, 2024",
      name: "Tithi Mondal",
      email: "email@gmail.com",
      amount: 1000,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 5,
      ngo: "SUN",
      date: "02 Jan, 2024",
      name: "Tithi Mondal",
      email: "email@gmail.com",
      amount: 7000,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 6,
      ngo: "CARE",
      date: "03 Jan, 2024",
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      amount: 2500,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 7,
      ngo: "HELP",
      date: "03 Jan, 2024",
      name: "Priya Singh",
      email: "priya@gmail.com",
      amount: 3000,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 8,
      ngo: "SAVE",
      date: "04 Jan, 2024",
      name: "Amit Patel",
      email: "amit@gmail.com",
      amount: 5000,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 9,
      ngo: "HOPE",
      date: "04 Jan, 2024",
      name: "Sneha Gupta",
      email: "sneha@gmail.com",
      amount: 1800,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 10,
      ngo: "LIFE",
      date: "05 Jan, 2024",
      name: "Raj Sharma",
      email: "raj@gmail.com",
      amount: 2200,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 11,
      ngo: "MAAST",
      date: "05 Jan, 2024",
      name: "Neha Roy",
      email: "neha@gmail.com",
      amount: 4000,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 12,
      ngo: "SUN",
      date: "06 Jan, 2024",
      name: "Vikram Malhotra",
      email: "vikram@gmail.com",
      amount: 6000,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 13,
      ngo: "CARE",
      date: "06 Jan, 2024",
      name: "Anita Desai",
      email: "anita@gmail.com",
      amount: 2800,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 14,
      ngo: "HELP",
      date: "07 Jan, 2024",
      name: "Sanjay Verma",
      email: "sanjay@gmail.com",
      amount: 3500,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 15,
      ngo: "SAVE",
      date: "07 Jan, 2024",
      name: "Meera Kapoor",
      email: "meera@gmail.com",
      amount: 4500,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 16,
      ngo: "HOPE",
      date: "08 Jan, 2024",
      name: "Arjun Singh",
      email: "arjun@gmail.com",
      amount: 2100,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 17,
      ngo: "LIFE",
      date: "08 Jan, 2024",
      name: "Pooja Mehta",
      email: "pooja@gmail.com",
      amount: 3200,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 18,
      ngo: "MAAST",
      date: "09 Jan, 2024",
      name: "Ravi Kumar",
      email: "ravi@gmail.com",
      amount: 5500,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 19,
      ngo: "SUN",
      date: "09 Jan, 2024",
      name: "Maya Joshi",
      email: "maya@gmail.com",
      amount: 4200,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 20,
      ngo: "CARE",
      date: "10 Jan, 2024",
      name: "Karan Khanna",
      email: "karan@gmail.com",
      amount: 3800,
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
  ];

  // Sorting function
  const sortDonations = (donations) => {
    switch (sortBy) {
      case "newest":
        return [...donations].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      case "oldest":
        return [...donations].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      case "az":
        return [...donations].sort((a, b) => a.ngo.localeCompare(b.ngo));
      case "za":
        return [...donations].sort((a, b) => b.ngo.localeCompare(a.ngo));
      default:
        return donations;
    }
  };

  // Calculate pagination
  const sortedDonations = sortDonations(allDonations);
  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDonations = sortedDonations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl">Give Backs</h1>
        </div>
        <div className="relative">
          <select
            className="appearance-none border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="za">Alphabetical (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-4 font-medium text-gray-600">
                  NGO/Cause name
                </th>
                <th className="p-4 font-medium text-gray-600">Date</th>
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Email</th>
                <th className="p-4 font-medium text-gray-600">Amount</th>
                <th className="p-4 font-medium text-gray-600">Message</th>
                <th className="p-4 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {displayedDonations.map((donation) => (
                <tr key={donation.id} className="border-b">
                  <td className="p-4">{donation.ngo}</td>
                  <td className="p-4">{donation.date}</td>
                  <td className="p-4">{donation.name}</td>
                  <td className="p-4">{donation.email}</td>
                  <td className="p-4">₹ {donation.amount}</td>
                  <td className="p-4">{donation.message}</td>
                  <td className="p-4">
                    <button className="p-1 hover:bg-gray-100 rounded-full">
                      <FiMoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, allDonations.length)} of{" "}
            {allDonations.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`w-8 h-8 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 text-sm disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Givebacks;
