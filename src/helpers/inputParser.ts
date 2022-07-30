
export enum InputType {
  EtherscanTx,
  OptimisticEtherscanTx,
  DataPayload
}

export type InputDetail = {
  inputType: InputType;
  chainId: number;
  txHash: string;
}

export const inputParser = (txt: string): InputDetail => {
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
  } else {
    console.log('l2 data payload detect')
    return {
      inputType: InputType.DataPayload,
      chainId: 1,
      txHash: ''
    }
  }
}
