import React, { useState, useEffect } from 'react';

const Minimal = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h1>Minimal Test Component</h1>
      <p>Count: {count}</p>
    </div>
  );
};

export default Minimal;
