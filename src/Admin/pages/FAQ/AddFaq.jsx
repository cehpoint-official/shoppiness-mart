import { Link } from "react-router-dom";

const AddFaq = () => {
  return (
    <div>
      <div className="flex">
        <div className="flex-1 flex flex-col">

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

              <h2 className="text-2xl font-bold text-center mb-6">ADD FAQ</h2>
              <form>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="question"
                  >
                    Add Question
                  </label>
                  <input
                    type="text"
                    id="question"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Type your question here"
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="answer"
                  >
                    Add Answer
                  </label>
                  <textarea
                    id="answer"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                    placeholder="Type your answer here"
                  ></textarea>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    ADD NEW SERVICE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFaq;
