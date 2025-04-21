import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CreateBlog from "./CreateBlog";
import { db, storage } from '../../../../../firebase';

const MainBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Fetch blogs from Firebase
  useEffect(() => {
    fetchBlogs();
  }, [sortOrder]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let q;
      switch (sortOrder) {
        case "newest":
          q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
          break;
        case "oldest":
          q = query(collection(db, "blogs"), orderBy("createdAt", "asc"));
          break;
        case "az":
          q = query(collection(db, "blogs"), orderBy("title", "asc"));
          break;
        case "za":
          q = query(collection(db, "blogs"), orderBy("title", "desc"));
          break;
        default:
          q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      }

      const querySnapshot = await getDocs(q);
      const blogData = [];
      querySnapshot.forEach((doc) => {
        blogData.push({ id: doc.id, ...doc.data() });
      });
      setBlogs(blogData);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new blog
  const createBlog = async (blogData, thumbnail) => {
    try {
      // Upload thumbnail to Firebase Storage
      let thumbnailUrl = "/placeholder.svg?height=80&width=80";

      if (thumbnail) {
        const storageRef = ref(storage, `blog-thumbnails/${Date.now()}-${thumbnail.name}`);
        await uploadBytes(storageRef, thumbnail);
        thumbnailUrl = await getDownloadURL(storageRef);
      }

      // Format date
      const today = new Date();
      const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}, ${today.getFullYear()}`;

      // Validate blog data
      if (!blogData.title || !blogData.author || !blogData.content) {
        throw new Error("Title, author, and content are required");
      }

      // Create blog document
      await addDoc(collection(db, "blogs"), {
        title: blogData.title,
        author: blogData.author,
        content: blogData.content,
        date: formattedDate,
        status: blogData.status || "Draft",
        views: 0,
        thumbnail: thumbnailUrl,
        createdAt: serverTimestamp()
      });

      // Refresh blogs
      fetchBlogs();
      return true;
    } catch (err) {
      console.error("Error creating blog:", err);
      setError(err.message);
      return false;
    }
  };

  // Edit a blog
  const editBlog = async (id, blogData, thumbnail) => {
    try {
      const blogRef = doc(db, "blogs", id);

      // Upload new thumbnail if provided
      let updateData = { ...blogData };

      if (thumbnail) {
        const storageRef = ref(storage, `blog-thumbnails/${Date.now()}-${thumbnail.name}`);
        await uploadBytes(storageRef, thumbnail);
        updateData.thumbnail = await getDownloadURL(storageRef);
      }

      // Validate blog data
      if (!updateData.title || !updateData.author) {
        throw new Error("Title and author are required");
      }

      await updateDoc(blogRef, updateData);
      fetchBlogs();
      return true;
    } catch (err) {
      console.error("Error updating blog:", err);
      setError(err.message);
      return false;
    }
  };

  // Delete a blog
  const deleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      fetchBlogs();
      return true;
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError(err.message);
      return false;
    }
  };

  // Change blog status
  const changeStatus = async (id, newStatus) => {
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, { status: newStatus });
      fetchBlogs();
    } catch (err) {
      console.error("Error updating blog status:", err);
      setError(err.message);
    }
  };

  const handleActionClick = (id) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setShowSortMenu(false);
  };

  // Filter data based on active tab
  const filteredData = blogs.filter((blog) => {
    if (activeTab === "all") return true;
    return blog.status.toLowerCase() === activeTab;
  });

  // Calculate total number of published and draft posts
  const publishedCount = blogs.filter(
    (blog) => blog.status === "Published"
  ).length;
  const draftCount = blogs.filter((blog) => blog.status === "Draft").length;

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (blog) => {
    setBlogToEdit(blog);
    setShowCreateBlog(true);
    setShowActionMenu(null);
  };

  const ActionMenu = ({ id }) => (
    <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border bg-white shadow-lg sm:right-0">
      <button
        onClick={() => handleEditClick(blogs.find(blog => blog.id === id))}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-blue-600 hover:bg-gray-50"
      >
        <span className="text-lg">✎</span> Edit
      </button>
      <button
        onClick={() => {
          const blog = blogs.find(blog => blog.id === id);
          changeStatus(id, blog.status === "Published" ? "Draft" : "Published");
          setShowActionMenu(null);
        }}
        className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
      >
        <span>📄</span>
        {blogs.find(blog => blog.id === id)?.status === "Published" ? "Move to Draft" : "Publish"}
      </button>
      <button
        onClick={() => {
          deleteBlog(id);
          setShowActionMenu(null);
        }}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-gray-50"
      >
        <span>🗑</span> Delete
      </button>
    </div>
  );

  const SortMenu = () => (
    <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border bg-white shadow-lg">
      <button
        onClick={() => handleSortChange("newest")}
        className="w-full px-4 py-2 text-left hover:bg-gray-50"
      >
        Newest First
      </button>
      <button
        onClick={() => handleSortChange("oldest")}
        className="w-full px-4 py-2 text-left hover:bg-gray-50"
      >
        Oldest First
      </button>
      <button
        onClick={() => handleSortChange("az")}
        className="w-full px-4 py-2 text-left hover:bg-gray-50"
      >
        Alphabetical (A-Z)
      </button>
      <button
        onClick={() => handleSortChange("za")}
        className="w-full px-4 py-2 text-left hover:bg-gray-50"
      >
        Alphabetical (Z-A)
      </button>
    </div>
  );

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
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
            className={`rounded px-3 py-1 ${
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
              className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
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
          className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  // Mobile-friendly blog card component with overflow fixes
  const BlogCard = ({ blog }) => (
    <div className="mb-4 rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 max-w-[80%]">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-medium truncate">{blog.title}</h3>
            <p className="text-sm text-gray-500 truncate">by {blog.author}</p>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => handleActionClick(blog.id)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <BsThreeDotsVertical />
          </button>
          {showActionMenu === blog.id && <ActionMenu id={blog.id} />}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-gray-500">Date:</p>
          <p className="text-sm">{blog.date}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status:</p>
          <span
            className={`inline-block rounded-full px-2 py-1 text-xs ${
              blog.status === "Published"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100"
            }`}
          >
            {blog.status}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Views:</p>
          <div className="flex items-center gap-1 text-sm">
            <FiBarChart2 className="text-blue-500" />
            <span>{blog.views}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (showCreateBlog) {
    return (
      <CreateBlog
        onBack={() => {
          setShowCreateBlog(false);
          setBlogToEdit(null);
        }}
        onSubmit={createBlog}
        onEdit={editBlog}
        blogToEdit={blogToEdit}
      />
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Blog</h1>
        <button
          onClick={() => setShowCreateBlog(true)}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 sm:px-6 sm:text-base"
        >
          + CREATE A NEW POST
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <div className="rounded-lg bg-white p-3 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab buttons with horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:gap-4 sm:pb-0">
            <button
              className={`whitespace-nowrap rounded-full px-3 py-1 text-sm sm:px-4 sm:py-2 ${
                activeTab === "all" ? "bg-orange-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
            >
              All ({blogs.length})
            </button>
            <button
              className={`whitespace-nowrap rounded-full px-3 py-1 text-sm sm:px-4 sm:py-2 ${
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
              className={`whitespace-nowrap rounded-full px-3 py-1 text-sm sm:px-4 sm:py-2 ${
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

          <div className="relative self-start">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 rounded-lg border px-3 py-1 text-sm sm:px-4 sm:py-2"
            >
              <FiBarChart2 /> Sort by
            </button>
            {showSortMenu && <SortMenu />}
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="spinner-border text-blue-500" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No blogs found. Create your first blog post!</p>
          </div>
        ) : (
          <>
            {/* Mobile view: Card-based layout */}
            <div className="sm:hidden">
              {currentItems.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* Desktop view: Table-based layout with improved title cell */}
            <div className="hidden sm:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-4 text-left font-medium text-gray-500 w-[40%]">
                        Title
                      </th>
                      <th className="px-4 py-4 text-left font-medium text-gray-500 w-[20%]">
                        Date
                      </th>
                      <th className="px-4 py-4 text-left font-medium text-gray-500 w-[15%]">
                        Status
                      </th>
                      <th className="px-4 py-4 text-left font-medium text-gray-500 w-[15%]">
                        Total views
                      </th>
                      <th className="px-4 py-4 w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((blog) => (
                      <tr key={blog.id} className="border-b">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-4 max-w-full">
                            <img
                              src={blog.thumbnail}
                              alt={blog.title}
                              className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 overflow-hidden">
                              <h3 className="font-medium truncate">{blog.title}</h3>
                              <p className="text-gray-500 truncate">by {blog.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{blog.date}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm ${
                              blog.status === "Published"
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100"
                            }`}
                          >
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FiBarChart2 className="text-blue-500" />
                            <span>{blog.views}</span>
                          </div>
                        </td>
                        <td className="relative px-4 py-4">
                          <button
                            onClick={() => handleActionClick(blog.id)}
                            className="rounded-full p-2 hover:bg-gray-100"
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
            </div>
          </>
        )}

        {blogs.length > 0 && <Pagination />}
      </div>
    </div>
  );
};

export default MainBlog;