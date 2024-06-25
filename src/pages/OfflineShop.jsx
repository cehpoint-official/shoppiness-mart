import hamburger from "../assets/Shop/hamburger.png";
import gift from "../assets/Shop/gift.png";
import imaoffshop from "../assets/Shop/imaoffshop.png";
import shopcard from "../assets/Shop/shopcard.png";

const OfflineShop = () => {
  return (
    <div>
      {/* {1st Component} */}
      <div className="flex items-center justify-center gap-10 mt-10 bg-[#FCFCFC] py-2 ">
        <div>
          <p>Select Location</p>
        </div>
        <div>
          |
        </div>
        <div>
          <input
            type="text"
            placeholder="Search Name of shop,store,brand,product"
          />
        </div>
      </div>

      {/* {2nd Component} */}
      <div className="flex items-center justify-center flex-wrap gap-20 my-8">
        <div className="flex items-center flex-col">
          <div className="bg-[#F7F7F7] rounded-full p-6	">
            <img src={hamburger} alt="" className="w-12" />
          </div>

          <div>Food</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="bg-[#F7F7F7] rounded-full p-6	">
            <img src={hamburger} alt="" className="w-12" />
          </div>

          <div>Food</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="bg-[#F7F7F7] rounded-full p-6	">
            <img src={hamburger} alt="" className="w-12" />
          </div>

          <div>Food</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="bg-[#F7F7F7] rounded-full p-6	">
            <img src={hamburger} alt="" className="w-12" />
          </div>

          <div>Food</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="bg-[#F7F7F7] rounded-full p-6	">
            <img src={hamburger} alt="" className="w-12" />
          </div>

          <div>Food</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="bg-[#F7F7F7] rounded-full p-6	">
            <img src={hamburger} alt="" className="w-12" />
          </div>

          <div>Food</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="bg-[#F7F7F7] rounded-full p-6	">
            <img src={hamburger} alt="" className="w-12" />
          </div>

          <div>Food</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="bg-[#F7F7F7] rounded-full p-6	">
            <img src={hamburger} alt="" className="w-12" />
          </div>

          <div>Food</div>
        </div>
      </div>
      {/* {3nd Component} */}
      <div className="mt-20">
        <p className="text-2xl text-center font-medium">
          How do you get happiness with{" "}
          <span className="text-[#FEB546]"> Shoppiness Mart</span>
        </p>

        <div className="flex items-center justify-center flex-wrap gap-20 py-12">
          <div className="flex items-center flex-col w-24">
            <div>
              <img src={gift} alt="" className="w-20" />
            </div>

            <div>Generate a clklounpone</div>
          </div>
          <div className="flex items-center flex-col w-24">
            <div>
              <img src={gift} alt="" className="w-20" />
            </div>

            <div>Generate a clklounpone</div>
          </div>
          <div className="flex items-center flex-col w-24">
            <div>
              <img src={gift} alt="" className="w-20" />
            </div>

            <div>Generate a clklounpone</div>
          </div>
          <div className="flex items-center flex-col w-24">
            <div>
              <img src={gift} alt="" className="w-20" />
            </div>

            <div>Generate a clklounpone</div>
          </div>
          <div className="flex items-center flex-col w-24">
            <div>
              <img src={gift} alt="" className="w-20" />
            </div>

            <div>Generate a clklounpone</div>
          </div>
        </div>
      </div>
      {/* {4th Component} */}
      <div className="bg-[#FFE0CF] px-10 py-2 my-12 flex justify-around items-center flex-wrap">
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
      </div>
      {/* {5th Component} */}
      <div className="mt-20">
        <p className="text-2xl text-center font-medium">
          Popular <span className="text-[#FEB546]">Food</span> Shops close to
          you
        </p>
        <div className="flex justify-center flex-wrap items-center gap-10 mt-10">
          <div>
            <div>
              <img src={shopcard} alt="" className="w-22" />
            </div>
            <div className="mt-4">
              <p className="font-semibold text-xl">Food Station</p>
              <p className="my-2 text-lg ">Kolkata, Bow Bazar</p>
              <button className="bg-[#0059DE] text-white rounded-lg p-1 text-sm ">
                10% Cahsback
              </button>
            </div>
          </div>
          <div>
            <div>
              <img src={shopcard} alt="" className="w-22" />
            </div>
            <div className="mt-4">
              <p className="font-semibold text-xl">Food Station</p>
              <p className="my-2 text-lg ">Kolkata, Bow Bazar</p>
              <button className="bg-[#0059DE] text-white rounded-lg p-1 text-sm ">
                10% Cahsback
              </button>
            </div>
          </div>
          <div>
            <div>
              <img src={shopcard} alt="" className="w-22" />
            </div>
            <div className="mt-4">
              <p className="font-semibold text-xl">Food Station</p>
              <p className="my-2 text-lg ">Kolkata, Bow Bazar</p>
              <button className="bg-[#0059DE] text-white rounded-lg p-1 text-sm ">
                10% Cahsback
              </button>
            </div>
          </div>
          <div>
            <div>
              <img src={shopcard} alt="" className="w-22" />
            </div>
            <div className="mt-4">
              <p className="font-semibold text-xl">Food Station</p>
              <p className="my-2 text-lg ">Kolkata, Bow Bazar</p>
              <button className="bg-[#0059DE] text-white rounded-lg p-1 text-sm ">
                10% Cahsback
              </button>
            </div>
          </div>
          <div className="h-[290px] w-[80px] rounded-xl bg-[#FFC6C6]  flex items-center  text-center">
            <p className="text-center text-[#FB6767] text-lg font-semibold ">
              View More
            </p>
          </div>
        </div>
        {/* <div className="flex items-center justify-center mt-10">
          <button className="bg-black p-2 rounded-md text-white">
            View More
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default OfflineShop;
