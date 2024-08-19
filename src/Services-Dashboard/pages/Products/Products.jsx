import "./Products.scss"
import { IoMdMore } from "react-icons/io";
const Products = () => {
  return (
    <div className='products'>
      <div className="top-section">
        <div className="title">Add product/Service</div>
        <div className="buttons">
          <button>+Add Category</button>
          <button>+Add New</button>
        </div>
      </div>
      <div className="bottom-section">
        <div className="product">
          <div className="sec-1">
            <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <div className="sec-2">
            <p>Hair cutting service</p>
            <div className="price-sec">
              <p>$500</p>
              <p>20% off</p>
            </div>
          </div>
          <div className="sec-3">
            <p>Created On</p>
            <p>20/05/2024</p>
          </div>
          <div className="sec-4">
            <p>Catagory</p>
            <p>Cosmetic</p>
          </div>
          <div className="sec-5">
            <p>Status</p>
            <p>Active</p>
          </div>
          <div className="sec-6">
            <p>Action</p>
            <div className="more">
            <IoMdMore />
            </div>
          </div>
        </div>


        <div className="product">
          <div className="sec-1">
            <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <div className="sec-2">
            <p>Hair cutting service</p>
            <div className="price-sec">
              <p>$500</p>
              <p>20% off</p>
            </div>
          </div>
          <div className="sec-3">
            <p>Created On</p>
            <p>20/05/2024</p>
          </div>
          <div className="sec-4">
            <p>Catagory</p>
            <p>Cosmetic</p>
          </div>
          <div className="sec-5">
            <p>Status</p>
            <p>Active</p>
          </div>
          <div className="sec-6">
            <p>Action</p>
            <div className="more">
            <IoMdMore />
            </div>
          </div>
        </div>


        <div className="product">
          <div className="sec-1">
            <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <div className="sec-2">
            <p>Hair cutting service</p>
            <div className="price-sec">
              <p>$500</p>
              <p>20% off</p>
            </div>
          </div>
          <div className="sec-3">
            <p>Created On</p>
            <p>20/05/2024</p>
          </div>
          <div className="sec-4">
            <p>Catagory</p>
            <p>Cosmetic</p>
          </div>
          <div className="sec-5">
            <p>Status</p>
            <p>Active</p>
          </div>
          <div className="sec-6">
            <p>Action</p>
            <div className="more">
            <IoMdMore />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products