import { useState } from "react";
import { MdMoreVert, MdSort } from "react-icons/md";

const AllDonations = () => {
  const [donations] = useState([
    {
      id: 1,
      ngo: "MAAST",
      date: "02 Jan, 2024",
      name: "Tithi Mondal",
      email: "email@gmail.com",
      amount: "₹ 1300",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 2,
      ngo: "MAAST",
      date: "03 Jan, 2024",
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      amount: "₹ 1500",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 3,
      ngo: "MAAST",
      date: "04 Jan, 2024",
      name: "Priya Singh",
      email: "priya@gmail.com",
      amount: "₹ 600",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 4,
      ngo: "SUN",
      date: "05 Jan, 2024",
      name: "Amit Shah",
      email: "amit@gmail.com",
      amount: "₹ 1000",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 5,
      ngo: "SUN",
      date: "06 Jan, 2024",
      name: "Zara Khan",
      email: "zara@gmail.com",
      amount: "₹ 7000",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 6,
      ngo: "CARE",
      date: "07 Jan, 2024",
      name: "John Doe",
      email: "john@gmail.com",
      amount: "₹ 2500",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 7,
      ngo: "HOPE",
      date: "08 Jan, 2024",
      name: "Mary Jane",
      email: "mary@gmail.com",
      amount: "₹ 3000",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 8,
      ngo: "LIFE",
      date: "09 Jan, 2024",
      name: "David Wilson",
      email: "david@gmail.com",
      amount: "₹ 5000",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 9,
      ngo: "GIVE",
      date: "10 Jan, 2024",
      name: "Sarah Brown",
      email: "sarah@gmail.com",
      amount: "₹ 4000",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
    {
      id: 10,
      ngo: "HELP",
      date: "11 Jan, 2024",
      name: "Michael Scott",
      email: "michael@gmail.com",
      amount: "₹ 6000",
      message: "Lorem ipsum dolor sit amet consectetur. Tur..",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Newest First");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const itemsPerPage = 5;

  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Alphabetical (A-Z)",
    "Alphabetical (Z-A)",
  ];

  const handleSort = (option) => {
    setSortBy(option);
    setSortMenuOpen(false);
  };

  const handleEdit = () => {
    // Handle edit logic
    setActiveDropdown(null);
  };

  const handleDelete = () => {
    // Handle delete logic
    setActiveDropdown(null);
  };

  // Sort donations based on selected option
  const getSortedDonations = () => {
    let sorted = [...donations];
    switch (sortBy) {
      case "Newest First":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "Oldest First":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "Alphabetical (A-Z)":
        return sorted.sort((a, b) => a.ngo.localeCompare(b.ngo));
      case "Alphabetical (Z-A)":
        return sorted.sort((a, b) => b.ngo.localeCompare(a.ngo));
      default:
        return sorted;
    }
  };

  // Get current page items
  const sortedDonations = getSortedDonations();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDonations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-normal">All Donation</h1>
        <div className="relative">
          <button
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-gray-50"
          >
            <MdSort className="w-5 h-5" />
            Sort by
          </button>

          {sortMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                    sortBy === option ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleSort(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">NGO/Cause name</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Message</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((donation) => (
              <tr key={donation.id} className="border-b">
                <td className="p-4">{donation.ngo}</td>
                <td className="p-4">{donation.date}</td>
                <td className="p-4">{donation.name}</td>
                <td className="p-4">{donation.email}</td>
                <td className="p-4">{donation.amount}</td>
                <td className="p-4">{donation.message}</td>
                <td className="p-4">
                  <div className="relative">
                    <button
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === donation.id ? null : donation.id
                        )
                      }
                    >
                      <MdMoreVert size={20} />
                    </button>

                    {activeDropdown === donation.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => handleEdit(donation.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          onClick={() => handleDelete(donation.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, sortedDonations.length)} of{" "}
          {sortedDonations.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllDonations;
