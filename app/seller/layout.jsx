'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full max-w-[1280px] mx-auto'>
        <Sidebar />
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout