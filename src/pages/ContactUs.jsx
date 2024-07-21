import { useState } from "react";
import { db, storage } from "../../firebase"; // Adjust the import path as necessary
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import img1 from "../assets/contactus.png";
import Loader from "../Components/Loader/Loader";

const ContactUs = () => {
  const [loading, setLoading] = useState(true);
  setInterval(() => {
    setLoading(false);
  }, [3000]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    charity: "",
    subject: "",
    message: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fileUrl = "";
      if (formData.file) {
        const storageRef = ref(storage, `files/${formData.file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, formData.file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            () => {},
            (error) => {
              console.error(error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                fileUrl = url;
                resolve();
              });
            }
          );
        });
      }

      const docRef = await addDoc(collection(db, "contacts"), {
        ...formData,
        file: fileUrl,
        timestamp: serverTimestamp(),
      });

      console.log("Document written with ID: ", docRef.id);
      setUploading(false);
      // Reset form data
      setFormData({
        name: "",
        role: "",
        email: "",
        phone: "",
        charity: "",
        subject: "",
        message: "",
        file: null,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setUploading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="relative flex justify-center py-20 items-center min-h-screen bg-gray-100">
      <img
        src={img1}
        alt="Background"
        className="absolute left-0 top-0 h-full"
      />
      <div className="bg-white p-20 rounded-lg shadow-md w-full max-w-2xl z-10">
        <h1 className="text-3xl font-semibold font-slab text-center mb-4">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Reach out to us with any questions, suggestions, or feedback, and
          we'll get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="role"
              placeholder="I'm a..."
              value={formData.role}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="charity"
              placeholder="Charity name"
              value={formData.charity}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4 h-32"
            required
          ></textarea>
          <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg text-center mb-4">
            <p className="mb-2">Drag and Drop a file</p>
            <p>Or</p>
            <input type="file" onChange={handleFileChange} className="mt-2" />
            <p className="text-gray-400 text-xs mt-2">
              Format: Image, PDF or Microsoft Office file, Size: Max of 10 MB
            </p>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full font-semibold"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
