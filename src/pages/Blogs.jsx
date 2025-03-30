import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { collection, doc, getDocs, getDoc, updateDoc, query, where, increment, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Components/Loader/Loader";

const Blogs = () => {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  const [totalBlogs, setTotalBlogs] = useState(0);
  const modalRef = useRef(null);

  // Fetch story and blogs data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch story from content collection
        const storyDoc = await getDoc(doc(db, "content", "story"));
        if (storyDoc.exists()) {
          setStory(storyDoc.data().content);
        }

        // Fetch published blogs
        const blogsQuery = query(
          collection(db, "blogs"),
          where("status", "==", "Published"),
          orderBy("createdAt", "desc"),
          limit(blogsPerPage)
        );
        
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogsList = blogsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setBlogs(blogsList);

        // Get total number of published blogs for pagination
        const countQuery = query(
          collection(db, "blogs"),
          where("status", "==", "Published")
        );
        const countSnapshot = await getDocs(countQuery);
        setTotalBlogs(countSnapshot.docs.length);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeExpandedBlog();
      }
    };

    // Add escape key listener to close modal
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeExpandedBlog();
      }
    };

    if (expandedBlog) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      // Restore body scroll when component unmounts or modal closes
      document.body.style.overflow = "auto";
    };
  }, [expandedBlog]);

  // Handle pagination
  const fetchBlogsByPage = async (page) => {
    setLoading(true);
    const startAt = (page - 1) * blogsPerPage;
    
    try {
      const blogsQuery = query(
        collection(db, "blogs"),
        where("status", "==", "Published"),
        orderBy("createdAt", "desc"),
        limit(blogsPerPage)
      );
      
      const blogsSnapshot = await getDocs(blogsQuery);
      const blogsList = blogsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setBlogs(blogsList);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs for page:", error);
      setLoading(false);
    }
  };

  // Close expanded blog and update local views count
  const closeExpandedBlog = () => {
    if (expandedBlog) {
      setBlogs(prev => prev.map(blog => {
        if (blog.id === expandedBlog) {
          // Update views in the local state (increment by 1)
          return { ...blog, views: (blog.views || 0) + 1 };
        }
        return blog;
      }));
      setExpandedBlog(null);
    }
  };

  // Handle read more click
  const handleReadMore = async (blogId) => {
    // Update views count in Firebase
    try {
      const blogRef = doc(db, "blogs", blogId);
      await updateDoc(blogRef, {
        views: increment(1)
      });
      
      // Set expanded view
      setExpandedBlog(blogId);
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  // Get shortened content for thumbnails
  const getTruncatedContent = (content, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Our Story */}
      <div className="bg-gradient-to-r from-teal-500 to-green-500 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold text-white text-center mb-8 font-slab">
            Our Story
          </h1>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 leading-relaxed mb-6">
              {story || "Our story content is loading..."}
            </p>
            <div className="flex items-center justify-center">
              <Link to="/signup">
                <button className="bg-[#047E72] text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium text-lg shadow-md">
                  Sign Up for Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="container mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Latest Articles
        </h2>
        
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No published blogs available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div key={blog.id} className="relative">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col transform hover:-translate-y-1">
                    <div className="relative h-64">
                      <img
                        src={blog.thumbnail || "https://via.placeholder.com/800x600"}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <p className="text-white font-medium">
                          By {blog.author || "Unknown Author"}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {blog.title || "Untitled Blog"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {getTruncatedContent(blog.content)}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-medium text-gray-500">
                          {blog.views || 0} views
                        </span>
                        <button
                          onClick={() => handleReadMore(blog.id)}
                          className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2 flex-wrap">
                  <button
                    onClick={() => fetchBlogsByPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1 
                        ? "bg-gray-200 text-gray-500" 
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, totalPages)).keys()].map((page) => {
                    // Show 5 pages at most, centered around current page
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = page + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = page + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + page;
                    } else {
                      pageToShow = currentPage - 2 + page;
                    }
                    
                    return (
                      <button
                        key={pageToShow}
                        onClick={() => fetchBlogsByPage(pageToShow)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === pageToShow
                            ? "bg-teal-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => fetchBlogsByPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for expanded blog view - SMALLER SIZE */}
      {expandedBlog && (
        <div className="fixed mt-40 inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 overflow-y-auto">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto overflow-hidden"
            style={{ maxHeight: "90vh" }}
          >
            {blogs.filter(blog => blog.id === expandedBlog).map(blog => (
              <div key={blog.id} className="flex flex-col">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={blog.thumbnail || "https://via.placeholder.com/800x400"}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="px-6 py-3 overflow-y-auto" style={{ maxHeight: "calc(80vh - 12rem)" }}>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                      {blog.author?.[0] || "A"}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-800 text-xl">By {blog.author || "Unknown Author"}</p>
                      <p className="text-xs text-gray-500">{(blog.views || 0) + 1} views</p>
                    </div>
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {blog.title || "Untitled Blog"}
                  </h1>
                  
                  <div className="prose max-w-none text-gray-700 text-sm">
                    {blog.content || "No content available."}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-4 flex justify-end">
                  <button
                    onClick={closeExpandedBlog}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;