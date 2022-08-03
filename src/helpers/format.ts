import { BigNumber, ethers } from "ethers"

export function formatEth(value: BigNumber, maxLength: number): string {
  return ethers.utils.formatEther(value).slice(0, maxLength)
}

export function formatGwei(value: BigNumber, maxLength: number): string {
  return ethers.utils.formatUnits(value, 'gwei').slice(0, maxLength)
}