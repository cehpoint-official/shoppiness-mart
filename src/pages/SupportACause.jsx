import { useState, useCallback, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Components/Loader/Loader";
import FAQ from "../Components/FAQ";
import PeopleSaySection from "../Components/PeopleSaySection";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import supportACause from "../assets/supportACause.png";
import charitiesImg from "../assets/RegisterBusiness/charities.png";
import supportPage1 from "../assets/supportPage1.png";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const SupportACause = () => {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [ngos, setNgos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCauses, setShowAllCauses] = useState(false);
  const causesPerPage = 6;

  // Fetch data from Firestore
  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "causeDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.status === "Active") {
          data.push({ id: doc.id, ...shopData });
        }
      });
      setNgos(data);
      setLoading(false);
    } catch (error) {
      console.log("Error getting documents: ", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setSearching(true);
    setSearchResults(null);

    setTimeout(() => {
      const results = ngos.filter((ngo) =>
        ngo.causeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setSearching(false);
    }, 1000);
  };
  // Get current causes for pagination
  const indexOfLastCause = currentPage * causesPerPage;
  const indexOfFirstCause = indexOfLastCause - causesPerPage;
  const currentCauses = ngos.slice(indexOfFirstCause, indexOfLastCause);
  const totalPages = Math.ceil(ngos.length / causesPerPage);

  // Toggle between paginated view and showing all causes
  const handleViewToggle = () => {
    setShowAllCauses(!showAllCauses);
    setCurrentPage(1); // Reset to first page when toggling
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="overflow-hidden">
      {/* Search Section */}
      <div className="flex flex-wrap justify-evenly py-10 px-3">
        {!searching && !searchResults ? (
          <>
            <div className="md:pt-10 text-center md:text-left">
              <h3 className="md:text-4xl text-2xl font-bold font-slab">
                Explore our list of good causes and
              </h3>
              <h3 className="md:text-4xl text-2xl pb-3 pt-2 font-bold font-slab">
                NGOs that need your support.
              </h3>
              <p className="text-sm">Choose the one you want to support</p>
              <div className="py-5 space-y-4">
                <input
                  className="md:w-[80%] w-[70%] border-2 border-grey-500 text-sm ps-3 py-2.5 rounded-md"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name of the cause or NGO you want to support.."
                />
                <button
                  className="bg-teal-500 text-white font-medium rounded-md py-2.5 px-8 ml-1"
                  onClick={handleSearch}
                >
                  Find
                </button>
              </div>
              <p className="text-sm">
                You can also{" "}
                <Link
                  to="/cause-form"
                  className="text-teal-500 underline decoration-1  	"
                >
                  Register your own cause/NGO
                </Link>
              </p>
            </div>
            <div>
              <img
                className="w-[451px] h-[451px]"
                src={supportACause}
                alt="Loading..."
              />
            </div>
          </>
        ) : (
          <div className="w-full">
            {searching ? (
              <div className="flex justify-center items-center py-10">
                <Loader />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 px-10">
                  <button
                    onClick={() => {
                      setSearchResults(null);
                      setSearchTerm("");
                    }}
                    className="text-teal-500 flex items-center gap-2"
                  >
                    <span>← Back to Search</span>
                  </button>
                </div>
                <div className="grid gap-6 ">
                  {searchResults && searchResults.length > 0 ? (
                    searchResults.map((ngo) => (
                      <div
                        key={ngo.id}
                        className="max-w-7xl mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12"
                      >
                        <div className="flex-1 flex flex-col gap-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={ngo.logoUrl || "/placeholder.jpg"}
                              alt={ngo.causeName}
                              className="w-12 h-12"
                            />
                            <h1 className="text-[#1a365d] text-3xl font-serif">
                              {" "}
                              {ngo.causeName}
                            </h1>
                          </div>

                          <div className="flex items-center gap-2 text-[#2c5282]">
                            <MdLocationOn className="text-xl" />
                            <span>{ngo.location}</span>
                          </div>
                          <Link
                            to={`/support/${ngo.id}`}
                            className="text-teal-500 hover:text-teal-700 font-medium flex items-center group"
                          >
                            Learn more & Support
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </Link>
                          <p className="text-gray-600 leading-relaxed">
                            {ngo.shortDesc}
                          </p>

                          <Link
                            to="/login/user"
                            className="w-fit px-8 py-4 bg-[#00875a] hover:bg-[#006c46] text-white rounded-md transition-colors duration-200"
                          >
                            Sign up and support this cause
                          </Link>
                        </div>

                        <div className="flex-1 order-first md:order-last">
                          <img
                            src={ngo.bannerUrl || "/placeholder.jpg"}
                            alt={ngo.causeName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <p className="text-lg text-gray-600">
                        No NGOs found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto mt-16 mb-4 bg-teal-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          How to Support a Cause
        </h3>
        <ol className="space-y-4 text-gray-700">
          <li className="flex">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center mr-3">
              1
            </span>
            <div>
              <h4 className="font-bold">Select a Cause</h4>
              <p>
                Browse through our list of causes and select one that resonates
                with you.
              </p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center mr-3">
              2
            </span>
            <div>
              <h4 className="font-bold">Shop Anywhere You Like</h4>
              <p>
                You can support any cause by shopping at any store —
                whether online or offline.
              </p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center mr-3">
              3
            </span>
            <div>
              <h4 className="font-bold">Generate a Coupon</h4>
              <p>
                Generate a coupon for the shop where you'd like to make a
                purchase.
              </p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center mr-3">
              4
            </span>
            <div>
              <h4 className="font-bold">Shop and Earn Cashback</h4>
              <p>
                Use your coupon while shopping. You'll receive cashback for your
                purchase and help support the cause.
              </p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center mr-3">
              5
            </span>
            <div>
              <h4 className="font-bold">Donate Your Cashback</h4>
              <p>
                Once you receive cashback, you can choose to donate all or part
                of it to any NGO you care about.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* All Causes Section */}
      {!searching && !searchResults && (
        <div className="py-16 px-4 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" 
                style={{ fontFamily: "'Roboto Slab', serif" }}
              >
                All Causes and NGOs
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse through our comprehensive list of verified causes and
                NGOs that are making a positive impact in communities across the
                country. Your support can make a difference.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader />
              </div>
            ) : ngos.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">
                  No causes or NGOs available at the moment.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
                  {(showAllCauses ? ngos : currentCauses).map((cause) => (
                    <div
                      key={cause.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-[0_15px_30px_rgba(4,126,114,0.2)] hover:-translate-y-1"
                    >
                      <div className="h-52 overflow-hidden">
                        <img
                          src={cause.bannerUrl}
                          alt={cause.causeName}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <img
                            src={cause.logoUrl}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
                          />
                          <h3 className="text-xl font-semibold text-gray-800">
                            {cause.causeName}
                          </h3>
                        </div>

                        <div className="flex items-center text-teal-600 text-sm mb-3">
                          <MdLocationOn className="text-xl" />
                          <span>{cause.location}</span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {cause.aboutCause}
                        </p>

                        <div className="flex justify-end">
                          <Link
                            to={`/support/${cause.id}`}
                            className="text-teal-500 hover:text-teal-700 font-medium flex items-center group"
                          >
                            Learn more & Support
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {!showAllCauses && totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <nav
                      className="inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === index + 1
                              ? "z-10 bg-teal-50 border-teal-500 text-teal-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}

                {/* View toggle button */}
                <div className="text-center mt-8">
                  <button
                    onClick={handleViewToggle}
                    className="inline-flex items-center text-teal-500 hover:text-teal-700 font-medium transition-colors duration-200"
                  >
                    {showAllCauses ? (
                      <>Show less</>
                    ) : (
                      <>
                        See all{" "}
                        <span className="font-bold mx-1">{ngos.length}+</span>{" "}
                        Causes
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Rest of the components */}
      {/* <PopularCauses /> */}

      {/* { 3rd page } */}
      {/* <div className="my-20">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2 font-slab">
            Our Popular NGOs{" "}
          </h1>
          <p className="text-sm text-parapgraphColor">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-sm text-parapgraphColor">
            Blanditiis,commodi tempora mollitia voluptatem{" "}
          </p>
        </div>

        <div className="flex justify-center gap-10 flex-wrap px-10 py-10">
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>

          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
          <div className="md:w-[400px] w-[250px]   shadow-lg rounded-lg bg-white">
            <div>
              <img
                src={supportPage1}
                alt="Loading..."
                className="md:h-[297px] h-[200px]"
              />
            </div>

            <div className="text-center p-4">
              <h3 className="md:text-xl font-semibold">Healthy Food For All</h3>
              <p className="text-teal-600 text-sm md:text-md">
                children education{" "}
              </p>
              <p className="font-medium py-2 text-sm md:text-md">
                400 Supports, 5,000000 raised
              </p>
              <p className="text-parapgraphColor md:text-md text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis,commodi tempora mollitia voluptatem recusandae
                impedit totam aperiam nesciunt doloremque magni neque placeat,
                laborum nisi eum quae voluptatum{" "}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl">
            See all <span className="font-bold">5,000 + </span> Causes{" "}
            <i className="bi bi-arrow-right"></i>{" "}
          </p>
        </div>
      </div> */}

      {/* { 4th page } */}
      <div className="bg-backgroundLightYellowColor p-10">
        <div className="text-center">
          <h1 className="md:text-3xl text-2xl font-medium mb-2 font-slab ">
            Over 5000+ NGOs and good causes are need your support
          </h1>
        </div>
        <div className="flex justify-center my-10">
          <img src={charitiesImg} alt="load.." className="w-[1000px]" />
        </div>
      </div>
      {/* { 5th page } */}
      <FAQ />
      {/* { 6th page } */}
      <PeopleSaySection />
    </div>
  );
};

export default SupportACause;
