import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative inline-block">
      {children}
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm py-2 px-3 rounded-lg shadow-lg">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
