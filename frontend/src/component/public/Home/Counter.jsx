import React, { useState, useEffect } from 'react';

const Counter = ({ targetValue, countDuration = 3000, waitDuration = 10000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId = null;
    let isCounting = true;

    const animate = (currentTime) => {
      if (isCounting) {
        const startTime = performance.now();
        const progress = Math.min((currentTime - startTime) / countDuration, 1);
        const nextCount = Math.floor(progress * targetValue);

        if (nextCount < targetValue) {
          setCount(nextCount);
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(targetValue); // Reach target
          isCounting = false; // Stop counting
          setTimeout(() => {
            // Wait 10 seconds, then reset and restart
            setCount(0);
            isCounting = true;
            animationFrameId = requestAnimationFrame(animate);
          }, waitDuration);
        }
      }
    };

    // Start the initial animation
    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, countDuration, waitDuration]);

  return <span>{count}{suffix}</span>;
};

export default Counter;