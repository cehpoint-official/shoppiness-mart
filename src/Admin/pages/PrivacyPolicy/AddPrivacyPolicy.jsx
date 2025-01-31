import { Link } from "react-router-dom";


const AddPrivacyPolicy = () => {
  return (
    <div>
        <div className="flex-1">
          {/*ADD FAQ QUES  */}
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-7/12">
              <Link to="/admin/shoppiness/faq">
                <button className="text-gray-500 flex items-center mb-6">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Back
                </button>
              </Link>

              <form>
                <div className="mb-4">
                  <input
                    type="text"
                    id="question"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Add title"
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    id="answer"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                    placeholder="Write policy"
                  ></textarea>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    ADD PRIVACY POLICY
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AddPrivacyPolicy;
