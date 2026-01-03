"use client"
import React, { useState, useEffect } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {

  const { isSeller, router, navigateWithLoading, user, products, showSearch, setShowSearch } = useAppContext();
  const { openSignIn } = useClerk();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  return (
    <nav className="border-b border-gray-300 text-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-16 lg:px-32 py-5 md:py-3">
      <div className="cursor-pointer" onClick={() => navigateWithLoading('/')}
        role="button" aria-label="Home">
        <Image
          className="w-28 md:w-32"
          src={assets.woolenza_shop}
          alt="Woolenza Shop"
          width={128}
          height={40}
        />
      </div>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <button onClick={() => navigateWithLoading('/')} className="hover:text-gray-900 transition">
          Home
        </button>
        <button onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-900 transition">
          About Us
        </button>
        <button onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-900 transition">
          Contact
        </button>

        {isSeller && <button onClick={() => navigateWithLoading('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}

      </div>

      <ul className="flex items-center gap-4">
        {/* Desktop - Show search and wishlist */}
        <Image 
          className="w-4 h-4 cursor-pointer hover:opacity-70 transition max-md:hidden" 
          src={assets.search_icon} 
          alt="search icon"
          onClick={() => setShowSearch(!showSearch)}
        />
        {user && (
          <Image 
            className="w-4 h-4 cursor-pointer hover:opacity-70 transition max-md:hidden" 
            src={assets.heart_icon} 
            alt="wishlist"
            onClick={() => navigateWithLoading('/wishlist')}
          />
        )}
        
        {/* Mobile - Show modern date */}
        <div className="md:hidden flex items-center justify-center text-sm font-medium text-gray-700">
          {currentDate}
        </div>
        
        {isSeller && <button onClick={() => navigateWithLoading('/seller')} className="text-xs border px-4 py-1.5 rounded-full md:hidden">Seller Dashboard</button>}
        {user
          ? <>
          <UserButton >
            <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={()=>navigateWithLoading('/')} />
              <UserButton.Action label="All Products" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/all-products')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Cotton Yarn" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/cotton-yarn')} />
              <UserButton.Action label="Chenile Yarn" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/chenile-yarn')} />
              <UserButton.Action label="Pure Merino wool" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/pure-merino-wool')} />
              <UserButton.Action label="Cotton and Acrylic Blend" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/cotton-acrylic-blend')} />
              <UserButton.Action label="Acrylic Yarn" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/acrylic-yarn')} />
              <UserButton.Action label="Acrylic Rainbow" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/acrylic-rainbow')} />
              <UserButton.Action label="MultiTone Acrylic" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/multitone-acrylic')} />
              <UserButton.Action label="CloudCotton" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/cloudcotton')} />
              <UserButton.Action label="Aroma Cotton" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/aroma-cotton')} />
              <UserButton.Action label="TwistTone Cotton" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/twisttone-cotton')} />
              <UserButton.Action label="Exclusive Acrylic" labelIcon={<BoxIcon />} onClick={()=>navigateWithLoading('/products/exclusive-acrylic')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="cart" labelIcon={<CartIcon />} onClick={()=>navigateWithLoading('/cart')} />
              <UserButton.Action label="Wishlist" labelIcon={<Image src={assets.heart_icon} alt="heart" width={16} height={16} />} onClick={()=>navigateWithLoading('/wishlist')} />
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=>navigateWithLoading('/my-orders')} />
            </UserButton.MenuItems>
          </UserButton>
          </> 
          : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>}
      </ul>
      </div>
    </nav>
  );
};

export default Navbar;