'use client';
import { useState, useEffect } from 'react';

export const useTypewriter = (texts, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [display, setDisplay] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;
    if (!isDeleting && charIndex < currentText.length) {
      timeout = setTimeout(() => { setDisplay(currentText.slice(0, charIndex + 1)); setCharIndex(p => p + 1); }, typingSpeed);
    } else if (!isDeleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => { setDisplay(currentText.slice(0, charIndex - 1)); setCharIndex(p => p - 1); }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex(p => (p + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return display;
};
