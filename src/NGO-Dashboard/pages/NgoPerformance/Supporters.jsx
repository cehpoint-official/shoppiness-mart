
import { HiArrowLeft } from "react-icons/hi";

const SupporterRow = ({ name, email, imageUrl }) => (
  <div className="flex items-center justify-between py-4 bg-white mb-3 px-4">
    <div className="flex items-center space-x-4">
      <img
        src={imageUrl || "/placeholder.svg?height=48&width=48"}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <span className="font-medium">{name}</span>
    </div>
    <span className="text-gray-500">{email}</span>
  </div>
);
const Supporters = ({ onBack }) => {
  const supporters = [
    {
      name: "Aman Roy",
      email: "email@gmail.com",
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Aman Roy",
      email: "email@gmail.com",
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Aanna Willo",
      email: "email@gmail.com",
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Mariya Roy",
      email: "email@gmail.com",
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Puja Mondal",
      email: "email@gmail.com",
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Aman Roy",
      email: "email@gmail.com",
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
  ];

  return (
    <div className="p-10">
      <div className="flex items-center space-x-2 mb-8">
        <button onClick={onBack} className="hover:bg-gray-100 p-2 rounded-full">
          <HiArrowLeft className="text-xl" />
        </button>
        <h2 className="text-xl">Supporters</h2>
      </div>

      <div className="divide-y p-5">
        {supporters.map((supporter, index) => (
          <SupporterRow key={index} {...supporter} />
        ))}
      </div>
    </div>
  );
};

export default Supporters;
