import { ethers } from 'ethers';
import { BASE_RPC } from '../config/constants'

const NORMAL_TIPS = ethers.utils.parseUnits('1.5', 'gwei')


export const getL1GasPrice = async () => {
  const provider = new ethers.providers.JsonRpcProvider(BASE_RPC)
  const latestBlockNumber = await provider.getBlockNumber()
  console.log({latestBlockNumber})
  const latestBlock = await provider.getBlock(latestBlockNumber)
  console.log({baseFeePerGas: latestBlock.baseFeePerGas!.toString()})

  return latestBlock.baseFeePerGas!.add(NORMAL_TIPS)
}
