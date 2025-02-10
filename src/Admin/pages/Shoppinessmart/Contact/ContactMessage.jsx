const ContactMessage = ({ contact, onClose }) => {
  return (

      <div className="flex w-full">
        <div className="flex-1 flex flex-col">
          {/*ADD NEWSLETTER CODE  */}
          <div className="p-6 bg-gray-100 min-h-screen">
            <button
              onClick={onClose}
              className="text-lg flex items-center gap-2"
              aria-label="Go back"
            >
              ← View Message
            </button>
            <div className="p-6 bg-white rounded-lg shadow-md w-full mt-10">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <p className="mb-2">
                    <span className="font-semibold">Name:</span> {contact.name}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Email:</span>{" "}
                    {contact.email}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Subject:</span>{" "}
                    {contact.subject}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Message:</span>{" "}
                    {contact.message}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Attached file: </span>
                    <a
                      href="/path/to/document.pdf"
                      download
                      className="text-blue-500 hover:underline"
                    >
                      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-6 h-6 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-4m0 0V8m0 4h4m-4 0H8m14-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        document.pdf
                      </div>
                    </a>
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="mb-2">
                    <span className="font-semibold">Role:</span> {contact.role}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Phone:</span>{" "}
                    {contact.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default ContactMessage;
