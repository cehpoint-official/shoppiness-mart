import { useState } from "react"
import ListedProducts from "../../../components/AllOnlineshops/ListedProducts"
import ShopRequests from "../../../components/AllOnlineshops/ShopRequests"
import ShopDetails from "../../../components/AllOnlineshops/ShopDetails"


const AllOnlineShops = () => {
  const [selectedShop, setSelectedShop] = useState(null)
  const [showListedProducts, setShowListedProducts] = useState(false)

  const handleBack = () => {
    if (showListedProducts) {
      setShowListedProducts(false)
    } else {
      setSelectedShop(null)
    }
  }

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
          />
        )
      ) : (
        <ShopRequests onViewDetails={setSelectedShop} />
      )}
    </div>
  )
}

export default AllOnlineShops