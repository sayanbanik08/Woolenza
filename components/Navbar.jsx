"use client"
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {

  const { isSeller, router, user, products, showSearch, setShowSearch } = useAppContext();
  const { openSignIn } = useClerk();

  return (
    <nav className="border-b border-gray-300 text-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-16 lg:px-32 py-5 md:py-3">
      <div className="cursor-pointer" onClick={() => router.push('/')}
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
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}

      </div>

      <ul className="flex items-center gap-4">
        <Image 
          className="w-4 h-4 cursor-pointer hover:opacity-70 transition" 
          src={assets.search_icon} 
          alt="search icon"
          onClick={() => setShowSearch(!showSearch)}
        />
        {user
          ? <>
          <UserButton >
            <UserButton.MenuItems> 
              <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={()=>router.push('/')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems> 
              <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={()=>router.push('/all-products')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems> 
              <UserButton.Action label="cart" labelIcon={<CartIcon />} onClick={()=>router.push('/cart')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems> 
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=>router.push('/my-orders')} />
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