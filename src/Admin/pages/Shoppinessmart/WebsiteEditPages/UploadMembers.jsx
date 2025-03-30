import { useState, useRef, useEffect } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete, AiOutlineEdit, AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "firebase/firestore";
import { storage, db } from "../../../../../firebase";

const UploadMembers = () => {
  const [memberName, setMemberName] = useState("");
  const [memberTitle, setMemberTitle] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editingMember, setEditingMember] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [members, setMembers] = useState([]);
  
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // Fetch members when component mounts
    fetchMembers();
    
    // Reset preview when editing is canceled
    if (!editingMember) {
      setPreviewUrl(null);
    } else {
      setPreviewUrl(editingMember.imageUrl);
    }
  }, [editingMember]);
  
  const fetchMembers = async () => {
    try {
      const membersRef = doc(db, "content", "members");
      const membersDoc = await getDoc(membersRef);
      
      if (membersDoc.exists()) {
        const membersData = membersDoc.data();
        setMembers(membersData.items || []);
      } else {
        // Initialize the document if it doesn't exist
        await setDoc(membersRef, { items: [] });
        setMembers([]);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error(`Failed to load members: ${error.message}`);
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && ['image/jpeg', 'image/png', 'image/gif'].includes(droppedFile.type)) {
      setFile(droppedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    } else {
      toast.error('Please select a valid image file (JPG, PNG, GIF)');
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!memberName.trim()) {
      toast.error('Member name is required');
      return;
    }
    
    if (!memberTitle.trim()) {
      toast.error('Member title is required');
      return;
    }
    
    // If we're editing and no new file is selected, just update the text fields
    if (editingMember && !file) {
      try {
        await updateMember({
          ...editingMember,
          name: memberName,
          title: memberTitle,
          bio: memberBio,
        });
        resetForm();
        toast.success('Member updated successfully');
      } catch (error) {
        toast.error(`Update failed: ${error.message}`);
      }
      return;
    }
    
    // Require file for new uploads
    if (!editingMember && !file) {
      toast.error('Please select an image file');
      return;
    }
    
    setUploading(true);
    
    try {
      // Upload file if it exists
      let imageUrl = editingMember?.imageUrl;
      
      if (file) {
        const storageRef = ref(storage, `members/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgress(progress);
            },
            (error) => {
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
        
        // If editing and we have a new image, delete the old one
        if (editingMember?.imageUrl) {
          try {
            const oldImageRef = ref(storage, editingMember.imageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error("Error deleting old image:", error);
            // Continue even if old image deletion fails
          }
        }
      }
      
      // Create/update member document
      const memberData = {
        id: editingMember?.id || Date.now().toString(),
        name: memberName,
        title: memberTitle,
        bio: memberBio,
        imageUrl,
        createdAt: editingMember?.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      
      await updateMember(memberData);
      
      toast.success(editingMember ? 'Member updated successfully' : 'Member added successfully');
      resetForm();
    } catch (error) {
      console.error("Error uploading member:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  
  const updateMember = async (memberData) => {
    const membersRef = doc(db, "content", "members");
    
    // Get current members
    const membersDoc = await getDoc(membersRef);
    
    if (membersDoc.exists()) {
      const currentMembers = membersDoc.data().items || [];
      
      if (editingMember) {
        // Update existing member
        const updatedMembers = currentMembers.map(member => 
          member.id === memberData.id ? memberData : member
        );
        
        await updateDoc(membersRef, {
          items: updatedMembers
        });
      } else {
        // Add new member
        await updateDoc(membersRef, {
          items: arrayUnion(memberData)
        });
      }
    } else {
      // Create the document with the first member
      await setDoc(membersRef, {
        items: [memberData]
      });
    }
    
    // Refresh members list
    await fetchMembers();
  };
  
  const handleEdit = (member) => {
    setEditingMember(member);
    setMemberName(member.name);
    setMemberTitle(member.title);
    setMemberBio(member.bio || "");
    setPreviewUrl(member.imageUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handleDelete = async (member) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }
    
    try {
      // Delete image from storage
      if (member.imageUrl) {
        try {
          const imageRef = ref(storage, member.imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Error deleting image:", error);
          // Continue even if image deletion fails
        }
      }
      
      // Remove member from Firestore
      const membersRef = doc(db, "content", "members");
      
      await updateDoc(membersRef, {
        items: arrayRemove(member)
      });
      
      toast.success('Member deleted successfully');
      
      // Refresh members list
      await fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error(`Delete failed: ${error.message}`);
    }
  };
  
  const resetForm = () => {
    setMemberName("");
    setMemberTitle("");
    setMemberBio("");
    setFile(null);
    setPreviewUrl(null);
    setEditingMember(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {editingMember ? "Edit Team Member" : "Add Team Member"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team member name"
                disabled={uploading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title/Position</label>
              <input
                type="text"
                value={memberTitle}
                onChange={(e) => setMemberTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter member title (e.g., CEO, Designer)"
                disabled={uploading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
              <textarea
                value={memberBio}
                onChange={(e) => setMemberBio(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Brief description about the team member"
                disabled={uploading}
              />
            </div>
          </div>
          
          {/* Right side - Image upload */}
          <div>
            <div
              className="border bg-white shadow-md rounded-lg p-8 text-center h-full flex flex-col"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {previewUrl ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Member preview"
                      className="max-h-[200px] max-w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-500 hover:bg-red-200"
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{file ? file.name : "Current image"}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 flex-1 justify-center">
                  <AiOutlineCloudUpload className="text-4xl text-gray-400" />
                  <div>
                    <p className="font-medium">Drag and Drop</p>
                    <p className="text-gray-500">Or</p>
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif"
                      disabled={uploading}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Please upload an image (JPG, PNG, GIF)<br />
                    Maximum file size: 5MB
                  </p>
                </div>
              )}
              
              {uploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Uploading: {progress}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          {editingMember && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              disabled={uploading}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center min-w-[100px]"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>{editingMember ? "Update" : "Save"}</>
            )}
          </button>
        </div>
      </form>
      
      {/* Member List */}
      {members && members.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-lg font-medium mb-4">Team Members</h3>
          <div className="bg-white border rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{member.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <AiOutlineEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 text-center rounded-lg border mt-8">
          <p className="text-gray-500">No team members added yet.</p>
        </div>
      )}
    </div>
  );
};

export default UploadMembers;