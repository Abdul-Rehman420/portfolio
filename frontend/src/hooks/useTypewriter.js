'use client';

import { useState, useEffect } from 'react';

export const useTypewriter = (
  texts = [],
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseTime = 1200
) => {
  const [state, setState] = useState({
    display: '',
    index: 0,
    isDeleting: false,
  });

  useEffect(() => {
    if (!texts.length) return;

    const currentText = texts[state.index % texts.length];

    let timeoutId;

    if (!state.isDeleting) {
      // Typing
      if (state.display.length < currentText.length) {
        timeoutId = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            display: currentText.slice(0, prev.display.length + 1),
          }));
        }, typingSpeed);
      } else {
        // Pause before deleting
        timeoutId = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isDeleting: true,
          }));
        }, pauseTime);
      }
    } else {
      // Deleting
      if (state.display.length > 0) {
        timeoutId = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            display: currentText.slice(0, prev.display.length - 1),
          }));
        }, deletingSpeed);
      } else {
        // Move to next text
        timeoutId = setTimeout(() => {
          setState((prev) => ({
            display: '',
            isDeleting: false,
            index: (prev.index + 1) % texts.length,
          }));
        }, 100);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [
    state,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ]);

  return state.display;
};