import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {

  const { products, router, navigateWithLoading } = useAppContext()

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-left w-full">Popular <span className="text-orange-600">products</span></p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-2 sm:gap-4 md:gap-6 mt-6 pb-14 w-full max-w-screen-xl mx-auto justify-items-center">
        {products.slice(0, 12).map((product, index) => <ProductCard key={index} product={product} />)}
      </div>
      <button onClick={() => { navigateWithLoading('/all-products') }} className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
