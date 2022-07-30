import { ethers } from 'ethers';
import { BASE_RPC, OPTIMISM_RPC } from '../config/constants'

export enum InputType {
  EtherscanTx,
  OptimisticEtherscanTx,
  DataPayload,
  txHash
}

export type InputDetail = {
  inputType: InputType;
  chainId: number;
  txHash: string;
}

export const inputParser = async (txt: string): Promise<InputDetail> => {
  if (txt.search('https://etherscan.io/tx/') === 0) {
    console.log('etherscan tx detect')
    return {
      inputType: InputType.EtherscanTx,
      chainId: 1,
      txHash: txt.replace('https://etherscan.io/tx/','')
    }
  } else if (txt.search('https://optimistic.etherscan.io/tx/') === 0) {
    console.log('optimistic.etherscan tx detect')
    return {
      inputType: InputType.OptimisticEtherscanTx,
      chainId: 10,
      txHash: txt.replace('https://optimistic.etherscan.io/tx/','')
    }
  } else if (txt.search('0x') === 0 &&  txt.length === 66) {
    console.log('tx hash detect')
    console.log(txt.length)
    const txHash = txt
    const l1Provider = new ethers.providers.JsonRpcProvider(BASE_RPC)
    const optimismProvider = new ethers.providers.JsonRpcProvider(OPTIMISM_RPC)
    const [l1Tx, optimismTx] = await Promise.all([
      l1Provider.getTransaction(txHash),
      optimismProvider.getTransaction(txHash)
    ])
    console.log({
      l1Tx,
      optimismTx,
      isL1TxNull: l1Tx === null,
      isL2TxNull: optimismTx === null,
    })

    return {
      inputType: InputType.txHash,
      chainId: l1Tx !== null ? 1 : 10,
      txHash: txHash
    }

  } else {
    console.log('l2 data payload detect')
    return {
      inputType: InputType.DataPayload,
      chainId: 1,
      txHash: ''
    }
  }
}
