import { useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlineSave, AiOutlineLoading3Quarters, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

const WriteStory = ({ story, updateStory }) => {
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    // Only update if we haven't loaded the story yet or if story changes externally
    if (!initialLoaded || (story !== content && !isEditing)) {
      setContent(story || "");
      setInitialLoaded(true);
    }
  }, [story, initialLoaded, isEditing, content]);

  useEffect(() => {
    // Calculate word count
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setContent(story || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Allow saving empty content to clear the story
      const success = await updateStory(content);

      if (success) {
        setIsEditing(false);
        toast.success(content.trim() ? "Story updated successfully" : "Story cleared successfully");
      }
    } catch (error) {
      console.error("Error saving story:", error);
      toast.error(`Failed to save story: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setContent("");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      setSaving(true);
      try {
        const success = await updateStory("");
        if (success) {
          setContent("");
          setIsEditing(false);
          toast.success("Story deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting story:", error);
        toast.error(`Failed to delete story: ${error.message}`);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">About Us / Our Story</h2>
        <div className="flex space-x-2">
          {!isEditing && content && (
            <button
              onClick={handleDelete}
              className="flex items-center text-red-500 hover:text-red-600 px-4 py-2 border rounded"
            >
              <AiOutlineDelete className="mr-1" /> Delete
            </button>
          )}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center text-blue-500 hover:text-blue-600 px-4 py-2 border rounded"
            >
              <AiOutlineEdit className="mr-1" /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="border bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Our Platform's Story</h3>
          <div className="text-sm text-gray-500">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[300px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your platform's story here... Tell visitors about your mission, vision, and what makes your platform special."
              disabled={saving}
            />
            <div className="text-sm text-gray-500">
              Use clear, concise language to explain your brand's story and values.
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                disabled={saving || !content.trim()}
              >
                Clear
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center min-w-[100px]"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <AiOutlineSave className="mr-1" /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none bg-gray-50 py-8 px-6 rounded-xl min-h-[250px]">
            {content ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <p className="text-gray-400 italic">No story has been added yet. Click the Edit button to add your platform's story.</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
        <h4 className="text-blue-800 font-medium mb-2">Writing Tips</h4>
        <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
          <li>Begin with your mission and values</li>
          <li>Explain the problem your platform solves</li>
          <li>Share your journey - how the platform came to be</li>
          <li>Include your vision for the future</li>
          <li>Keep it authentic and engaging</li>
        </ul>
      </div>
    </div>
  );
};

export default WriteStory;