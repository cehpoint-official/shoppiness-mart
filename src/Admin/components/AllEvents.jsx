import { useState } from 'react'
import { MdMoreVert } from 'react-icons/md'

function AllEvents({ onBackClick }) {
  const [events] = useState([
    {
      id: 1,
      date: '05 Apr',
      title: 'Blood Donations Camp',
      time: '8:00 AM- 10 AM',
      location: 'Location: Bolpur Notunpolli,Birbhum',
      image: 'https://example.com/blood-donation.jpg'
    },
    // Add more events as needed
  ])

  const [activeDropdown, setActiveDropdown] = useState(null)

  const handleEdit = () => {
    // Handle edit logic
    setActiveDropdown(null)
  }

  const handleDelete = () => {
    // Handle delete logic
    setActiveDropdown(null)
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          onClick={onBackClick}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <span>←</span> All Events
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 text-sm">
                {event.date}
              </div>
              <div className="absolute top-2 right-2">
                <div className="relative">
                  <button 
                    className="text-gray-600 bg-slate-200 rounded-full hover:text-gray-800 p-1"
                    onClick={() => setActiveDropdown(activeDropdown === event.id ? null : event.id)}
                  >
                    <MdMoreVert size={20} />
                  </button>
                  
                  {activeDropdown === event.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => handleEdit(event.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-orange-500 mb-2">{event.time}</p>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllEvents