import { useState } from 'react'
import { IoArrowBack, IoEllipsisVertical } from 'react-icons/io5'

const productsData = [
  {
    id: 1,
    name: "Hair cutting service",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "20% Off",
    createDate: "20/05/2024",
    category: "Hair Cut",
    status: "Active"
  },
  {
    id: 2,
    name: "Facial service",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "20% Off",
    createDate: "20/05/2024",
    category: "Facial",
    status: "Active"
  },
  {
    id: 3,
    name: "Spa service",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "Cashback Rs.50",
    createDate: "20/05/2024",
    category: "SPA",
    status: "Active"
  },
  // Add more items to make 10 total
  {
    id: 4,
    name: "Massage service",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "Cashback Rs.50",
    createDate: "20/05/2024",
    category: "SPA",
    status: "Active"
  },
  {
    id: 5,
    name: "Hair coloring",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "15% Off",
    createDate: "20/05/2024",
    category: "Hair Cut",
    status: "Active"
  },
  {
    id: 6,
    name: "Manicure",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "10% Off",
    createDate: "20/05/2024",
    category: "Nail Care",
    status: "Active"
  },
  {
    id: 7,
    name: "Pedicure",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "10% Off",
    createDate: "20/05/2024",
    category: "Nail Care",
    status: "Active"
  },
  {
    id: 8,
    name: "Hair styling",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "25% Off",
    createDate: "20/05/2024",
    category: "Hair Cut",
    status: "Active"
  },
  {
    id: 9,
    name: "Deep tissue massage",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "Cashback Rs.100",
    createDate: "20/05/2024",
    category: "SPA",
    status: "Active"
  },
  {
    id: 10,
    name: "Body scrub",
    image: "https://placehold.co/100x100",
    price: 500,
    offer: "15% Off",
    createDate: "20/05/2024",
    category: "SPA",
    status: "Active"
  }
]

function ListedProducts({ onBack }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showOptionsId, setShowOptionsId] = useState(null)
  const itemsPerPage = 5
  
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = productsData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(productsData.length / itemsPerPage)

  return (
    <div className="p-6">
      <div className="py-4 flex items-center">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <IoArrowBack className="w-5 h-5 mr-2" />
          List of Products
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-md">
        <table className="w-full">
          <tbody>
            {currentItems.map(product => (
              <tr key={product.id} className="border-b last:border-b-0">
                <td className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-900">₹ {product.price}</span>
                          <span className="text-green-500">{product.offer}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div>
                        <div className="text-sm text-gray-600">Create on</div>
                        <div>{product.createDate}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600">Category</div>
                        <div>{product.category}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600">Status</div>
                        <div className="text-green-500">{product.status}</div>
                      </div>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setShowOptionsId(showOptionsId === product.id ? null : product.id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <IoEllipsisVertical className="w-6 h-6 text-gray-600" />
                        </button>
                        
                        {showOptionsId === product.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-500">
                              Mark as inactive
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} of {Math.min(indexOfLastItem, productsData.length)} of {productsData.length}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListedProducts