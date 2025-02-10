

const AddFaq = ({ onBack }) => {
  return (
    <div>
      <div className="flex">
        <div className="flex-1 flex flex-col">
          {/*ADD FAQ QUES  */}
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-7/12">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-2xl hover:text-gray-700"
              >
                ← Back
              </button>

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
