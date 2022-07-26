import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';

import logo from './logo.svg';
import './App.css';
import { calculateL1GasUsageForCallData, loadTxGasUsed } from './fees/calculator'

function App() {
  const [l1GasUsageField, setL1GasUsageField] = useState(BigNumber.from(0))
  const [l1GasPrice, setL1GasPrice] = useState(BigNumber.from('20000000000'))
  const [l1SecurityFee, setL1SecurityFee] = useState(BigNumber.from(0))

  const [l2GasUsage, setL2GasUsage] = useState(BigNumber.from(0))
  const [l2GasPrice, setL2GasPrice] = useState(BigNumber.from('1000000'))
  const [l2ExecutionFee, setL2ExecutionFee] = useState(BigNumber.from(0))

  useEffect(() => {
    setL1SecurityFee(l1GasUsageField.mul(l1GasPrice))
  }, [l1GasUsageField, l1GasPrice])

  useEffect(() => {
    setL2ExecutionFee(l2GasUsage.mul(l2GasPrice))
  }, [l2GasUsage, l2GasPrice])

  const onSearchChange = async (event: any) => {
    const searchFieldString = event.target.value.toLocaleLowerCase()

    if (searchFieldString.search('https://') === 0) {
      console.log('etherscan detect')
      const l2GasUsed = await loadTxGasUsed(searchFieldString.replace('https://etherscan.io/tx/',''))
      setL2GasUsage(l2GasUsed)

    } else {
      console.log('payload detect')
      const l1GasUsage = calculateL1GasUsageForCallData(searchFieldString)
      console.log({l1GasUsage})
      setL1GasUsageField(BigNumber.from(l1GasUsage))
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>L2 Fee Calc</h1>
        <div>L2 Transaction Data / L1 Tx Hash</div>
        <textarea
          rows={4}
          cols={53}
          className={`search-box-a`}
          placeholder={`0x...`}
          onChange={onSearchChange}
        />
        <div className='tx-fee-box'>
          Tx Fee: {ethers.utils.formatUnits(l1SecurityFee.add(l2ExecutionFee), 'ether')} eth
        </div>
        <div className='l1-detail-area'>
          <div>
            <span>L1 Gas Price: </span>
            <span>{ethers.utils.formatUnits(l1GasPrice, 'gwei')} Gwei</span>
          </div>
          <div>
            <span>L1 Gas Used: </span>
            <span>{l1GasUsageField.toString()}</span>
          </div>
          <div>
            <span>L1 Security Fee: </span>
            <span>{ethers.utils.formatUnits(l1SecurityFee, 'ether')} eth</span>
          </div>
        </div>
        <div className='l2-detail-area'>
          <div>
            <span>L2 Gas Price: </span>
            <span>{ethers.utils.formatUnits(l2GasPrice, 'gwei')} Gwei</span>
          </div>
          <div>
            <span>L2 Gas Used: </span>
            <span>{l2GasUsage.toString()}</span>
          </div>
          <div>
            <span>L2 Security Fee: </span>
            <span>{ethers.utils.formatUnits(l2ExecutionFee, 'ether')} eth</span>
          </div>
        </div>
        
      </header>
    </div>
  );
}

export default App;
