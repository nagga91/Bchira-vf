import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <svg className="footer-wave" viewBox="0 0 120 28" preserveAspectRatio="none">
        <path d="M0,0 C30,10 90,10 120,0 L120,28 L0,28 Z" fill="var(--accent)"></path>
      </svg>
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Elegant Curtains. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;