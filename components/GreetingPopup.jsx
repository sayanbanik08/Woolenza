'use client';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

const GreetingPopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Calculate values before effects
  const customerName = user?.fullName?.split(' ')[0] || 'Welcome';
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  
  if (hour >= 5 && hour < 12) {
    greeting = 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good Afternoon';
  } else if (hour >= 18 && hour < 21) {
    greeting = 'Good Evening';
  } else {
    greeting = 'Good Night';
  }

  // Calculate store age (established 14/5/1976)
  const storeEstablishedDate = new Date(1976, 4, 14); // May 14, 1976
  const currentDate = new Date();
  
  const calculateStoreAge = () => {
    let years = currentDate.getFullYear() - storeEstablishedDate.getFullYear();
    let months = currentDate.getMonth() - storeEstablishedDate.getMonth();
    let days = currentDate.getDate() - storeEstablishedDate.getDate();
    
    if (days < 0) {
      months--;
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const totalHours = Math.floor((currentDate - storeEstablishedDate) / (1000 * 60 * 60));
    const totalDays = Math.floor((currentDate - storeEstablishedDate) / (1000 * 60 * 60 * 24));
    
    return { years, months, days, totalDays, totalHours };
  };

  const storeAge = calculateStoreAge();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const textLines = [
      `${greeting}`,
      `${customerName}!`,
      'From 1976 to today, we\'ve spent',
      `💞 ${storeAge.years}+ Years holding your trust`,
      `🌸 ${storeAge.totalDays.toLocaleString()} Days sharing smiles`,
      `🕰 ${storeAge.totalHours.toLocaleString()} Hours caring for you`,
      'You\'re not just our customer…',
      'you\'re our story 💖',
      'Explore our collections!'
    ];

    if (currentTextIndex < textLines.length) {
      const timer = setTimeout(() => {
        setCurrentTextIndex(currentTextIndex + 1);
      }, 4000); // Each text appears for 4 seconds

      return () => clearTimeout(timer);
    }
  }, [currentTextIndex, mounted, greeting, customerName, storeAge]);

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(200px) translateY(-200px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }

        @keyframes fadeInText {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOutText {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes arrowBounce {
          0%, 100% {
            opacity: 0.6;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
          }
          50% {
            box-shadow: 0 0 25px rgba(72, 187, 120, 1), 0 0 40px rgba(72, 187, 120, 0.8);
          }
        }

        .greeting-circle {
          width: 600px;
          height: 600px;
          background: #b8e6b8;
          border-radius: 0 0 0 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px 40px 80px 40px;
          position: relative;
          animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: -12px 12px 40px rgba(34, 197, 94, 0.2);
          pointer-events: auto;
          overflow: hidden;
        }

        .close-btn {
          position: absolute;
          top: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.3);
          border: 2px solid white;
          border-radius: 50%;
          color: white;
          font-size: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: rotate(90deg);
        }

        .close-btn.glow {
          animation: glowPulse 2s infinite;
        }

        .greeting-text {
          text-align: center;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
        }

        .greeting-main {
          font-size: 36px;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          line-height: 1.2;
          animation: fadeInText 0.6s ease-in;
          color: #2d5a3d;
          font-family: 'Comic Sans MS', 'Trebuchet MS', cursive, sans-serif;
          letter-spacing: 0.5px;
        }

        .greeting-sub {
          font-size: 23px;
          font-weight: 400;
          opacity: 1;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          line-height: 1.3;
          animation: fadeInText 0.6s ease-in;
          color: #2d5a3d;
          font-family: 'Comic Sans MS', 'Trebuchet MS', cursive, sans-serif;
          letter-spacing: 0.3px;
        }

        .greeting-emoji {
          font-size: 50px;
          margin-bottom: 5px;
        }

        .store-journey {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-top: 8px;
          font-size: 15px;
        }

        .journey-line {
          font-weight: 600;
          font-size: 16px;
          opacity: 1;
          animation: fadeInText 0.6s ease-in;
          color: #2d5a3d;
          font-family: 'Comic Sans MS', 'Trebuchet MS', cursive, sans-serif;
          letter-spacing: 0.3px;
        }

        .journey-stat {
          font-size: 15px;
          font-weight: 500;
          opacity: 1;
          line-height: 1.2;
          animation: fadeInText 0.6s ease-in;
          color: #2d5a3d;
          font-family: 'Comic Sans MS', 'Trebuchet MS', cursive, sans-serif;
          letter-spacing: 0.2px;
        }

        .journey-message {
          font-size: 16px;
          font-weight: 600;
          opacity: 1;
          margin-top: 4px;
          line-height: 1.3;
          animation: fadeInText 0.6s ease-in;
          color: #2d5a3d;
          font-family: 'Comic Sans MS', 'Trebuchet MS', cursive, sans-serif;
          letter-spacing: 0.3px;
        }

        .journey-cta {
          font-size: 15px;
          font-weight: 600;
          opacity: 1;
          margin-top: 3px;
          animation: fadeInText 0.6s ease-in;
          color: #2d5a3d;
          font-family: 'Comic Sans MS', 'Trebuchet MS', cursive, sans-serif;
          letter-spacing: 0.3px;
        }

        .store-age {
          font-size: 11px;
          font-weight: 500;
          opacity: 0.85;
          margin-top: 8px;
          line-height: 1.2;
        }

        .store-stats {
          font-size: 12px;
          font-weight: 600;
          opacity: 0.9;
          margin-top: 4px;
          letter-spacing: 0.5px;
        }

        @media (max-width: 640px) {
          .greeting-circle {
            width: 380px;
            height: 380px;
            padding: 35px 20px 60px 20px;
          }

          .greeting-main {
            font-size: 26px;
          }

          .greeting-sub {
            font-size: 18px;
          }

          .greeting-emoji {
            font-size: 40px;
          }

          .close-btn {
            width: 44px;
            height: 44px;
            font-size: 24px;
          }

          .journey-line {
            font-size: 13px;
          }

          .journey-stat {
            font-size: 13px;
          }

          .journey-message {
            font-size: 14px;
          }

          .journey-cta {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="greeting-circle">
        <button
          onClick={() => setIsVisible(false)}
          className={`close-btn ${currentTextIndex >= 9 ? 'glow' : ''}`}
          aria-label="Close greeting"
        >
          ✕
        </button>

        <div className="greeting-emoji">🎉</div>

        <div className="greeting-text">
          {currentTextIndex === 0 && <div className="greeting-main">{greeting}</div>}
          {currentTextIndex === 1 && <div className="greeting-sub">{customerName}!</div>}
          {currentTextIndex === 2 && <div className="journey-line">From 1976 to today, we've spent</div>}
          {currentTextIndex === 3 && <div className="journey-stat">💞 {storeAge.years}+ Years holding your trust</div>}
          {currentTextIndex === 4 && <div className="journey-stat">🌸 {storeAge.totalDays.toLocaleString()} Days sharing smiles</div>}
          {currentTextIndex === 5 && <div className="journey-stat">🕰 {storeAge.totalHours.toLocaleString()} Hours caring for you</div>}
          {currentTextIndex === 6 && <div className="journey-message">You're not just our customer…</div>}
          {currentTextIndex === 7 && <div className="journey-message">you're our story 💖</div>}
          {currentTextIndex === 8 && <div className="journey-cta">Explore our collections!</div>}
        </div>
      </div>
    </div>
  );
};

export default GreetingPopup;
