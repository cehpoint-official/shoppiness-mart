import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import CreateBlog from "./CreateBlog";

const blogData = [
  {
    id: 1,
    title: "What is HUF Family?",
    author: "Tithi Mondal",
    date: "12 Apr, 2024",
    status: "Published",
    views: 200,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    title: "Understanding Income Tax Slabs",
    author: "Rajesh Kumar",
    date: "05 Mar, 2024",
    status: "Draft",
    views: 0,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    title: "GST Filing Made Easy",
    author: "Sneha Das",
    date: "20 Jan, 2024",
    status: "Published",
    views: 350,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    title: "Top Investment Strategies for 2024",
    author: "Amit Shah",
    date: "15 Feb, 2024",
    status: "Draft",
    views: 0,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    title: "How to Save More on Taxes",
    author: "Priya Verma",
    date: "28 Dec, 2023",
    status: "Published",
    views: 500,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    title: "Tax Benefits for Senior Citizens",
    author: "Rahul Mehta",
    date: "10 Jan, 2024",
    status: "Draft",
    views: 0,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 7,
    title: "Filing Tax Returns Online",
    author: "Tithi Mondal",
    date: "25 Mar, 2024",
    status: "Published",
    views: 275,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 8,
    title: "Common Tax Filing Mistakes",
    author: "Rajesh Kumar",
    date: "02 Feb, 2024",
    status: "Draft",
    views: 0,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 9,
    title: "Freelancers and Taxation Rules",
    author: "Sneha Das",
    date: "08 Apr, 2024",
    status: "Published",
    views: 400,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 10,
    title: "Best Tax Saving Investments",
    author: "Amit Shah",
    date: "18 Mar, 2024",
    status: "Draft",
    views: 0,
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
];

const MainBlog = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleActionClick = (id) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  // Filter data based on active tab
  const filteredData = blogData.filter((blog) => {
    if (activeTab === "all") return true;
    return blog.status.toLowerCase() === activeTab;
  });

  // Calculate total number of published and draft posts
  const publishedCount = blogData.filter(
    (blog) => blog.status === "Published"
  ).length;
  const draftCount = blogData.filter((blog) => blog.status === "Draft").length;

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const ActionMenu = ({ id }) => (
    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border">
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600">
        <span className="text-lg">✎</span> Edit
      </button>
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
        <span>📄</span> Add to draft
      </button>
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600">
        <span>🗑</span> Delete
      </button>
    </div>
  );

  const SortMenu = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
        Newest First
      </button>
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
        Oldest First
      </button>
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
        Alphabetical (A-Z)
      </button>
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
        Alphabetical (Z-A)
      </button>
    </div>
  );

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (showCreateBlog) {
    return <CreateBlog onBack={() => setShowCreateBlog(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <button
          onClick={() => setShowCreateBlog(true)}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          + CREATE A NEW POST
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "all" ? "bg-orange-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
            >
              All Post ({blogData.length})
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "published"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("published");
                setCurrentPage(1);
              }}
            >
              Published ({publishedCount})
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "draft"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("draft");
                setCurrentPage(1);
              }}
            >
              Draft ({draftCount})
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg"
            >
              <FiBarChart2 /> Sort by
            </button>
            {showSortMenu && <SortMenu />}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium text-gray-500">
                  Title
                </th>
                <th className="text-left py-4 px-4 font-medium text-gray-500">
                  Date
                </th>
                <th className="text-left py-4 px-4 font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-medium text-gray-500">
                  Total views
                </th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((blog) => (
                <tr key={blog.id} className="border-b">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{blog.title}</h3>
                        <p className="text-gray-500">by {blog.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{blog.date}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        blog.status === "Published"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FiBarChart2 className="text-blue-500" />
                      <span>{blog.views}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 relative">
                    <button
                      onClick={() => handleActionClick(blog.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {showActionMenu === blog.id && <ActionMenu id={blog.id} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination />
      </div>
    </div>
  );
};

export default MainBlog;
