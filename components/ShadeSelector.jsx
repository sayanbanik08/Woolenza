'use client'
import { useState } from 'react';
import Image from 'next/image';

const ShadeSelector = ({ shades = [], onShadeSelect, selectedShade }) => {
  const [selected, setSelected] = useState(selectedShade?.name || (shades.length > 0 ? shades[0]?.name : null));
  const [visited, setVisited] = useState(new Set(selectedShade ? [selectedShade.name] : []));

  const handleShadeClick = (shade) => {
    const shadeName = typeof shade === 'string' ? shade : shade.name;
    setSelected(shadeName);
    
    // Add to visited set
    setVisited(prev => new Set([...prev, shadeName]));
    
    if (onShadeSelect) {
      onShadeSelect(shade);
    }
  };

  if (!shades || shades.length === 0) {
    return null;
  }

  return (
    <div className="my-6 pb-6 border-b border-gray-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        .handwritten {
          font-family: 'Caveat', cursive;
          font-weight: 700;
          font-size: 24px;
          letter-spacing: 0.5px;
        }
      `}</style>
      <h3 className="handwritten text-gray-800 mb-4">Choose a Shade</h3>
      
      {/* Shade grid with hover effects */}
      <div className="flex flex-wrap gap-4">
        {shades.map((shade, index) => {
          const isSelected = selected?.name === shade.name || selected === shade.name;
          const isVisited = visited.has(typeof shade === 'string' ? shade : shade.name);
          const shadeName = typeof shade === 'string' ? shade : shade.name;
          const shadeThumb = typeof shade === 'string' ? shade : shade.thumbnail;
          
          return (
            <div key={index} className="relative group">
              {/* Shade image thumbnail circle */}
              <button
                onClick={() => handleShadeClick(shade)}
                className={`w-10 h-10 rounded-full transition-all duration-300 transform group-hover:scale-110 focus:outline-none relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-orange-500 ring-offset-2 shadow-lg'
                    : isVisited
                    ? 'ring-2 ring-green-500 ring-offset-2 shadow-md'
                    : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-orange-400 shadow-sm hover:shadow-md'
                }`}
                title={shadeName}
              >
                {/* Image thumbnail */}
                {shadeThumb ? (
                  <Image
                    src={shadeThumb}
                    alt={shadeName}
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                )}
              </button>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-medium">
                {shadeName}
              </div>

              {/* Selection indicator for selected shade */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Visited indicator for non-selected visited shades */}
              {isVisited && !isSelected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-5 h-5 text-white drop-shadow-md opacity-75" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShadeSelector;
