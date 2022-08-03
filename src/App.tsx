import { useState, useEffect } from 'react'
import { BigNumber, ethers } from 'ethers'
import { BsFillArrowDownCircleFill } from 'react-icons/bs'

import logo from './img/logo.png'
import {
  calculateL1GasUsageForCallData,
  loadTxDetail,
  loadL2TxDetail,
} from './fees/calculator'
import { getL1GasPrice } from './fees/baseFee'
import { inputParser, InputType } from './helpers/inputParser'
import L2GasPriceDetail from './components/L2GasPriceDetail'
import { formatEth } from './helpers/format'
import EthPriceInUsd from './components/EthPriceInUsd'

function App() {
  const [l1GasUsageField, setL1GasUsageField] = useState(BigNumber.from(0))
  const [l1GasPrice, setL1GasPrice] = useState(
    ethers.utils.parseUnits('20', 'gwei'),
  ) // 20 gwei
  const [l1SecurityFee, setL1SecurityFee] = useState(BigNumber.from(0))

  const [l2GasUsage, setL2GasUsage] = useState(BigNumber.from(0))
  const [l2GasPrice, setL2GasPrice] = useState(
    ethers.utils.parseUnits('0.001', 'gwei'),
  )
  const [l2ExecutionFee, setL2ExecutionFee] = useState(BigNumber.from(0))

  const [legacyL1Fee, setLegacyL1Fee] = useState(BigNumber.from(0))
  const [gasSavingWorld, setGasSavingWorld] = useState('')

  // Gas L1 gas price
  useEffect(() => {
    const fetchData = async () => {
      const l1GasPrice = await getL1GasPrice()
      console.log(
        `l1GasPrice: ${ethers.utils.formatUnits(l1GasPrice, 'gwei')} gwei`,
      )
      setL1GasPrice(l1GasPrice)
    }

    fetchData()
      // make sure to catch any error
      .catch(console.error)
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
      console.log({
        legacyL1Fee: legacyL1Fee.toString(),
        scalingSolutionTxFee: scalingSolutionTxFee.toString(),
      })
      const saving = legacyL1Fee
        .sub(scalingSolutionTxFee)
        .mul(100)
        .div(legacyL1Fee)
      setGasSavingWorld(`${saving}`)
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
      console.log({ l1GasUsage })
      setL1GasUsageField(BigNumber.from(l1GasUsage))
    }
  }

  return (
    <div>
      <div className="container mx-auto flex flex-col items-center">
        <div className="w-60">
          <img src={logo} alt="l2calc logo" />
        </div>

        <div className="bg-white py-16 px-24 rounded-md shadow-lg shadow-zinc-200/40">
          <div>L2 Transaction Data / L1 Tx Hash</div>
          <textarea
            rows={4}
            cols={53}
            placeholder={`0x...`}
            onChange={onSearchChange}
            className="w-full h-32 px-4 py-2 mb-2 text-sm text-gray-700 placeholder-gray-600 border-2 rounded-lg focus:shadow-outline"
          />

          <div className="flex justify-center">
            <BsFillArrowDownCircleFill className="text-xl text-[#b8dceb]" />
          </div>

          <div
            className="z-50 relative p-4 mt-4 text-center rounded-sm border-b-4 border-white"
            style={{
              backgroundImage:
                'radial-gradient( circle farthest-corner at 92.3% 71.5%,  #aecaeb 0%, #c5f3eb 90% )',
            }}
          >
            <span className="text-lg font-medium text-slate-800">
              Rollups Tx Fee: {formatEth(l1SecurityFee.add(l2ExecutionFee), 9)}{' '}
              ETH
            </span>
            <span className="font-medium ml-1 text-slate-600">
              ($
              <EthPriceInUsd wei={l1SecurityFee.add(l2ExecutionFee)} />)
            </span>
          </div>

          <div className="z-50 relative text-center h-10 mt-2 font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#5cd2bd] to-[#2c63ae]">
            {gasSavingWorld || '...'}% gas saving
          </div>

          <L2GasPriceDetail
            l1GasPrice={l1GasPrice}
            l1GasUsageField={l1GasUsageField}
            l1SecurityFee={l1SecurityFee}
            l2GasPrice={l2GasPrice}
            l2GasUsage={l2GasUsage}
            l2ExecutionFee={l2ExecutionFee}
          />
        </div>

        {/* footer */}
        <div className="pt-8 pb-6">
          <div className="text-sm font-bold text-white/70">
            Made with 💙 by <a href="https://bluesweep.xyz">bluesweep.xyz</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
