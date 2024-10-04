import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white text-center p-4 mt-8">
      Photo by <a href="https://unsplash.com/@sxoxm?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sven Mieke</a> on <a href="https://unsplash.com/photos/three-person-lifting-barbels-Lx_GDv7VA9M?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

      <p>&copy; {currentYear} This application is created by Aaron Tan</p>
    </footer>
  );
};

export default Footer;
