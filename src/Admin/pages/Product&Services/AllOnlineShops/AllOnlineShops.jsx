import { useCallback, useEffect, useState } from "react";
import ListedProducts from "../../../components/AllOnlineshops/ListedProducts";
import ShopRequests from "../../../components/AllOnlineshops/ShopRequests";
import ShopDetails from "../../../components/AllOnlineshops/ShopDetails";
import toast from "react-hot-toast";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../../firebase";

const AllOnlineShops = () => {
  const [selectedShop, setSelectedShop] = useState(null);
  const [showListedProducts, setShowListedProducts] = useState(false);
  const [onlineShops, setOnlineShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const onineShopData = doc.data();
        if (
          onineShopData &&
          onineShopData.mode === "Online" &&
          (onineShopData.status === "Active" ||
            onineShopData.status === "Inactive")
        ) {
          data.push({ id: doc.id, ...onineShopData });
        }
      });
      setOnlineShops(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBack = () => {
    if (showListedProducts) {
      setShowListedProducts(false);
    } else {
      setSelectedShop(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {selectedShop ? (
        showListedProducts ? (
          <ListedProducts onBack={handleBack} />
        ) : (
          <ShopDetails
            shop={selectedShop}
            onBack={handleBack}
            onListedProducts={() => setShowListedProducts(true)}
            onStatusUpdate={fetchData}
          />
        )
      ) : (
        <ShopRequests
          onViewDetails={setSelectedShop}
          onlineShops={onlineShops}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AllOnlineShops;
