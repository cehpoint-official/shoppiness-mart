import { FaPlus } from "react-icons/fa6";

const Payment = () => {
  return (
    <div>
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl">Payment</h1>
        <button className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/3 flex items-center justify-center gap-3">
        <FaPlus className="w-4 h-4"/>   Add Payment Method
        </button>
      </div>
    </div>
  );
};

export default Payment;
