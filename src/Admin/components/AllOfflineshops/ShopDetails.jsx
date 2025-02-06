import { useState } from 'react'
import { IoArrowBack, IoEllipsisVertical } from 'react-icons/io5'
import { MdVerified } from 'react-icons/md'

function ShopDetails({ shop, onBack, onListedProducts }) {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="py-4 flex items-center justify-between ">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <IoArrowBack className="w-5 h-5 mr-2" />
          View Details
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <IoEllipsisVertical className="w-6 h-6 text-gray-600" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
              <button 
                onClick={() => {
                  onListedProducts()
                  setShowOptions(false)
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                Listed Products
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                Mark as Inactive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white rounded-lg shadow-md border">
        <div className="flex items-start gap-6 mb-8">
          <img 
            src={shop.image} 
            alt={shop.name}
            className="w-48 h-48 object-cover rounded-lg"
          />
          
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <img 
                src={shop.logo} 
                alt="Logo"
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-xl font-semibold">{shop.name}</h1>
              {shop.verified && (
                <div className="bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                  <MdVerified className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">Verified</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm">{shop.category}</p>
            
            <div className="mt-6">
              <h2 className="font-medium mb-2">Description</h2>
              <p className="text-gray-600">{shop.description}</p>
            </div>
            
            <div className="mt-4">
              <h2 className="font-medium mb-2">Location</h2>
              <p className="text-gray-600">{shop.location}</p>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h2 className="font-medium mb-2">Phone Number</h2>
                <p className="text-gray-600">{shop.phone}</p>
              </div>
              <div>
                <h2 className="font-medium mb-2">Email ID</h2>
                <p className="text-gray-600">{shop.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Details Section */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">SHOP DETAILS</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Business/Services Owner Name</h3>
              <p className="font-medium">{shop.ownerName}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Shop Category</h3>
              <p className="font-medium">{shop.category}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Business/Services type</h3>
              <p className="font-medium">{shop.type}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Commission rate</h3>
              <p className="font-medium">{shop.commission}%</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Email</h3>
              <p className="font-medium">{shop.businessEmail}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">LOGO</h3>
              <img 
                src={shop.logo} 
                alt="Business Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopDetails