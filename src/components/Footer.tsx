// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center mt-3">
      <p className="font-pixel text-[8px] text-gray-500">
        © {new Date().getFullYear()} VIDYUT - INTERACTIVE CODE EXPLORER
      </p>
    </footer>
  );
};

export default Footer;
