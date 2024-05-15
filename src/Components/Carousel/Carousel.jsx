import "./Carousel.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({img1,img2,img3}) => {
  var settings = {
   dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="carousel">
      <Slider {...settings} className="container">
        <img src={img1} alt="loading" />
        <img src={img2} alt="loading" />
        <img src={img3} alt="loading" />
      </Slider>
    </div>
  );
};

export default Carousel;
