import React, { useState } from "react";

const GiveBackForm = () => {
  return (
    <div>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-2">Select NGO</label>
          <select className="w-full bg-gray-200 rounded p-2 text-sm border-0">
            <option>Select NGO...</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Enter Amount</label>
          <input
            type="text"
            className="w-full bg-gray-200 rounded p-2 text-sm border-0"
            placeholder="Enter amount"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white rounded py-3 text-sm mt-6"
        >
          Give Back
        </button>
      </form>
    </div>
  );
};

export default GiveBackForm;
