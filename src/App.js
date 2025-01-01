import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [darkTheme, setDarkTheme] = useState(false);

  // Update the clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <div className={darkTheme ? 'app dark-theme' : 'app'}>
      <h1>Welcome to Arbitrex</h1>
      <p>Current Time: {time}</p>
      <button onClick={toggleTheme}>
        {darkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      </button>
    </div>
  );
};

export default App;
