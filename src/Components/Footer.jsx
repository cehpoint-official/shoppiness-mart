import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

import ShoppingBag from "../assets/ShoppingBag.png";
import Backimg13 from "../assets/backimg13.png";
import { db } from "../../firebase";

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    description: "Shoppinessmart is a platform that turns your everyday online shopping into a force for good. By simply shopping through our website or app, you can support your favorite charities without spending a penny extra.",
    phone: "+91 6368900045",
    email: "email@gmail.com"
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: null,
    instagram: null,
    twitter: null
  });

  const [latestBlogs, setLatestBlogs] = useState([]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const infoDocRef = doc(db, "contacts", "info");
        const infoDocSnap = await getDoc(infoDocRef);

        if (infoDocSnap.exists()) {
          const data = infoDocSnap.data();
          setContactInfo({
            description: data.description || contactInfo.description,
            phone: data.phone || contactInfo.phone,
            email: data.email || contactInfo.email
          });
        } else {
          console.log("No contact info document found!");
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    const fetchSocialMedia = async () => {
      try {
        const socialMediaCollection = collection(db, "socialMedia");
        const socialMediaSnapshot = await getDocs(socialMediaCollection);

        if (!socialMediaSnapshot.empty) {
          const socialData = {};

          socialMediaSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.platform && data.url) {
              socialData[data.platform.toLowerCase()] = data.url;
            }
          });

          setSocialLinks({
            facebook: socialData.facebook || null,
            instagram: socialData.instagram || null,
            twitter: socialData.twitter || null
          });
        } else {
          // console.log("No social media links found!");
        }
      } catch (error) {
        console.error("Error fetching social media links:", error);
      }
    };

    const fetchLatestBlogs = async () => {
      try {
        // Create a query to get the latest 3 blogs ordered by createdAt
        const blogsQuery = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        const blogsSnapshot = await getDocs(blogsQuery);

        if (!blogsSnapshot.empty) {
          const blogs = [];

          blogsSnapshot.forEach((doc) => {
            const data = doc.data();
            blogs.push({
              id: doc.id,
              title: data.title || "Untitled Blog",
              date: data.date || "No date"
            });
          });

          setLatestBlogs(blogs);
        } else {
          console.log("No blogs found!");
        }
      } catch (error) {
        console.error("Error fetching latest blogs:", error);
      }
    };

    fetchContactInfo();
    fetchSocialMedia();
    fetchLatestBlogs();
  }, []);

  // Social media icon renderer
  const renderSocialIcon = (platform, iconClass) => {
    const url = socialLinks[platform];

    if (url) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <i className={`${iconClass} text-xl`}></i>
        </a>
      );
    } else {
      return <i className={`${iconClass} text-xl`}></i>;
    }
  };

  // Format date function (optional, you can use this if you want to format the date)
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    try {
      // If dateString is a timestamp object
      if (dateString.toDate) {
        const date = dateString.toDate();
        return date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }

      // If dateString is already a string
      return dateString;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div>
      <div className="mx-auto bg-[#049D8E] z-10 mt-5 overflow-hidden lg:justify-center items-center py-5">
        <div className=" w-44 hidden md:block lg:block"></div>

        <div className="mx-4 flex flex-wrap lg:justify-center items-center ">
          <div className="w-full px-8 sm:w-2/3 lg:w-3/12">
            <div className=" mb-10 mt-3 w-full">
              <a href="" className="mb-6 inline-block w-full">
                <img src={ShoppingBag} alt="" className="" />
              </a>
              <p className="mb-7 text-lg text-white">
                {contactInfo.description}
              </p>
              <p className="flex items-center text-lg text-white">
                <span className="mr-3 text-[#FFD705]">Call Us:</span>
                <span>+91 {contactInfo.phone}</span>
              </p>
              <p className="flex items-center text-lg mt-4 text-white">
                <span className="mr-3 text-[#FFD705]">Email Us:</span>
                <span>{contactInfo.email}</span>
              </p>
            </div>
          </div>
          <div className="w-full px-8 sm:w-1/2 lg:w-2/12">
            <div className="mb-10 w-full mt-16">
              <h4 className="text-3xl font-semibold text-white mb-4">
                Latest Posts
              </h4>
              <ul>
                {latestBlogs.length > 0 ? (
                  latestBlogs.map((blog, index) => (
                    <li key={blog.id}>
                      <a href="/blogs" className={`mb-2 inline-block text-base text-white ${index > 0 ? 'mt-2' : ''}`}>
                        {blog.title}
                      </a>
                      <p className="text-[#FFD705] mb-4">{formatDate(blog.date)}</p>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <a href="" className="mb-2 inline-block text-xl text-white">
                        No blogs available
                      </a>
                      <p className="text-[#FFD705]">-</p>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="w-full px-8 sm:w-1/2 lg:w-2/12">
            <div className="mb-10 w-full -mt-10">
              <h4 className="mb-9 text-3xl font-semibold text-white">Links</h4>
              <ul>
                <li>
                  <Link
                    to="/"
                    className="mb-2 inline-block text-xl font-medium text-white "
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="mb-2 inline-block text-xl mt-2 font-medium text-white "
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="mb-2 inline-block text-xl font-medium mt-2 text-white "
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="mb-2 inline-block text-xl font-medium mt-2  text-white "
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="mb-2 inline-block text-xl font-medium mt-2 text-white "
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full px-8 sm:w-1/2 lg:w-1/3 ">
            <div className="mb- w-full ">
              <img src={Backimg13} alt="" className="" />
            </div>
          </div>
        </div>
      </div>

      {/* 14th page */}

      <div className="bg-[#EDF6FB] mt-3 w-full py-5 px-4 md:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#048376] text-base text-center sm:text-left">
            © {new Date().getFullYear()} UX/UI Team
          </p>

          <div className="text-[#048376] flex gap-4 order-3 sm:order-2">
            {renderSocialIcon('instagram', 'bi bi-instagram')}
            {renderSocialIcon('twitter', 'bi bi-twitter')}
            {renderSocialIcon('facebook', 'bi bi-facebook')}
          </div>

          <div className="order-2 sm:order-3">
            <p className="text-[#048376] text-base text-center sm:text-right">All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;