const AddPrivacyPolicy = ({ onBack }) => {
  return (
    <div>
      <div className="flex-1">
        {/*ADD FAQ QUES  */}
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-8 w-7/12">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-2xl hover:text-gray-700"
            >
              ← Back
            </button>

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
