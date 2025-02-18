import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCopy,
  AiOutlineSave,
} from "react-icons/ai";
import { useSelector } from "react-redux";

const ProductDetails = () => {
  const { productId, businessId, userId } = useParams();
  const [business, setBusiness] = useState(null);
  const [productsDetails, setProductsDetails] = useState(null);
  const [loading, setLoading] = useState(true);
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
        productId,
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
        productName: productsDetails.name,
        userProfilePic: user.profilePic || "",
        productDiscount: productsDetails.discount,
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

  const fetchProductDetails = async () => {
    try {
      const productRef = doc(db, "productDetails", productId);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        setProductsDetails({ id: productDoc.id, ...productDoc.data() });
      } else {
        toast.error("Product not found");
      }
    } catch (error) {
      console.error("Error getting product details: ", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessDetails();
    fetchProductDetails();
  }, [productId, businessId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!productsDetails || !business) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center text-gray-600">
          Product or business not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Main Product Section */}
      <div className="border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col items-center md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-1/2 md:w-1/3">
            <div className="relative aspect-video md:aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={productsDetails.imageUrl}
                alt={productsDetails.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {productsDetails.name}
            </h1>

            <p className="text-gray-600 text-sm">
              {productsDetails.description}
            </p>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                ₹{productsDetails.price}
              </span>
              <span className="text-green-600 text-sm font-semibold">
                {productsDetails.discount}% OFF
              </span>
            </div>

            <div className="space-y-2 flex items-center gap-4">
              <p className="text-gray-700">Get cashback by generating Coupon</p>
              <button
                onClick={() => setShowDialog(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Generate Coupon
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Similar Items Section */}

      {/* <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Similar Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20045901-Iq1ztUEqoylkGY7TmYTa9tXXZxAsa5.png"
              alt="Similar Monitor 1"
              className="w-full h-48 object-contain"
            />
            <h3 className="font-medium text-sm">
              24 (60.96cm) FHD Virtually Borderless IPS..
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through text-sm">₹21000</span>
              <span className="font-bold">₹19950</span>
            </div>
          </div>

         
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20045901-Iq1ztUEqoylkGY7TmYTa9tXXZxAsa5.png"
              alt="Similar Monitor 2"
              className="w-full h-48 object-contain"
            />
            <h3 className="font-medium text-sm">
              24 (60.96cm) FHD Virtually Borderless IPS..
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through text-sm">₹21000</span>
              <span className="font-bold">₹19950</span>
            </div>
          </div>

        
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20045901-Iq1ztUEqoylkGY7TmYTa9tXXZxAsa5.png"
              alt="Similar Monitor 3"
              className="w-full h-48 object-contain"
            />
            <h3 className="font-medium text-sm">
              24 (60.96cm) FHD Virtually Borderless IPS..
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through text-sm">₹21000</span>
              <span className="font-bold">₹19950</span>
            </div>
          </div>
        </div>
      </div> */}
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
                  <div className="text-5xl font-bold mb-4">
                    {productsDetails.discount}%
                  </div>
                  <div className="text-2xl font-bold mb-1">Off</div>
                  <div className="text-sm opacity-90 mb-2">
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

export default ProductDetails;
