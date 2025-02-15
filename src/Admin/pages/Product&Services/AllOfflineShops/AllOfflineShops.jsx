import { useCallback, useEffect, useState } from "react";
import ListedProducts from "../../../components/AllOfflineshops/ListedProducts";
import ShopDetails from "../../../components/AllOfflineshops/ShopDetails";
import ShopRequests from "../../../components/AllOfflineshops/ShopRequests";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../../firebase";
import toast from "react-hot-toast";

const AllOfflineShops = () => {
  const [selectedShop, setSelectedShop] = useState(null);
  const [showListedProducts, setShowListedProducts] = useState(false);
  const [offlineShops, setOfflineShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null); 
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const offlineShopData = doc.data();
        if (
          offlineShopData &&
          offlineShopData.mode === "Offline" &&
          (offlineShopData.status === "Active" ||
            offlineShopData.status === "Inactive")
        ) {
          data.push({ id: doc.id, ...offlineShopData });
        }
      });
      setOfflineShops(data);
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
  const handleListedProducts = (shopId) => {
    setSelectedShopId(shopId); 
    setShowListedProducts(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {selectedShop ? (
        showListedProducts ? (
          <ListedProducts onBack={handleBack} shopId={selectedShopId} /> 
        ) : (
          <ShopDetails
            shop={selectedShop}
            onBack={handleBack}
            onListedProducts={handleListedProducts} 
            onStatusUpdate={fetchData}
          />
        )
      ) : (
        <ShopRequests
          onViewDetails={setSelectedShop}
          offlineShops={offlineShops}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AllOfflineShops;
