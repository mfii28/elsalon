
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={`font-playfair font-bold text-salon-gold ${className}`}>
      <span className="text-salon-dark">ella</span>
      Sal<span className="text-salon-dark">_on</span>
    </div>
  );
};

export default Logo;
