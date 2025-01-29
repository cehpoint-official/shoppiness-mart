import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import Loader from "../Components/Loader/Loader";

const BusinessDetails = () => {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default selected category
  const { category, userId, businessId } = useParams();
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
            <Link
              to={
                location.pathname.includes("/user-dashboard")
                  ? `/user-dashboard/${userId}/offline-shop/${category}/${businessId}/${product.id}`
                  : `/offline-shop/${category}/${businessId}/${product.id}`
              }
              key={product.id}
              className="overflow-hidden"
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
                  <span className="text-green-600 text-sm">
                    {product.discount}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
