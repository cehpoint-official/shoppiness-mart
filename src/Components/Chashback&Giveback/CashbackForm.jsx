import { useState } from "react";

const CashbackForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-2">Select Shop</label>
          <select className="w-full bg-gray-200 rounded p-2 text-sm border-0">
            <option>Select a shop...</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Paid Amount</label>
          <input
            type="text"
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
          />
        </div>

        <div className="flex gap-5 items-center ">
          <label className="block text-sm mb-2">Upload Invoice</label>
          <div className="flex gap-2 items-center">
            <label className="bg-gray-200 text-sm px-4 py-2 rounded cursor-pointer flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div>To, STATE BANK OF INDIA XXXXX008</div>
          <button type="button" className="text-[#07B0A0] font-medium">
            CHANGE
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white rounded py-2 text-md mt-6"
        >
          Claim Cashback
        </button>
      </form>
    </div>
  );
};

export default CashbackForm;
