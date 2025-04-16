import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import charitiesImg from "../../assets/RegisterBusiness/charities.png";
import { Link } from 'react-router-dom';
import "./Support.scss"
const Support = ({num}) => {
  return (
    <div className="secSix">
      <h1>Over {num} charities and good causes need your support</h1>
      <div className="imgCon">
        <img src={charitiesImg} alt="charitiesImg" />
      </div>
      <Link className="seeAll" to="/cause">
        <div>
          See all <span className="number">{num}</span> More
        </div>
        <div>
          <LiaLongArrowAltRightSolid className="arrow" />
        </div>
      </Link>
    </div>
  );
}

export default Support