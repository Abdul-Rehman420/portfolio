'use client';
import { useEffect, useRef } from 'react';

const CursorEffect = () => {
  const heroRef = useRef(null);
  const styleRef = useRef(null);

  useEffect(() => {
    // Find the hero section
    heroRef.current = document.getElementById('home');
    if (!heroRef.current) return;

    const hero = heroRef.current;
    const body = document.body;
    let isInHero = false;

    // Add the cursor-invert-mask class to hero section
    hero.classList.add('cursor-invert-mask');

    // Inject CSS for the cursor effect
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      styleRef.current.textContent = `
        .cursor-invert-mask {
          position: relative;
        }
        .cursor-invert-mask::before {
          content: '';
          position: fixed;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: white;
          mix-blend-mode: difference;
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.2s ease-out;
          transform: translate(-50%, -50%);
          left: var(--cursor-x, 0px);
          top: var(--cursor-y, 0px);
        }
        .cursor-invert-active .cursor-invert-mask::before {
          opacity: 1;
        }
      `;
      document.head.appendChild(styleRef.current);
    }

    const onMouseEnter = () => {
      isInHero = true;
      body.classList.add('cursor-invert-active');
      body.style.cursor = 'none';
    };

    const onMouseLeave = () => {
      isInHero = false;
      body.classList.remove('cursor-invert-active');
      body.style.cursor = '';
    };

    const onMouseMove = (e) => {
      if (!isInHero) return;
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    };

    hero.addEventListener('mouseenter', onMouseEnter);
    hero.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      hero.removeEventListener('mouseenter', onMouseEnter);
      hero.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousemove', onMouseMove);
      body.classList.remove('cursor-invert-active');
      body.style.cursor = '';
      hero.classList.remove('cursor-invert-mask');
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, []);

  return null;
};

export default CursorEffect;
