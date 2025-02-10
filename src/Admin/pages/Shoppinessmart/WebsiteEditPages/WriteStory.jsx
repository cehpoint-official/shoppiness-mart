const WriteStory = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">About Us / Write the story of this platform</h2>
      <div className="border bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Write the story of this platform</h3>
          <button className="text-blue-500 hover:text-blue-600 px-4 py-2 border rounded">
            Edit
          </button>
        </div>
        <div className="prose max-w-none bg-gray-50 py-10 px-6 rounded-xl h-[250px]">
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Elementum quis consequat at facilisis id fermentum ut. Fringilla 
            pellentesque in tellus urna erat fames id faucibus. Nulla congue euismod elementum mauris sapien eleifend. 
            Tincidunt consectetur tellus diam quam dignissim commodo venenatis.
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteStory;