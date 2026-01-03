'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

const BottomNav = () => {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeButton, setActiveButton] = useState(null);
  const { products, navigateWithLoading } = useAppContext();
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
        setSearchQuery('');
        setIsSearchOpen(false);
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
    setSearchQuery('');
    setIsSearchOpen(false);
    setSuggestions([]);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style jsx>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        .bottom-nav-shadow {
          box-shadow: inset 0 2px 8px rgba(128, 128, 128, 0.5), 0 -8px 20px rgba(255, 255, 255, 0.4);
        }

        .search-circle {
          width: 56px;
          height: 56px;
          aspect-square;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: inset 0 2px 8px rgba(128, 128, 128, 0.5), 0 -8px 20px rgba(255, 255, 255, 0.4);
          padding: 1.25rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .search-circle:hover {
          transform: scale(1.1);
        }

        .nav-container {
          display: flex;
          justify-content: between;
          align-items: flex-end;
          gap: 12px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-items {
          flex: 1;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: inset 0 2px 8px rgba(128, 128, 128, 0.5), 0 -8px 20px rgba(255, 255, 255, 0.4);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-bar-wrapper {
          width: 100%;
          animation: expandSearch 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes expandSearch {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .search-bar-container {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: inset 0 2px 8px rgba(128, 128, 128, 0.5), 0 -8px 20px rgba(255, 255, 255, 0.4);
          position: relative;
        }

        .search-form {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          background: white;
          border: none;
          border-radius: 20px;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: #999;
        }

        .search-input:focus {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.3);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: rotate(90deg);
        }

        .suggestions-list {
          position: absolute;
          bottom: 100%;
          left: 16px;
          right: 16px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.12);
          max-height: 320px;
          overflow-y: auto;
          margin-bottom: 12px;
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .suggestion-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .suggestion-item:hover {
          background-color: #f9f9f9;
          padding-left: 20px;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .suggestion-content {
          flex: 1;
          min-width: 0;
        }

        .suggestion-name {
          font-size: 13px;
          font-weight: 500;
          color: #111;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .suggestion-price {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: black;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          transform: translateY(-2px);
        }

        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: black;
          text-decoration: none;
          transition: all 0.3s ease;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 14px;
        }

        .nav-button:hover {
          transform: translateY(-2px);
        }

        .nav-button.active {
          background: rgba(128, 128, 128, 0.3);
          backdrop-filter: blur(5px);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      
      {/* Mobile Bottom Navigation - Hidden on larger screens */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] md:hidden">
        <div className="nav-container">
          {isSearchOpen ? (
            // Search Bar - Animated expansion
            <div className="search-bar-wrapper">
              <div className="search-bar-container">
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search products..."
                    className="search-input"
                  />
                </form>
                <button onClick={toggleSearch} className="close-btn" title="Close search">
                  <i className="fas fa-times"></i>
                </button>
                {suggestions.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSuggestionClick(product)}
                        className="suggestion-item"
                      >
                        <img src={product.image[0]} alt={product.name} className="suggestion-img" />
                        <div className="suggestion-content">
                          <div className="suggestion-name">{product.name}</div>
                          <div className="suggestion-price">₹{product.offerPrice}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Original Nav Bar with animated transition
            <>
              <div className="nav-items">
                <button onClick={() => { setActiveButton('instagram'); window.open('https://www.instagram.com/royaallwool?igsh=MTJ3Zm1iM3p4cW5kYQ==', '_blank'); }} className={activeButton === 'instagram' ? 'nav-button active' : 'nav-button'}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"></circle></svg>
                </button>
                
                <button onClick={() => { setActiveButton('orders'); navigateWithLoading('/my-orders'); }} className={activeButton === 'orders' ? 'nav-button active' : 'nav-button'}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"></path></svg>
                </button>
                
                <button onClick={() => { setActiveButton('cart'); navigateWithLoading('/cart'); }} className={activeButton === 'cart' ? 'nav-button active' : 'nav-button'}>
                  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 0.75H3.75L5.76 10.7925C5.82858 11.1378 6.01643 11.448 6.29066 11.6687C6.56489 11.8895 6.90802 12.0067 7.26 12H14.55C14.902 12.0067 15.2451 11.8895 15.5193 11.6687C15.7936 11.448 15.9814 11.1378 16.05 10.7925L17.25 4.5H4.5M7.5 15.75C7.5 16.1642 7.16421 16.5 6.75 16.5C6.33579 16.5 6 16.1642 6 15.75C6 15.3358 6.33579 15 6.75 15C7.16421 15 7.5 15.3358 7.5 15.75ZM15.75 15.75C15.75 16.1642 15.4142 16.5 15 16.5C14.5858 16.5 14.25 16.1642 14.25 15.75C14.25 15.3358 14.5858 15 15 15C15.4142 15 15.75 15.3358 15.75 15.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>
                
                <button onClick={() => { setActiveButton('wishlist'); navigateWithLoading('/wishlist'); }} className={activeButton === 'wishlist' ? 'nav-button active' : 'nav-button'}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.8435 4.61553C20.3348 4.10547 19.7089 3.71079 19.0218 3.45125C18.3347 3.19171 17.5997 3.08716 16.8667 3.14797C16.1336 3.20879 15.4228 3.43381 14.8013 3.80397C14.1798 4.17413 13.6621 4.68175 13.2838 5.29052C12.906 4.68169 12.3882 4.1741 11.7667 3.80397C11.1451 3.43384 10.4343 3.20882 9.70125 3.148C8.96824 3.08718 8.23327 3.19174 7.54615 3.45129C6.85904 3.71084 6.23313 4.10551 5.72451 4.61557C4.70827 5.62926 4.14397 7.02767 4.14397 8.49383C4.14397 9.96 4.70827 11.3584 5.72451 12.3721L11.4915 18.1391C11.8575 18.5051 12.3706 18.714 12.9038 18.714C13.4371 18.714 13.9502 18.5051 14.3161 18.1391L20.8435 11.6118C21.3532 11.1031 21.7479 10.4772 22.0074 9.7901C22.267 9.10298 22.3715 8.36793 22.3107 7.63491C22.2499 6.9019 22.0249 6.19109 21.6551 5.5696C21.2852 4.94811 20.7776 4.43034 20.1561 4.05192L20.8435 4.61553Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>
              </div>

              {/* Search Circle - Smooth hover effect */}
              <button onClick={toggleSearch} className="search-circle" title="Search">
                <i className="fas fa-search text-xl text-black"></i>
              </button>
            </>
          )}
        </div>
      </nav>
      
      {/* Spacer for mobile to prevent content overlap */}
      <div className="h-20 md:h-0"></div>
    </>
  );
};

export default BottomNav;
