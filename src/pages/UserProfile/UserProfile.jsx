import "./UserProfile.scss";
import { IoCopyOutline } from "react-icons/io5";

const UserProfile = () => {
  return (
    <div className="userProfile">
      <div className="left">
        <div className="top">
          <div className="profile">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <div className="details">
            <p>Hello,</p>
            <p>Sara K</p>
          </div>
        </div>
        <div className="bottom">
          <div className="item">My Coupons</div>
          <div className="item">Cashback & Giveback</div>
          <div className="item">Account Settings</div>
        </div>
      </div>

      <div className="right">
        <div className="availableCoupons">
          <h1>Available Coupons</h1>
          <div className="coupon">
            <div className="top">
              <p className="title">Pizza Hut</p>
              <p>15 Jun, 2024</p>
            </div>
            <div className="bottom">
              <p className="desc">
                Enjoy 25% Off In-Store Purchases + 1% Cashback at Shoppiness
                Mart!
              </p>
              <div className="code">
                Coupon code - #878583
                <IoCopyOutline />
              </div>
            </div>
          </div>

          <div className="coupon">
            <div className="top">
              <p className="title">Pizza Hut</p>
              <p>15 Jun, 2024</p>
            </div>
            <div className="bottom">
              <p className="desc">
                Enjoy 25% Off In-Store Purchases + 1% Cashback at Shoppiness
                Mart!
              </p>
              <div className="code">
                Coupon code - #878583
                <IoCopyOutline />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
