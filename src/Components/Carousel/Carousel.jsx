import "./Carousel.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ img1, img2, img3, autoRotate = false, rotationInterval = 5000 }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: autoRotate,
    autoplaySpeed: rotationInterval,
    pauseOnHover: true
  };

  return (
    <div className="carousel">
      <Slider {...settings} className="container">
        <div>
          <img src={img1} alt="carousel image 1" />
        </div>
        <div>
          <img src={img2} alt="carousel image 2" />
        </div>
        <div>
          <img src={img3} alt="carousel image 3" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;