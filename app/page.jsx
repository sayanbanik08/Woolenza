'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HeaderSlider2 from "@/components/HeaderSlider2";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GreetingPopup from "@/components/GreetingPopup";

const Home = () => {
  return (
    <>
      <GreetingPopup />
      <Navbar/>
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
      </div>
      <div className="max-w-7xl mx-auto px-0 md:px-16 lg:px-32">
        <Banner />
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32 -mt-8 lg:-mt-16">
        <HeaderSlider2 />
      </div>
      <Footer />
    </>
  );
};

export default Home;
