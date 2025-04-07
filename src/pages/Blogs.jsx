import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Components/Loader/Loader";
import {
  BookOpen,
  Clock,
  Eye,
  ArrowRight,
  Calendar,
} from "lucide-react";


const Blogs = () => {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  const [totalBlogs, setTotalBlogs] = useState(0);

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
          orderBy("createdAt", "desc")
        );

        const blogsSnapshot = await getDocs(blogsQuery);
        const blogsList = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate slice for current page
        const startIndex = (currentPage - 1) * blogsPerPage;
        const endIndex = startIndex + blogsPerPage;
        setBlogs(blogsList.slice(startIndex, endIndex));
        setTotalBlogs(blogsList.length);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Handle pagination
  const fetchBlogsByPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {/* Enhanced Hero Section with Our Story */}
      <div className="relative overflow-hidden bg-[#047E72]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#047E72]/95 to-[#047E72]/80 z-10"></div>
        <div className="absolute inset-0">
          <svg
            className="absolute bottom-0 left-0 right-0 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="container relative z-20 mx-auto px-6 py-24 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                <BookOpen className="h-4 w-4 mr-2" /> Our Journey
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Our Story <span className="block">of Impact</span>
              </h1>
              <div className="h-1 w-20 bg-white rounded"></div>
              <p className="text-white/90 text-lg leading-relaxed">
                Join us in creating a world where every purchase contributes to
                a greater cause and shopping becomes an act of kindness.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-[#047E72] hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Join Our Movement
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
              <h3 className="text-[#047E72] font-semibold text-lg mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {story || "Our story content is loading..."}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1 text-[#047E72]" />
                  <span>Est. 2023</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-[#047E72]" />
                  <span>1,000+ Causes Supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="container mx-auto py-16 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Latest Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of thought-provoking articles on how shopping
            with purpose can transform lives and communities.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No published blogs available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div key={blog.id} className="group">
                  <Link to={`/blogs/${blog.id}`} className="block h-full">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col transform group-hover:-translate-y-1">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={
                            blog.thumbnail ||
                            "https://via.placeholder.com/800x600"
                          }
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#047E72]/90 text-white text-xs px-3 py-1 rounded-full">
                            Article
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center text-white">
                            <Clock className="h-4 w-4 mr-1" />
                            <p className="text-sm">{blog.date || "No date"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#047E72] transition-colors">
                          {blog.title || "Untitled Blog"}
                        </h3>
                        <p className="text-gray-600 mb-4 flex-grow">
                          {getTruncatedContent(blog.content)}
                        </p>
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-[#047E72] flex items-center justify-center text-white font-medium text-sm">
                              {blog.author ? blog.author[0].toUpperCase() : "A"}
                            </div>
                            <span className="ml-2 text-sm text-gray-700">
                              {blog.author || "Unknown"}
                            </span>
                          </div>
                          <span className="flex items-center text-sm text-gray-500">
                            <Eye className="h-4 w-4 mr-1" />
                            {blog.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2 flex-wrap">
                  <button
                    onClick={() =>
                      fetchBlogsByPage(Math.max(1, currentPage - 1))
                    }
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
                    onClick={() =>
                      fetchBlogsByPage(Math.min(totalPages, currentPage + 1))
                    }
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
    </div>
  );
};

export default Blogs;
