import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import Loader from "../Components/Loader/Loader";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCopy,
  AiOutlineSave,
} from "react-icons/ai";
import { useSelector } from "react-redux";

const BusinessDetails = () => {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { category, userId, businessId } = useParams();
  const [showDialog, setShowDialog] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [generatingCoupon, setGeneratingCoupon] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [generatedCouponCode, setGeneratedCouponCode] = useState("");
  const { user } = useSelector((state) => state.userReducer);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const generateUniqueCouponCode = (businessName) => {
    const specialChars = ["#", "@", "$", "&", "*"];
    const randomSpecialChar =
      specialChars[Math.floor(Math.random() * specialChars.length)];
    const randomDigits = Math.floor(Math.random() * 90000) + 10000; // 5 digit number
    const cleanBusinessName = businessName
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .substring(0, 5);
    return `${randomSpecialChar}${cleanBusinessName}${randomDigits}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratingCoupon(true);

    try {
      // Generate unique coupon code
      const couponCode = generateUniqueCouponCode(business.businessName);
      setGeneratedCouponCode(couponCode);

      // Close form dialog and open coupon dialog
      setShowDialog(false);
      setShowCouponDialog(true);
    } catch (error) {
      toast.error("Failed to generate coupon");
      console.error("Error generating coupon:", error);
    } finally {
      setGeneratingCoupon(false);
    }
  };
  const handleCouponButtonClick = () => {
    if (!user) {
      toast.error("Please login as user to generate coupon");
      return;
    }
    setShowDialog(true);
  };
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCouponCode);
    toast.success("Coupon code copied to clipboard!");
  };

  const handleSaveCoupon = async () => {
    setSavingCoupon(true);

    try {
      await addDoc(collection(db, "coupons"), {
        ...formData,
        businessId,
        userId,
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        businessRate: business.rate,
        userCashback: business.rate / 2,
        platformEarnings: business.rate / 2,
        code: generatedCouponCode,
        businessName: business.businessName,
        userProfilePic: user.profilePic || "",
        status: "Pending",
      });

      toast.success("Coupon saved successfully!");
      setShowCouponDialog(false);
      // Reset form data
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
      });
    } catch (error) {
      toast.error("Failed to save coupon");
      console.error("Error saving coupon:", error);
    } finally {
      setSavingCoupon(false);
    }
  };
  const fetchBusinessDetails = async () => {
    try {
      const businessRef = doc(db, "businessDetails", businessId);
      const businessDoc = await getDoc(businessRef);

      if (businessDoc.exists()) {
        setBusiness({ id: businessDoc.id, ...businessDoc.data() });
      } else {
        toast.error("Business not found");
      }
    } catch (error) {
      console.error("Error getting business details: ", error);
      toast.error("Failed to load business details");
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.businessId === businessId) {
          data.push({ id: doc.id, ...doc.data() });
        }
      });
      // Add "All" category at the beginning
      setCategories([{ id: "All", name: "All" }, ...data]);
    } catch (error) {
      console.error("Error getting categories: ", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        if (productData.businessId === businessId) {
          data.push({ id: doc.id, ...productData });
        }
      });
      setProducts(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails();
      fetchCategories();
      fetchProducts();
    }
  }, [businessId]);

  // Filter products based on the selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (!business) {
    return <Loader />;
  }
  console.log(filteredProducts);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex items-start gap-6 mb-8 border p-5 rounded-xl shadow-sm">
        <div className="w-1/2 md:w-1/3">
          <div className="relative aspect-video md:aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={business.bannerUrl}
              alt={business.businessName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <img
                src={business.logoUrl}
                alt={business.businessName}
                className="w-14 h-14 rounded-full"
              />
            </div>
            <h1 className="text-xl font-semibold">{business.businessName}</h1>
          </div>

          <div className="text-gray-600 mb-2">{business.location}</div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {business.shortDesc}
          </p>
          {/* Coupon Button */}
          <div className="space-y-2 flex items-center gap-4">
            <p className="text-gray-700">Get cashback by generating Coupon</p>
            <button
              onClick={handleCouponButtonClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Generate Coupon
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border p-5 rounded-xl shadow-sm py-10 px-14">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ShopLink
              key={product.id}
              userId={userId}
              category={category}
              businessId={businessId}
              productId={product.id}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 ">₹{product.price}</span>
                  {product.discountType === "percentage" ? (
                    <span className="text-green-600 text-sm">
                      {product.discount}%
                    </span>
                  ) : (
                    <span className="text-green-600 text-sm">
                      ₹{product.discount} discount
                    </span>
                  )}
                </div>
              </div>
            </ShopLink>
          ))}
        </div>
      </div>

      {/* Form Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowDialog(false)}
              className="absolute text-3xl top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>

            <h2 className="text-center font-semibold text-lg mb-6">
              SUBMIT YOUR DETAILS AND GENERATE YOUR COUPON CODE & GET CASH BACK
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={generatingCoupon}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {generatingCoupon ? (
                  <>
                    <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Coupon"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Dialog */}
      {showCouponDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative overflow-hidden">
            <button
              onClick={() => setShowCouponDialog(false)}
              className="absolute text-3xl top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ×
            </button>
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 to-white z-10">
              <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-cyan-100 rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-20 flex flex-col items-center">
              <div className="bg-emerald-500 text-white p-6 rounded-xl w-64 relative mb-4">
                <div className="text-center">
                  <div className="text-lg opacity-90 mb-2">
                    {business.rate}%
                    <br />
                    Cashback from shoppinesssmart
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#FFDE50]">
                      {generatedCouponCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-white hover:text-white/80"
                    >
                      <AiOutlineCopy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveCoupon}
                disabled={savingCoupon}
                className="bg-green-500 text-white px-8 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                {savingCoupon ? (
                  <>
                    <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <AiOutlineSave className="w-4 h-4" />
                    Save Coupon
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetails;
const ShopLink = ({ userId, category, businessId, productId, children }) => {
  const location = useLocation();

  // Function to detect if the route is for online or offline shop
  const isOfflineShop = () => {
    return (
      location.pathname.includes("/offline-shop") ||
      (location.pathname.includes("/user-dashboard") &&
        location.pathname.includes("/offline-shop"))
    );
  };

  // Function to generate the correct path
  const getPath = () => {
    const isInDashboard = location.pathname.includes("/user-dashboard");
    const isOffline = isOfflineShop();

    if (isOffline) {
      return isInDashboard
        ? `/user-dashboard/${userId}/offline-shop/${category}/${businessId}/${productId}`
        : `/offline-shop/${category}/${businessId}/${productId}`;
    } else {
      return isInDashboard
        ? `/user-dashboard/${userId}/online-shop/${businessId}/${productId}`
        : `/online-shop/${businessId}/${productId}`;
    }
  };

  return (
    <Link to={getPath()} className="overflow-hidden">
      {children}
    </Link>
  );
};
