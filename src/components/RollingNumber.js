import React, { useEffect, useState } from 'react';

const RollingNumber = ({ targetNumber }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetNumber;
    if (start === end) return;

    const totalSteps = 50;
    const increment = Math.ceil(end / totalSteps);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [targetNumber]);

  return <span>{count.toLocaleString()}</span>;
};

export default RollingNumber;
