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
    <div className="overflow-hidden relative w-screen -mx-6 md:mx-0 md:w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="relative flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] pt-6 pb-[550px] md:py-16 md:px-14 px-4 md:mt-6 md:rounded-xl min-w-full overflow-hidden"
          >
            <Image
              className="md:hidden absolute inset-0 w-full h-full object-cover opacity-20"
              src={slide.imgSrc}
              alt={`Slide ${index + 1}`}
              fill
            />
            <div className="absolute bottom-24 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto z-10 md:pl-8 md:mt-0">
              <p className="md:text-base text-sm text-orange-600 pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
            </div>
            <div className="hidden md:flex items-center flex-1 justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E6E9F2] via-transparent to-[#E6E9F2] z-10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#E6E9F2] via-transparent to-transparent z-10 pointer-events-none"></div>
              <Image
                className="md:w-72 w-56 relative z-0"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 md:left-14 md:transform-none z-10">
              <Link href="/all-products" className="group flex items-center justify-center gap-2 w-72 md:w-auto px-6 py-3 md:py-2.5 font-medium rounded-full transition-all duration-300 border-2 border-gray-300 shadow-[0_0_0_2px_#d1d5db] hover:bg-gray-100 bg-white/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
                {slide.buttonText2}
                <Image className="group-hover:translate-x-1 transition-transform duration-300" src={assets.arrow_icon} alt="arrow_icon" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
