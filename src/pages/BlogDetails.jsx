import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Components/Loader/Loader";
import {
  Calendar,
  User,
  ArrowLeft,
  Eye,
} from "lucide-react";

const BlogDetails = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Get the blog document
        const blogRef = doc(db, "blogs", blogId);
        const blogDoc = await getDoc(blogRef);

        if (blogDoc.exists()) {
          const blogData = { id: blogDoc.id, ...blogDoc.data() };
          setBlog(blogData);

          // Update view count
          await updateDoc(blogRef, {
            views: increment(1),
          });
        } else {
          console.error("Blog not found");
          navigate("/blogs");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }

    // Scroll to top when blog loads
    window.scrollTo(0, 0);
  }, [blogId, navigate]);

//   const handleShare = (platform) => {
//     const url = window.location.href;
//     const title = blog?.title || "Blog post";

//     let shareUrl;
//     switch (platform) {
//       case "facebook":
//         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//           url
//         )}`;
//         break;
//       case "twitter":
//         shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//           title
//         )}&url=${encodeURIComponent(url)}`;
//         break;
//       case "linkedin":
//         shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
//           url
//         )}`;
//         break;
//       default:
//         shareUrl = null;
//     }

//     if (shareUrl) {
//       window.open(shareUrl, "_blank", "width=600,height=400");
//     }
//   };

  if (loading) {
    return <Loader />;
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
        <Link to="/blogs">
          <button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Back Button */}
      <div className="bg-[#047E72] text-white py-3">
        <div className="container mx-auto px-6">
          <Link
            to="/blogs"
            className="inline-flex items-center text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Link>
        </div>
      </div>

      {/* Blog Header */}
      <div className="relative bg-[#047E72] text-white pb-32 pt-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{blog.date || "No date"}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">
                By {blog.author || "Unknown Author"}
              </span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              <span className="text-sm">{(blog.views || 0) + 1} views</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {blog.title || "Untitled Blog"}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Featured Image */}
              <div className=" h-80 sm:h-96">
                <img
                  src={blog.thumbnail || "https://via.placeholder.com/800x400"}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-8">
                <div className="prose max-w-none lg:prose-lg text-gray-700">
                  {blog.content || "No content available."}
                </div>

                {/* Share Options */}
                {/* <div className="border-t border-gray-100 mt-10 pt-6">
                  <div className="flex flex-wrap items-center justify-between">
                    <h4 className="font-medium text-gray-800 mb-4 md:mb-0 flex items-center">
                      <Share2 className="h-4 w-4 mr-2" /> Share this article:
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                        aria-label="Share on Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Call to Action */}
            <div className="bg-[#047E72] rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">
                Ready to Make an Impact?
              </h3>
              <p className="text-white/90 text-sm mb-4">
                Join ShoppinessMart today and turn your everyday shopping into a
                force for good.
              </p>
              <Link to="/signup">
                <button className="w-full py-2 rounded font-medium bg-white text-[#047E72] hover:bg-gray-100">
                  Sign Up Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
