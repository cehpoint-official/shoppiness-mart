import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const AddPrivacyPolicy = () => {
  const data = [
    {
      id: 1,
      name: "Tithi Mondal",
      date: "12 July, 2024",
      email: "tithimondal@gmail.com",
    },
    {
      id: 1,
      name: "Tithi Mondal",
      date: "12 July, 2024",
      email: "tithimondal@gmail.com",
    },
    {
      id: 1,
      name: "Tithi Mondal",
      date: "12 July, 2024",
      email: "tithimondal@gmail.com",
    },
    {
      id: 1,
      name: "Tithi Mondal",
      date: "12 July, 2024",
      email: "tithimondal@gmail.com",
    },
  ];
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />

          {/*ADD NEWSLETTER CODE  */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">News Letter</h2>
              <button className="bg-gray-200 p-2 rounded">Sort by</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200">#</th>
                    <th className="py-2 px-4 bg-gray-200">Name</th>
                    <th className="py-2 px-4 bg-gray-200">Date</th>
                    <th className="py-2 px-4 bg-gray-200">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4 text-center">{item.id}.</td>
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.date}</td>
                      <td className="py-2 px-4">{item.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrivacyPolicy;
