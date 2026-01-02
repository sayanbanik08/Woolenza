'use client';
import React from 'react';

const WhatsAppFloat = () => {
  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        @keyframes slideText {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100vw);
          }
        }
        .animate-slide-content {
          animation: slideText 8s linear infinite;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          font-family: 'Caveat', cursive;
          font-size: 1.5rem;
          font-weight: 100;
        }
      `}</style>
      <div
        className="w-full bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur-md px-6 py-1 flex items-center justify-center text-green-700 overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.3) 80%, rgba(34,197,94,0) 100%)'
        }}
      >
        <div className="animate-slide-content">
          <i className="fas fa-ball-of-yarn text-green-700" style={{ fontSize: '1.8rem' }}></i>
          <span>Premium Quality Yarns & Wool – Crafted for Every Creative Project</span>
        </div>
      </div>
    </>
  );
};

export default WhatsAppFloat;