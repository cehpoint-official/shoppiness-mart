import { HiArrowLeft } from "react-icons/hi";

const SupporterRow = ({ name, email, image }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 bg-white mb-3 px-3 sm:px-4 rounded-lg">
    <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
      <img
        src={image || "/placeholder.svg?height=48&width=48"}
        alt={name}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
      />
      <span className="font-medium text-sm sm:text-base">{name}</span>
    </div>
    <span className="text-gray-500 text-xs sm:text-sm ml-14 sm:ml-0 truncate max-w-xs">{email}</span>
  </div>
);

const Supporters = ({ onBack, givebacks }) => {
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
    <div className="p-4 sm:p-6 md:p-10">
      <div className="flex items-center space-x-2 mb-4 sm:mb-6 md:mb-8">
        <button onClick={onBack} className="hover:bg-gray-100 p-2 rounded-full">
          <HiArrowLeft className="text-xl" />
        </button>
        <h2 className="text-lg sm:text-xl">Supporters</h2>
      </div>

      <div className="divide-y  rounded-xl">
        {newSupporters.length > 0 ? (
          newSupporters.map((supporter, index) => (
            <SupporterRow key={index} {...supporter} />
          ))
        ) : (
          <p className="text-gray-600 py-4 text-center">No supporters found.</p>
        )}
      </div>
    </div>
  );
};

export default Supporters;