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

  return (
    <div className="overflow-hidden">
      {/* Search Section */}
      <div className="flex flex-wrap justify-evenly py-16 px-3">
        {!searching && !searchResults ? (
          <>
            <div className="pt-10">
              <h3 className="md:text-4xl text-2xl font-bold font-slab">
                Explore our list of good causes and
              </h3>
              <h3 className="md:text-4xl text-2xl pb-3 pt-2 font-bold font-slab">
                NGOs that need your support.
              </h3>
              <p className="text-sm">Choose the one you want to support</p>
              <div className="py-5">
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
                <div className="grid md:grid-cols-3 gap-6 px-10">
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

      {/* Rest of the components */}
      <PopularCauses />

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
