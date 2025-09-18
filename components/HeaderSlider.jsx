import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Softness fades fast — claim your comfort.",
      offer: "Going fast. Stay cozy.",
      buttonText2: "Find more",
      imgSrc: assets.girl,
    },
    {
      id: 2,
      title: "Limited threads, endless warmth — don’t miss out.",
      offer: "Catch it before it unravels.",
      buttonText2: "Explore Deals",
      imgSrc: assets.boy,
    },
    {
      id: 3,
      title: "When it’s gone, it’s just a memory in wool.",
      offer: "Limited wool. Unlimited love.",
      buttonText2: "Learn More",
      imgSrc: assets.cat,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);



  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-screen -mx-6 sm:mx-0 sm:w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="relative flex flex-col-reverse lg:flex-row items-center justify-between bg-[#E6E9F2] pt-6 pb-[550px] lg:py-12 px-4 sm:px-6 md:px-8 lg:px-14 sm:mt-6 sm:rounded-xl min-w-full overflow-hidden"
          >
            {/* Mobile background image */}
            <Image
              className="lg:hidden absolute inset-0 w-full h-full object-cover opacity-30"
              src={slide.imgSrc}
              alt={`Slide ${index + 1}`}
              fill
            />
            
            {/* Content section */}
            <div className="absolute bottom-24 left-4 right-4 lg:relative lg:bottom-auto lg:left-auto lg:right-auto z-10 lg:flex-1 lg:pr-8">
              <p className="text-sm sm:text-base lg:text-base text-orange-600 pb-1 font-medium">
                {slide.offer}
              </p>
              <h1 className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-2xl sm:text-3xl md:text-4xl lg:text-4xl lg:leading-[48px] font-semibold mb-4 lg:mb-0">
                {slide.title}
              </h1>
            </div>
            
            {/* Button */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:absolute lg:bottom-4 lg:left-4 lg:transform-none z-10">
              <Link 
                href="/all-products" 
                className="group flex items-center justify-center gap-2 w-72 lg:w-auto px-4 sm:px-6 py-2.5 sm:py-3 lg:py-2.5 text-base sm:text-lg font-medium rounded-full transition-all duration-300 border-2 border-gray-300 shadow-[0_0_0_2px_#d1d5db] hover:bg-gray-100 bg-white/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none"
              >
                {slide.buttonText2}
                <Image 
                  className="group-hover:translate-x-1 transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5" 
                  src={assets.arrow_icon} 
                  alt="arrow_icon" 
                />
              </Link>
            </div>
            
            {/* Desktop image section */}
            <div className="hidden lg:flex items-center flex-1 justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E6E9F2] via-transparent to-[#E6E9F2] z-10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#E6E9F2] via-transparent to-transparent z-10 pointer-events-none"></div>
              <Image
                className="w-80 xl:w-96 relative z-0"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 lg:mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full cursor-pointer transition-colors duration-300 ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30 hover:bg-gray-500/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
