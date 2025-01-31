import { Link } from "react-router-dom";


const home = () => {
  const Que = [
    {
      id: 1,
      q1: "Frequently Asked Questions 1",
    },
    {
      id: 2,
      q1: "Frequently Asked Questions 2",
    },
    {
      id: 3,
      q1: "Frequently Asked Questions 3",
    },
  ];
  return (
    <div>
      <div className="flex">
        <div className="flex-1 flex flex-col">
      

          {/* FAQ QUES  */}
          <div className="p-6 bg-gray-100 flex-1">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">FAQs</h1>
                  <Link to="/admin/shoppiness/addfaq">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                      + ADD NEW FAQ
                    </button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {Que.map((faq) => (
                    <div
                      key={faq.id}
                      className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
                    >
                      <span>Frequently Asked Questions {faq.q1}</span>
                      <button className="text-blue-500">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default home;
