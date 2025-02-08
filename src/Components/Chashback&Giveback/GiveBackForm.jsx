import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { userExist } from "../../redux/reducer/userReducer";

const GiveBackForm = () => {
  const [ngos, setNgos] = useState([]);
  const [amount, setAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null); 
  const { userId } = useParams();
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "causeDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData && shopData.causeName) {
          data.push({ id: doc.id, ...shopData });
        }
      });
      setNgos(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredNgos = ngos.filter((ngo) =>
    ngo?.causeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate NGO selection
    if (!selectedNgo) {
      return toast.error("Please select an NGO");
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error("Enter a valid Giveback amount");
    }

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return toast.error("Error fetching user data");
    }

    const userData = docSnap.data();
    const availableCashback = userData.collectedCashback || 0;

    if (Number(amount) > availableCashback) {
      return toast.error("Insufficient cashback balance");
    }

    try {
      const numAmount = Number(amount);

      // Store the giveback request
      await addDoc(collection(db, "givebackCashbacks"), {
        userId,
        userName: user.fname + " " + user.lname,
        userEmail: user.email,
        ngoName: selectedNgo.causeName,
        ngoId: selectedNgo.id,
        amount: numAmount,
        completedAt: new Date().toISOString(),
        status: "Completed", 
      });

      // Update Firestore
      await updateDoc(docRef, {
        collectedCashback: increment(-numAmount),
        givebackAmount: increment(numAmount),
      });

      // Update Redux state immediately
      const updatedUser = {
        ...user,
        collectedCashback: (user.collectedCashback || 0) - numAmount,
        givebackAmount: (user.givebackAmount || 0) + numAmount,
      };
      dispatch(userExist(updatedUser));

      toast.success(
        `Successfully transferred ₹${numAmount} to ${selectedNgo.causeName}`
      );

      // Reset form
      setAmount("");
      setSelectedNgo(null);
    } catch (error) {
      console.error("Error processing giveback:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select NGO
          </label>
          <div className="relative">
            <div
              className="w-full bg-gray-200 rounded border border-gray-300 p-2 text-sm cursor-pointer flex justify-between items-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={selectedNgo ? "text-gray-900" : "text-gray-500"}>
                {selectedNgo ? selectedNgo.causeName : "Select NGO..."}
              </span>
              <FaChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {isOpen && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                <div className="p-2 border-b border-gray-200 flex items-center gap-2">
                  <FaSearch className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    className="w-full outline-none text-sm"
                    placeholder="Search NGOs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredNgos.map((ngo, index) => (
                    <div
                      key={ngo.id || index}
                      className="p-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        setSelectedNgo(ngo); // Store full NGO object
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      {ngo.causeName}
                    </div>
                  ))}
                  {filteredNgos.length === 0 && (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Enter Amount
          </label>
          <input
            type="text"
            placeholder="Enter giveback amount"
            className="w-full bg-gray-200 rounded border border-gray-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Give Back
        </button>
      </form>
    </div>
  );
};

export default GiveBackForm;
