import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { palette } from '../theme/theme';

const BookLogo = ({ size = 80, color = palette.lightGreen }) => {
  // Scale the viewBox to maintain proportions 
  const viewBoxSize = 24;
  
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Open book base */}
      <Path
        d="M12 6.5c0 0-3-2.5-6-2.5S2 5.5 2 5.5v11c0 0 1.5-1.5 4-1.5s4.5 1.5 6 1.5c1.5 0 3.5-1.5 6-1.5s4 1.5 4 1.5v-11c0 0-1-1.5-4-1.5s-6 2.5-6 2.5z"
        strokeWidth="1.5"
      />
      
      {/* Left page fold */}
      <Path
        d="M6 4v11c0 0 1.5-1 4-1s2 1 2 1"
        strokeWidth="1.5"
      />
      
      {/* Right page fold */}
      <Path
        d="M18 4v11c0 0-1.5-1-4-1s-2 1-2 1"
        strokeWidth="1.5"
      />
      
      {/* Center binding detail */}
      <Path
        d="M12 6.5v11"
        strokeWidth="1.5"
      />
    </Svg>
  );
};

export default BookLogo; 