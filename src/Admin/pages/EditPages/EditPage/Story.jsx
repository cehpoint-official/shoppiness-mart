import React, { useState } from 'react';
import Navbar from '../../../components/Navbar'; // Adjust the path as necessary
import Sidebar from '../../../components/Sidebar'; // Adjust the path as necessary

const Story = () => {
  const [story, setStory] = useState('');

  const handleChange = (event) => {
    setStory(event.target.value);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <div className="p-6 bg-gray-100 flex-grow flex flex-col space-y-4">
          {/* Header Text */}
          <h1 className="text-2xl font-bold">Write Story</h1>

          {/* Story Box */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Your Story</h2>
            <textarea
              value={story}
              onChange={handleChange}
              rows="10"
              className="w-full p-2 border rounded-lg"
              placeholder="Write your story here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
