import { useState, useEffect } from "react";
import { FiArrowLeft, FiImage } from "react-icons/fi";

const CreateBlog = ({ onBack, onSubmit, onEdit, blogToEdit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Draft");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set form data if in edit mode
  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title || "");
      setAuthor(blogToEdit.author || "");
      setContent(blogToEdit.content || "");
      setStatus(blogToEdit.status || "Draft");
      setThumbnailPreview(blogToEdit.thumbnail || null);
    }
  }, [blogToEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!author.trim()) newErrors.author = "Author is required";
    if (!content.trim()) newErrors.content = "Content is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (blogToEdit) {
        // Edit existing blog
        const updatedBlogData = {
          title,
          author,
          content,
          status
        };
        const success = await onEdit(blogToEdit.id, updatedBlogData, thumbnail);
        if (success) onBack();
      } else {
        // Create new blog
        const newBlogData = {
          title,
          author,
          content,
          status
        };
        const success = await onSubmit(newBlogData, thumbnail);
        if (success) onBack();
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 hover:text-blue-600"
      >
        <FiArrowLeft /> Back to Blog
      </button>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">
          {blogToEdit ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>

        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border rounded-lg p-2 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter blog title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="author">
              Author
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full border rounded-lg p-2 ${
                errors.author ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">{errors.author}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full border rounded-lg p-2 min-h-[200px] ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Write your blog content here..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="thumbnail">
              Thumbnail
            </label>
            <div className="flex items-center gap-4">
              {thumbnailPreview && (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-50">
                <FiImage className="text-gray-500" />
                <span>{thumbnailPreview ? "Change Image" : "Upload Image"}</span>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={status === "Draft"}
                  onChange={() => setStatus("Draft")}
                  className="form-radio text-blue-600"
                />
                <span>Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Published"
                  checked={status === "Published"}
                  onChange={() => setStatus("Published")}
                  className="form-radio text-blue-600"
                />
                <span>Published</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Saving..."
              ) : blogToEdit ? (
                "Update Blog"
              ) : (
                "Create Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;