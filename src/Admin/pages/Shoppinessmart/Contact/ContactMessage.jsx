import { useState } from "react";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify"; // For notifications (optional)

const ContactMessage = ({ contact, onClose, db }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Format date safely
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    try {
      // Handle both Firestore Timestamp objects and regular Date objects
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Mark message as read
  const markAsRead = async () => {
    try {
      setIsProcessing(true);
      const contactRef = doc(db, "contacts", contact.id);
      await updateDoc(contactRef, {
        read: true,
        lastReadAt: serverTimestamp()
      });
      toast.success("Message marked as read");
      setIsProcessing(false);
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Failed to mark message as read");
      setIsProcessing(false);
    }
  };

  // Delete message
  const deleteMessage = async () => {
    try {
      setIsDeleting(true);
      setIsProcessing(true);
      const contactRef = doc(db, "contacts", contact.id);
      await deleteDoc(contactRef);
      toast.success("Message deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
      setIsDeleting(false);
      setIsProcessing(false);
    }
  };

  // Send reply
  const sendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty");
      return;
    }

    try {
      setIsProcessing(true);
      const contactRef = doc(db, "contacts", contact.id);
      await updateDoc(contactRef, {
        replied: true,
        replyMessage: replyMessage,
        repliedAt: serverTimestamp(),
        read: true
      });
      toast.success("Reply sent successfully");
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Message Details</h1>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={isProcessing}
          >
            Back to List
          </button>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700">From:</h3>
              <p>{contact.name || "Not provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Email:</h3>
              <p>{contact.email || "Not provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Phone:</h3>
              <p>{contact.phone || "Not provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Role:</h3>
              <p>{contact.role || "Not specified"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Date:</h3>
              <p>{formatDate(contact.timestamp)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Subject:</h3>
              <p>{contact.subject || "No subject"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Message:</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              {contact.message || "No message content"}
            </div>
          </div>

          {contact.replied && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Your Reply:</h3>
              <div className="p-4 bg-blue-50 rounded-md">
                {contact.replyMessage}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Replied on {formatDate(contact.repliedAt)}
              </p>
            </div>
          )}

          {!contact.read && (
            <div className="mb-4">
              <button 
                onClick={markAsRead}
                className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Mark as Read"}
              </button>
            </div>
          )}

          {!isReplying && !contact.replied && (
            <div className="mb-4">
              <button 
                onClick={() => setIsReplying(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                disabled={isProcessing}
              >
                Reply
              </button>
            </div>
          )}

          {isReplying && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Your Reply:</h3>
              <textarea
                className="w-full p-3 border rounded-md h-32"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                disabled={isProcessing}
              ></textarea>
              <div className="mt-2">
                <button 
                  onClick={sendReply}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Sending..." : "Send Reply"}
                </button>
                <button 
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t">
            <button 
              onClick={() => setIsDeleting(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              disabled={isProcessing}
            >
              Delete Message
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
              <p className="mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button 
                  onClick={deleteMessage}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessage;