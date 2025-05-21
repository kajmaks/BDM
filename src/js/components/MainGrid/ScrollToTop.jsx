import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
      <IconButton onClick={scrollToTop} aria-label="scroll to top">
        <ArrowUpward fontSize="large" />
      </IconButton>
    </div>
  );
};

export default ScrollToTop;
