import { IoArrowBack } from "react-icons/io5"

const Preview = ({ onBack, data }) => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <IoArrowBack /> Back
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{data.title || "Blog Title"}</h1>
        <p className="text-gray-600 mb-6">By {data.author || "Author Name"}</p>

        {data.thumbnail && (
          <img
            src={URL.createObjectURL(data.thumbnail) || "/placeholder.svg"}
            alt="Blog thumbnail"
            className="w-full h-[400px] object-cover rounded-lg mb-6"
          />
        )}

        <div className="prose max-w-none">{data.content || "No content available"}</div>
      </div>
    </div>
  )
}

export default Preview

