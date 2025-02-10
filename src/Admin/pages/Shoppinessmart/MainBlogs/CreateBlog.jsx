import { useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import Preview from "./Preview"

const CreateBlog = ({ onBack }) => {
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    thumbnail: null,
  })

  if (showPreview) {
    return <Preview onBack={() => setShowPreview(false)} data={formData} />
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <IoArrowBack /> Back
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Create Post</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Save as Draft</button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Preview
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Published</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <label className="block mb-2">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Author</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="mb-2">⬆️</div>
              <p>Drag & Drop or Click</p>
              <p className="text-sm text-gray-500 mt-4">Recommand size 800x500</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="border rounded-lg">
            <div className="border-b p-2 flex gap-2">
              <select className="border rounded px-2">
                <option>Paragraph</option>
              </select>
              <button className="p-1 hover:bg-gray-100 rounded">B</button>
              <button className="p-1 hover:bg-gray-100 rounded">I</button>
              <button className="p-1 hover:bg-gray-100 rounded">🔗</button>
              <button className="p-1 hover:bg-gray-100 rounded">•</button>
              <button className="p-1 hover:bg-gray-100 rounded">1.</button>
              <button className="p-1 hover:bg-gray-100 rounded">⟵</button>
              <button className="p-1 hover:bg-gray-100 rounded">⟶</button>
              <button className="p-1 hover:bg-gray-100 rounded">📷</button>
              <button className="p-1 hover:bg-gray-100 rounded">" "</button>
              <button className="p-1 hover:bg-gray-100 rounded">⊞</button>
              <button className="p-1 hover:bg-gray-100 rounded">⋮</button>
              <button className="p-1 hover:bg-gray-100 rounded">↺</button>
              <button className="p-1 hover:bg-gray-100 rounded">↻</button>
            </div>
            <textarea
              className="w-full p-4 min-h-[300px] outline-none"
              placeholder="Write your Blog.."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBlog

