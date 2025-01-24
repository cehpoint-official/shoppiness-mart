import { useState } from "react"

const AddProduct = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    discountType: "",
    discount: "",
    description: "",
    image: null,
  })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formData)
  }

  return (
    <div className="p-10 mt-[30px] flex flex-col gap-[30px]">
      <button onClick={onBack} className="flex items-center gap-2 text-2xl hover:text-gray-700">
        ← Back
      </button>

      <div className="bg-white rounded-[20px] p-8">
        <h1 className="text-2xl mb-8 text-center">Add Product/Service</h1>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-24 max-w-7xl mx-auto">
          <div className="w-full md:w-[300px] flex flex-col gap-4">
            <div className="bg-gray-100 rounded-lg aspect-square flex flex-col items-center justify-center">
              {formData.image ? (
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center">
              (Upload your Item image,
              <br />
              Format - jpg, png,jpeg ; )
            </p>
            <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 text-center">
              Upload
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Product/Service Name</label>
              <input
                type="text"
                placeholder="Add name"
                className="border rounded-md p-2"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Price</label>
              <input
                type="text"
                placeholder="Add price"
                className="border rounded-md p-2"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Select Category</label>
              <select
                className="border rounded-md p-2 appearance-none bg-white"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select one</option>
                <option value="Cosmetic">Cosmetic</option>
                <option value="Hair">Hair</option>
                <option value="Skin">Skin</option>
              </select>
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Discount Type</label>
              <select
                className="border rounded-md p-2 appearance-none bg-white"
                value={formData.discountType}
                onChange={(e) => setFormData((prev) => ({ ...prev, discountType: e.target.value }))}
              >
                <option value="">Select one</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-center gap-4">
              <label className="text-gray-600">Discount</label>
              <input
                type="text"
                placeholder="Add discount"
                className="border rounded-md p-2"
                value={formData.discount}
                onChange={(e) => setFormData((prev) => ({ ...prev, discount: e.target.value }))}
              />
            </div>

            <div className="grid md:grid-cols-[200px,1fr] items-start gap-4">
              <label className="text-gray-600">Product Description</label>
              <textarea
                placeholder="Explain about your item"
                className="border rounded-md p-2 h-[100px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex  mt-4">
              <button
                type="submit"
                className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
              >
                Add new Product/Service
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct

