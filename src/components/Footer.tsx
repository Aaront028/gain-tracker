import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white text-center p-4 mt-8">
      <p>&copy; {currentYear} This application is created by Aaron Tan</p>
    </footer>
  );
};

export default Footer;
