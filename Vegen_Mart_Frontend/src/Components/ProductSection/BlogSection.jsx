import React from "react";
import BlogBox from "./BlogBox";
import Slider from "react-slick";
import Index from "../../Pages/Index";

function BlogSection() {
  const settings2 = {
    dots: true,           // Show pagination dots
    infinite: true,       // Infinite loop sliding
    speed: 500,           // Slide speed
    slidesToShow: 2,      // Number of slides to show at once
    slidesToScroll: 1,    // Number of slides to scroll at once
    arrows: true,         // Show navigation arrows
    autoplay: true,       // Enable autoplay
    autoplaySpeed: 3000,  // Autoplay speed in ms
  };
  return (
    <>
      <div class="title section-t-space">
        <h2>Featured Blog</h2>
        <span class="title-leaf">
        </span>
        <p>A virtual assistant collects the products from your list</p>
      </div>

      <Slider {...settings2}>
        {
          Array(8).fill().map((_,index)=>{
            return(
              <BlogBox
          imageUrl="https://themes.pixelstrap.com/fastkart/assets/images/vegetable/blog/3.jpg"
          blogLink="#"
          date="20 March, 2022"
          title="Fresh Vegetable Online"
        />
            )
          })
        }
      </Slider>
    </>
  );
}

export default BlogSection;
