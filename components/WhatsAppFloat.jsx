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

    </>
  );
};

export default WhatsAppFloat;