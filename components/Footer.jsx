import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between px-6 md:px-16 lg:px-32 gap-8 md:gap-10 py-10 md:py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-full md:w-2/5 lg:w-1/3">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-4 md:mt-6 text-sm leading-relaxed">
            Woolenza, 104, Shri Aurobindo Rd, Babudanga, Bandhaghat, Salkia, Howrah, West Bengal 711106
            Bringing warmth and quality to every thread, Woolenza is your trusted destination for premium wool and yarn products. Whether you're a hobbyist or a professional, we’re here to support your creativity with the finest materials and personalized service.
          </p>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-1 gap-8 md:gap-10 justify-between w-full md:w-auto">
          <div className="flex items-start">
            <div>
              <h2 className="font-medium text-gray-900 mb-3 md:mb-5">Company</h2>
              <ul className="text-sm space-y-2">
                <li>
                  <a className="hover:underline transition" href="#">Home</a>
                </li>
                <li>
                  <a className="hover:underline transition" href="#">About us</a>
                </li>
                <li>
                  <a className="hover:underline transition" href="#">Contact us</a>
                </li>
                <li>
                  <a className="hover:underline transition" href="#">Privacy policy</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start">
            <div>
              <h2 className="font-medium text-gray-900 mb-3 md:mb-5">Get in touch</h2>
              <div className="text-sm space-y-2">
                <p>+91 9748482194</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <p className="py-4 text-center text-xs md:text-sm">
          Copyright 2025 © Woolenza All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;