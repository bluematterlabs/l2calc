import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';

import logo from './img/logo.png';
import { calculateL1GasUsageForCallData, loadTxDetail, loadL2TxDetail } from './fees/calculator'
import { getL1GasPrice } from './fees/baseFee'
import { inputParser, InputType } from './helpers/inputParser'

function App() {
  const [l1GasUsageField, setL1GasUsageField] = useState(BigNumber.from(0))
  const [l1GasPrice, setL1GasPrice] = useState(ethers.utils.parseUnits('20', 'gwei')) // 20 gwei
  const [l1SecurityFee, setL1SecurityFee] = useState(BigNumber.from(0))

  const [l2GasUsage, setL2GasUsage] = useState(BigNumber.from(0))
  const [l2GasPrice, setL2GasPrice] = useState(ethers.utils.parseUnits('0.001', 'gwei'))
  const [l2ExecutionFee, setL2ExecutionFee] = useState(BigNumber.from(0))

  const [legacyL1Fee, setLegacyL1Fee] = useState(BigNumber.from(0))
  const [gasSavingWorld, setGasSavingWorld] = useState('')

  // Gas L1 gas price
  useEffect(() => {
    const fetchData = async () => {
      const l1GasPrice = await getL1GasPrice()
      console.log(`l1GasPrice: ${ethers.utils.formatUnits(l1GasPrice, 'gwei')} gwei`)
      setL1GasPrice(l1GasPrice)
    }
    
    fetchData()
    // make sure to catch any error
    .catch(console.error);
  }, [])

  useEffect(() => {
    setL1SecurityFee(l1GasUsageField.mul(l1GasPrice))
  }, [l1GasUsageField, l1GasPrice])

  useEffect(() => {
    setL2ExecutionFee(l2GasUsage.mul(l2GasPrice))
  }, [l2GasUsage, l2GasPrice])

  // Gas saving
  useEffect(() => {
    if (legacyL1Fee.toNumber() === 0 || l2ExecutionFee.toNumber() === 0) {
      setGasSavingWorld('')

    } else {
      const scalingSolutionTxFee = l1SecurityFee.add(l2ExecutionFee)
      console.log({legacyL1Fee: legacyL1Fee.toString(), scalingSolutionTxFee: scalingSolutionTxFee.toString()})
      const saving = legacyL1Fee.sub(scalingSolutionTxFee).mul(100).div(legacyL1Fee)
      setGasSavingWorld(`${saving}% gas saving`)
    }
  }, [legacyL1Fee, l1SecurityFee, l2ExecutionFee])

  const onSearchChange = async (event: any) => {
    const inputTxt = event.target.value.toLocaleLowerCase()

    const inputDetail = await inputParser(inputTxt.trim())

    if (
      inputDetail.inputType === InputType.EtherscanTx ||
      inputDetail.inputType === InputType.OptimisticEtherscanTx ||
      inputDetail.inputType === InputType.txHash
    ) {
      let txDetail
      if (inputDetail.inputType === InputType.EtherscanTx) {
        txDetail = await loadTxDetail(inputDetail.txHash)
      } else if (inputDetail.inputType === InputType.txHash) {
        if (inputDetail.chainId === 1) {
          txDetail = await loadTxDetail(inputDetail.txHash)
        } else {
          txDetail = await loadL2TxDetail(inputDetail.txHash)
        }

      } else {
        txDetail = await loadL2TxDetail(inputDetail.txHash)
      }

      setL2GasUsage(txDetail.gasUsed)
      const l1GasUsage = calculateL1GasUsageForCallData(txDetail.data)
      setL1GasUsageField(BigNumber.from(l1GasUsage))

      setLegacyL1Fee(BigNumber.from(txDetail.gasUsed).mul(l1GasPrice))

    } else {
      setGasSavingWorld('')
      const l1GasUsage = calculateL1GasUsageForCallData(inputTxt)
      console.log({l1GasUsage})
      setL1GasUsageField(BigNumber.from(l1GasUsage))
    }
  }

  return (
    <div className="h-screen">
      <div className="container mx-auto text-white flex justify-center">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
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
          <div className='gas-saving'>
            {gasSavingWorld}
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
              <span>L2 Execution Fee: </span>
              <span>{ethers.utils.formatUnits(l2ExecutionFee, 'ether')} eth</span>
            </div>
          </div>
          
        </header>
      </div>
    </div>
  );
}

export default App;
