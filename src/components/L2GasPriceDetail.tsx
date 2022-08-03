import { BigNumber } from 'ethers'
import React from 'react'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { formatEth, formatGwei } from '../helpers/format'
import EthPriceInUsd from './EthPriceInUsd'

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
    <div className="z-0 relative border-l-4 border-[#c6f3eb] ml-4 pt-24 -mt-16">
      {/* L1 calldata gas used */}
      <div className="">
        <MainRow label="L1 Security Fee:">
          {formatEth(l1SecurityFee, 9)} ETH{' '}
          <span className="text-slate-400 font-medium">
            ($
            <EthPriceInUsd wei={l1SecurityFee} />)
          </span>
        </MainRow>
        <DetailedRow
          label="• L1 Gas Price:"
          value={`${formatGwei(l1GasPrice, 5)} gwei`}
        />
        <DetailedRow
          label="• L1 Gas Used:"
          value={l1GasUsageField.toString()}
        />
      </div>

      {/* L2 execution gas used */}
      <div className="mt-4">
        <MainRow label="L2 Execution Fee:">
          {formatEth(l2ExecutionFee, 9)} ETH{' '}
          <span className="text-slate-400 font-medium">
            ($
            <EthPriceInUsd wei={l2ExecutionFee} />)
          </span>
        </MainRow>

        <DetailedRow
          label="• L2 Gas Price:"
          value={`${formatGwei(l2GasPrice, 6)} gwei`}
        />
        <DetailedRow label="• L2 Gas Used:" value={l2GasUsage.toString()} />
      </div>
    </div>
  )
}

const MainRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => {
  return (
    <div className="flex font-semibold text-lg -ml-4 text-slate-700">
      <div className="flex items-center">
        <div className="p-1 bg-white">
          <BsFillPlusCircleFill className="text-[#5cd2bd]" />
        </div>

        <div className="ml-2">{label} </div>
      </div>
      <div className="ml-2">{children}</div>
    </div>
  )
}

const DetailedRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div className="flex ml-8 text-slate-600">
      <div className="">{label}</div>
      <div className="ml-6">{value}</div>
    </div>
  )
}

export default L2GasPriceDetail
