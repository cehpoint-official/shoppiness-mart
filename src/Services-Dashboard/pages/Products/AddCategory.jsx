import { useState } from "react"
import { FiEdit } from "react-icons/fi"
import { RiDeleteBinLine } from "react-icons/ri"
import { IoMdClose } from "react-icons/io"

const categories = [
  { id: 1, name: "Hair Cut" },
  { id: 2, name: "SPA" },
  { id: 3, name: "facial" },
]

const CategoryModal = ({ isOpen, onClose, editingCategory = null }) => {
  const [categoryName, setCategoryName] = useState(editingCategory?.name || "")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Category:", categoryName)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">{editingCategory ? "Update Category" : "Add a new Categorise"}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <IoMdClose size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full border rounded-md p-2 mb-6"
              autoFocus
            />

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              SAVE
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const AddCategory = ({ onBack }) => {
  const [entriesCount, setEntriesCount] = useState("10")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleEdit = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  return (
    <div className="p-10 mt-[30px] flex flex-col gap-[30px]">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-2xl hover:text-gray-700">
          ← Back
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          +Add Categorise
        </button>
      </div>

      <div className="bg-white rounded-[20px] p-8">
        <div className="flex items-center gap-2 mb-6">
          <span>Show</span>
          <select
            value={entriesCount}
            onChange={(e) => setEntriesCount(e.target.value)}
            className="border rounded px-2 py-1 w-[70px]"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium"># ↕</th>
                <th className="text-left py-4 px-4 font-medium">Category name</th>
                <th className="text-left py-4 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border hover:bg-gray-50">
                  <td className="py-4 px-4">{category.id}.</td>
                  <td className="py-4 px-4">{category.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(category)}>
                        <FiEdit size={20} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <RiDeleteBinLine size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal isOpen={isModalOpen} onClose={handleCloseModal} editingCategory={editingCategory} />
    </div>
  )
}

export default AddCategory

