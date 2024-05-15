import "./CashbackDeals.scss";
import Carousel from "../../Components/Carousel/Carousel";
import carousel1 from "../../assets/RegisterBusiness/carousel1.png";
import {OfflineDealsData} from "../../dummydata.jsx"
import { MdOutlineArrowRightAlt } from "react-icons/md";
const CashbackDeals = () => {
  return (
    <div className="cashbackDeals">
      <div className="cashbackContainer">
        <Carousel img1={carousel1} img2={carousel1} img3={carousel1} />
        <div className="topOfflineDeals">
          <h5>Top Offline Deals</h5>
          <div className="topOfflineDealsContainer">
            {OfflineDealsData.map((i) => (
              <div className="brandCard">
                <img src={i.image} alt="loading" />
                <h6>{i.name}</h6>
                <p>{`$${i.cashback} cashback`}</p>
              </div>
            ))}
          </div>
          <div className="viewAll">
            View All Offers <MdOutlineArrowRightAlt />
          </div>
        </div>

        <div className="onlineStoreOffers">
          <h5>Best Online store Offers</h5>
          <div className="onlineStoreOffersContainer">
            {/* pending */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackDeals;
