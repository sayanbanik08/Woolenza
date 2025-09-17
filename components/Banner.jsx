import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-10 md:py-0 bg-[#E6E9F2] md:my-16 md:rounded-xl overflow-hidden">
      <Image
        className="max-w-48 md:max-w-56"
        src={assets.bag}
        alt="jbl soundbox"

      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          Craft Better with Woolenza
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
          From soft fibers to perfect hues—everything you need to craft beautifully.
        </p>
      </div>
      <Image
        className="hidden md:block max-w-80"
        src={assets.hat}
        alt="md_controller_image"

      />
      <Image
        className="md:hidden"
        src={assets.hat}
        alt="sm_controller_image"

      />
    </div>
  );
};

export default Banner;