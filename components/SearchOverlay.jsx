"use client"
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const SearchOverlay = () => {
  const { products, router, navigateWithLoading, showSearch, setShowSearch } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const matchedProduct = products.find(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchedProduct) {
        navigateWithLoading(`/product/${matchedProduct._id}`);
        setSearchQuery("");
        setShowSearch(false);
        setSuggestions([]);
      }
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filteredProducts);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (product) => {
    navigateWithLoading(`/product/${product._id}`);
    setSearchQuery("");
    setShowSearch(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearch && !event.target.closest('.search-container')) {
        setShowSearch(false);
        setSearchQuery("");
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch, setShowSearch]);

  if (!showSearch) return null;

  return (
    <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-xs sm:max-w-md px-4 sm:px-6">
      <div className="search-container relative bg-white rounded-lg sm:rounded-xl shadow-2xl border-0">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search products..."
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:shadow-xl transition-shadow duration-300"
            autoFocus
          />
        </form>
        {suggestions.length > 0 && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-0 rounded-b-lg sm:rounded-b-xl shadow-2xl h-28 sm:h-32 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6',
              WebkitScrollbar: {
                width: '4px'
              },
              WebkitScrollbarTrack: {
                background: '#f3f4f6'
              },
              WebkitScrollbarThumb: {
                background: '#d1d5db',
                borderRadius: '2px'
              }
            }}
          >
            {suggestions.map((product) => (
              <div
                key={product._id}
                onClick={() => handleSuggestionClick(product)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{product.name}</div>
                <div className="text-xs text-gray-500 truncate">${product.offerPrice}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;