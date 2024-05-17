import "./CashbackDeals.scss";
import Carousel from "../../Components/Carousel/Carousel";
import carousel1 from "../../assets/RegisterBusiness/carousel1.png";
import { OfflineDealsData } from "../../dummydata.jsx";
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
            <div className="itemCard">
              <img
                src="https://m.media-amazon.com/images/I/61oBDqjxreL._SX679_.jpg"
                alt="loading"
              />
              <div className="details">
                <h4>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                  impedit, omnis dicta voluptatem incidunt repudiandae
                  recusandae ratione totam eaque eum quisquam nobis, saepe nihil
                  facere iusto. Animi libero dolorum ullam illo suscipit veniam
                  veritatis expedita pariatur. Maiores voluptatem autem
                  aspernatur.
                </h4>
                <div className="offer">
                  <div className="price">
                    <h5>Offer Price</h5>
                    <p>$1599</p>
                    <p className="actual">$3999</p>
                  </div>
                  <div className="discount">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo-2000-present.jpg"
                      alt=""
                    />
                    <p>60% Off</p>
                  </div>
                </div>

                <button className="viewDetails">View Details</button>
              </div>
            </div>

            <div className="itemCard">
              <img
                src="https://m.media-amazon.com/images/I/61oBDqjxreL._SX679_.jpg"
                alt="loading"
              />
              <div className="details">
                <h4>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                  impedit, omnis dicta voluptatem incidunt repudiandae
                  recusandae ratione totam eaque eum quisquam nobis, saepe nihil
                  facere iusto. Animi libero dolorum ullam illo suscipit veniam
                  veritatis expedita pariatur. Maiores voluptatem autem
                  aspernatur.
                </h4>
                <div className="offer">
                  <div className="price">
                    <h5>Offer Price</h5>
                    <p>$1599</p>
                    <p className="actual">$3999</p>
                  </div>
                  <div className="discount">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo-2000-present.jpg"
                      alt=""
                    />
                    <p>60% Off</p>
                  </div>
                </div>

                <button className="viewDetails">View Details</button>
              </div>
            </div>

            <div className="itemCard">
              <img
                src="https://m.media-amazon.com/images/I/61oBDqjxreL._SX679_.jpg"
                alt="loading"
              />
              <div className="details">
                <h4>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                  impedit, omnis dicta voluptatem incidunt repudiandae
                  recusandae ratione totam eaque eum quisquam nobis, saepe nihil
                  facere iusto. Animi libero dolorum ullam illo suscipit veniam
                  veritatis expedita pariatur. Maiores voluptatem autem
                  aspernatur.
                </h4>
                <div className="offer">
                  <div className="price">
                    <h5>Offer Price</h5>
                    <p>$1599</p>
                    <p className="actual">$3999</p>
                  </div>
                  <div className="discount">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo-2000-present.jpg"
                      alt=""
                    />
                    <p>60% Off</p>
                  </div>
                </div>

                <button className="viewDetails">View Details</button>
              </div>
            </div>

            <div className="itemCard">
              <img
                src="https://m.media-amazon.com/images/I/61oBDqjxreL._SX679_.jpg"
                alt="loading"
              />
              <div className="details">
                <h4>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                  impedit, omnis dicta voluptatem incidunt repudiandae
                  recusandae ratione totam eaque eum quisquam nobis, saepe nihil
                  facere iusto. Animi libero dolorum ullam illo suscipit veniam
                  veritatis expedita pariatur. Maiores voluptatem autem
                  aspernatur.
                </h4>
                <div className="offer">
                  <div className="price">
                    <h5>Offer Price</h5>
                    <p>$1599</p>
                    <p className="actual">$3999</p>
                  </div>
                  <div className="discount">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo-2000-present.jpg"
                      alt=""
                    />
                    <p>60% Off</p>
                  </div>
                </div>

                <button className="viewDetails">View Details</button>
              </div>
            </div>

            <div className="itemCard">
              <img
                src="https://m.media-amazon.com/images/I/61oBDqjxreL._SX679_.jpg"
                alt="loading"
              />
              <div className="details">
                <h4>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                  impedit, omnis dicta voluptatem incidunt repudiandae
                  recusandae ratione totam eaque eum quisquam nobis, saepe nihil
                  facere iusto. Animi libero dolorum ullam illo suscipit veniam
                  veritatis expedita pariatur. Maiores voluptatem autem
                  aspernatur.
                </h4>
                <div className="offer">
                  <div className="price">
                    <h5>Offer Price</h5>
                    <p>$1599</p>
                    <p className="actual">$3999</p>
                  </div>
                  <div className="discount">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo-2000-present.jpg"
                      alt=""
                    />
                    <p>60% Off</p>
                  </div>
                </div>

                <button className="viewDetails">View Details</button>
              </div>
            </div>

            <div className="itemCard">
              <img
                src="https://m.media-amazon.com/images/I/61oBDqjxreL._SX679_.jpg"
                alt="loading"
              />
              <div className="details">
                <h4>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                  impedit, omnis dicta voluptatem incidunt repudiandae
                  recusandae ratione totam eaque eum quisquam nobis, saepe nihil
                  facere iusto. Animi libero dolorum ullam illo suscipit veniam
                  veritatis expedita pariatur. Maiores voluptatem autem
                  aspernatur.
                </h4>
                <div className="offer">
                  <div className="price">
                    <h5>Offer Price</h5>
                    <p>$1599</p>
                    <p className="actual">$3999</p>
                  </div>
                  <div className="discount">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo-2000-present.jpg"
                      alt=""
                    />
                    <p>60% Off</p>
                  </div>
                </div>

                <button className="viewDetails">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackDeals;
