import { BigNumber } from 'ethers'
import React from 'react'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { formatEth, formatGwei } from '../helpers/format'
import EthPriceInUsd from './EthPriceInUsd'
import TooltipContainer from './TooltipContainer'

type Props = {
  l1GasPrice: BigNumber
  l1GasUsageField: BigNumber
  l1SecurityFee: BigNumber
  l2GasPrice: BigNumber
  l2GasUsage: BigNumber
  l2ExecutionFee: BigNumber
}

const L2GasPriceDetail: React.FC<Props> = ({
  l1GasPrice,
  l1GasUsageField,
  l1SecurityFee,
  l2GasPrice,
  l2GasUsage,
  l2ExecutionFee,
}) => {
  return (
    <div className="z-0 relative border-l-4 border-theme-300 ml-4 pt-24 -mt-16">
      {/* L1 calldata gas used */}
      <div className="">
        <MainRow
          label="L1 Security Fee:"
          tooltip="Rollups cost for publishing transaction data to Ethereum"
        >
          {formatEth(l1SecurityFee, 9)} ETH{' '}
          <span className="text-white/50 font-medium">
            ($
            <EthPriceInUsd wei={l1SecurityFee} />)
          </span>
        </MainRow>
        <DetailedRow
          label="• L1 Gas Price:"
          value={`${formatGwei(l1GasPrice, 5)} gwei`}
          tooltip="Current Ethereum gas price (base fee + 1.5 gwei)"
        />
        <DetailedRow
          label="• L1 Gas Used:"
          value={l1GasUsageField.toString()}
          tooltip="Rollups gas usage for publishing transaction data to Ethereum"
        />
      </div>

      {/* L2 execution gas used */}
      <div className="mt-4">
        <MainRow
          label="L2 Execution Fee:"
          tooltip="Cost for processing transaction on L2"
        >
          {formatEth(l2ExecutionFee, 9)} ETH{' '}
          <span className="text-white/50 font-medium">
            ($
            <EthPriceInUsd wei={l2ExecutionFee} />)
          </span>
        </MainRow>

        <DetailedRow
          label="• L2 Gas Price:"
          value={`${formatGwei(l2GasPrice, 6)} gwei`}
          tooltip="Current L2 gas price"
        />
        <DetailedRow
          label="• L2 Gas Used:"
          value={l2GasUsage.toString()}
          tooltip="Gas usage for processing transaction on L2"
        />
      </div>
    </div>
  )
}

const MainRow: React.FC<{
  label: string
  children: React.ReactNode
  tooltip: string
}> = ({ label, children, tooltip }) => {
  return (
    <TooltipContainer message={tooltip}>
      <div className="flex font-semibold -ml-4 text-white/80">
        <div className="flex items-center">
          <div className="p-1 bg-theme-400">
            <BsFillPlusCircleFill className="text-theme-300" />
          </div>

          <div className="ml-2">{label} </div>
        </div>
        <div className="ml-2">{children}</div>
      </div>
    </TooltipContainer>
  )
}

const DetailedRow: React.FC<{
  label: string
  value: string
  tooltip: string
}> = ({ label, value, tooltip }) => {
  return (
    <div>
      <TooltipContainer message={tooltip}>
        <div className="flex ml-8 text-white/60">
          <div className="">{label}</div>
          <div className="ml-6">{value}</div>
        </div>
      </TooltipContainer>
    </div>
  )
}

export default L2GasPriceDetail
