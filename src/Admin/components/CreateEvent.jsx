import { useState } from 'react'

function CreateEvent({ onViewAllClick }) {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    thumbnail: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-normal">Create a New Event</h1>
        <button
          onClick={onViewAllClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          View All Events
        </button>
      </div>

      <h1 className="text-xl text-gray-600 mb-8">Create a event Schedule</h1>

      <div className="bg-white rounded-lg p-8 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={eventData.startTime}
                    onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={eventData.endTime}
                    onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Thumbnail</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">Drag & Drop or Click</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setEventData({ ...eventData, thumbnail: e.target.files[0] })}
                    accept="image/*"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Recommand size 800×500
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-right">
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
            >
              Create a Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent