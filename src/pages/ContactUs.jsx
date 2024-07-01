import img1 from "../assets/contactus.png";

const ContactUs = () => {
  return (
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Blanditiis,commodi tempora mollitia
        </p>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="I'm a..."
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Phone number"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Charity name"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Subject"
              className="border p-2 rounded w-full"
            />
          </div>
          <textarea
            placeholder="Message"
            className="border p-2 rounded w-full mb-4 h-32"
          ></textarea>
          <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg text-center mb-4">
            <p className="mb-2">Drag and Drop a file</p>
            <p>Or</p>
            <input type="file" className="mt-2" />
            <p className="text-gray-400 text-xs mt-2">
              Format: Image, PDF or Microsoft Office file, Size: Max of 10 MB
            </p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded w-full font-semibold">
            &#x2709; Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
