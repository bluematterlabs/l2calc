import { useState, useEffect } from 'react';

import logo from './logo.svg';
import './App.css';
import { calculateL1GasUsageForCallData } from './fees/calculator'

function App() {
  const [l1GasUsageField, setL1GasUsageField] = useState(0)
  const [l1GasPrice, setL1GasPrice] = useState(20e9)
  const [l1SecurityFee, setL1SecurityFee] = useState(0)

  useEffect(() => {
    setL1SecurityFee(l1GasUsageField * l1GasPrice)
  }, [l1GasUsageField, l1GasPrice])

  const onSearchChange = (event: any) => {
    const searchFieldString = event.target.value.toLocaleLowerCase()
    const l1GasUsage = calculateL1GasUsageForCallData(searchFieldString)
    console.log({l1GasUsage})
    setL1GasUsageField(l1GasUsage)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>L2 Fee Calc</h1>
        <div>L2 Transaction Data / L1 Tx Hash</div>
        <textarea
          rows={3}
          cols={40}
          className={`search-box-a`}
          placeholder={`0x...`}
          onChange={onSearchChange}
        />
        <div className='tx-fee-box'>
          Tx Fee: {parseFloat(`${l1SecurityFee}`)/1e18} eth
        </div>
        <div>
          <span>L1 Gas Price: </span>
          <span>{l1GasPrice/1e9} Gwei</span>
        </div>
        <div>
          <span>L1 Gas Used: </span>
          <span>{l1GasUsageField}</span>
        </div>
        <div>
          <span>L1 Security Fee: </span>
          <span>{parseFloat(`${l1SecurityFee}`)/1e18} eth</span>
        </div>
        
      </header>
    </div>
  );
}

export default App;
