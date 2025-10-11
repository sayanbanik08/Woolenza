'use client'
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ExclusiveAcrylicPage = () => {
  const { products } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const categoryProducts = products.filter(product => 
      product.category === "Exclusive Acrylic"
    );
    setFilteredProducts(categoryProducts);
  }, [products]);

  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 lg:px-32 py-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-8">
          Exclusive <span className="text-orange-600">Acrylic</span>
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6 justify-items-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No Exclusive Acrylic products available.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExclusiveAcrylicPage;