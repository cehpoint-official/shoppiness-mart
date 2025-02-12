
import { HiArrowLeft } from "react-icons/hi";

const SupporterRow = ({ name, email, image }) => (
  <div className="flex items-center justify-between py-4 bg-white mb-3 px-4">
    <div className="flex items-center space-x-4">
      <img
        src={image || "/placeholder.svg?height=48&width=48"}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <span className="font-medium">{name}</span>
    </div>
    <span className="text-gray-500">{email}</span>
  </div>
);
const Supporters = ({ onBack,givebacks }) => {
  const uniqueSupporters = new Set();
  const newSupporters = givebacks
    .filter((item) => item.status === "Completed")
    .sort(
      (a, b) =>
        new Date(b.paidAt || b.requestedAt) -
        new Date(a.paidAt || a.requestedAt)
    )
    .filter((item) => {
      if (!uniqueSupporters.has(item.userId)) {
        uniqueSupporters.add(item.userId);
        return true;
      }
      return false;
    })
    .slice(0, 4) // Limit to 4 unique supporters
    .map((item) => ({
      name: item.userName,
      email: item.userEmail,
      image: item.userPic,
    }));

  return (
    <div className="p-10">
      <div className="flex items-center space-x-2 mb-8">
        <button onClick={onBack} className="hover:bg-gray-100 p-2 rounded-full">
          <HiArrowLeft className="text-xl" />
        </button>
        <h2 className="text-xl">Supporters</h2>
      </div>

      <div className="divide-y p-5">
        {newSupporters.length > 0?(newSupporters.map((supporter, index) => (
          <SupporterRow key={index} {...supporter} />
        ))
        ) : (
          <p className="text-gray-600">No supporters found.</p>
        )}
      </div>
    </div>
  );
};

export default Supporters;
