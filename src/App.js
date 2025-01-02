import React from 'react';
import BitcoinPrice from './components/BitcoinPrice';
import Prices from './components/Prices';
const App = () => {

  return (
    <div>
      <h1>
        Arbitrex
      </h1>
      <BitcoinPrice></BitcoinPrice>
      <Prices></Prices>
    </div>
  );
};

export default App;
