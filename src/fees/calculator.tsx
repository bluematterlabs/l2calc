import { ethers } from "ethers"

const L1_OVERHEAD_GAS = 3188 // overhead + signature = (2100 + 68 * 16)

function hexToBytes(hex: string) {
  hex = hex.replace('0x','') // strip off 0x
  for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export const calculateL1GasUsageForCallData = (payload: string) => {
  let zeroCount = 0
  let nonZeroCount = 0
  const payloadBytes = hexToBytes(payload)
  console.log(payload.length)
  console.log(hexToBytes(payload))

  for (let index = 0; index < payloadBytes.length; index++) {
    const payloadByte = payloadBytes[index]
    if (payloadByte === 0) {
      zeroCount += 1
    } else {
      nonZeroCount += 1
    }
  }
  const calldataGasUsage = (zeroCount * 4) + (nonZeroCount * 16)
  console.log({zeroCount, nonZeroCount, calldataGasUsage})
  return L1_OVERHEAD_GAS + calldataGasUsage
}

export const loadTxDetail = async (txHash: string) => {
  const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com')
  console.log(provider)
  console.log({blocknumber: await provider.getBlockNumber()})
  console.log({txHash})
  const txReceipt = await provider.getTransactionReceipt(txHash)
  const transaction = await provider.getTransaction(txHash)
  console.log({txReceipt})
  console.log({transactionData: transaction.data})
  return {
    data: transaction.data,
    gasUsed: txReceipt.gasUsed
  }
}
