import React from "react";

const TextHighlight = ({ children, className = "" }) => {
  return (
    <span 
      className={`relative inline-block ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute -bottom-1 left-0 w-full h-3 bg-purple-500/30 transform skew-x-12 -rotate-1"
        aria-hidden="true"
      />
    </span>
  );
};

export default TextHighlight;