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

const Supporters = ({ onBack, givebacks,donationTransactions }) => {
 // Use a combined set of emails for deduplication
 const allSupporterEmails = new Set();
  
 // Add all giveback emails regardless of status
 givebacks.forEach(item => {
   if (item.userEmail) {
     allSupporterEmails.add(item.userEmail.toLowerCase());
   }
 });

 // Add all donation transaction emails regardless of status
 donationTransactions.forEach(transaction => {
   if (transaction.customerEmail) {
     allSupporterEmails.add(transaction.customerEmail.toLowerCase());
   }
 });

 const totalSupporters = allSupporterEmails.size;

 // New supporters (combined from both sources and unique by email)
 const uniqueSupporters = new Map(); // Using Map to track by email

 // Process all givebacks for supporters
 givebacks.forEach(item => {
   if (!item.userEmail) return;
   
   const email = item.userEmail.toLowerCase();
   const date = new Date(item.paidAt || item.requestedAt);
   
   if (!uniqueSupporters.has(email) || date > uniqueSupporters.get(email).date) {
     uniqueSupporters.set(email, {
       email: item.userEmail,
       name: item.userName,
       image: item.userPic,
       date: date,
       source: "giveback"
     });
   }
 });

 // Process all donation transactions for supporters
 donationTransactions.forEach(item => {
   if (!item.customerEmail) return;
   
   const email = item.customerEmail.toLowerCase();
   const date = new Date(item.paymentDate);
   
   if (!uniqueSupporters.has(email) || date > uniqueSupporters.get(email).date) {
     uniqueSupporters.set(email, {
       email: item.customerEmail,
       name: item.customerName,
       image: item.userProfilePic,
       date: date,
       source: "donation"
     });
   }
 });

 // Convert to array, sort by date, and take top 4
 const newSupporters = Array.from(uniqueSupporters.values())
   .sort((a, b) => b.date - a.date)

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