import useSWR from 'swr'
import axios from 'axios'
import { BigNumber } from 'ethers'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const EthPriceInUsd: React.FC<{ wei: BigNumber }> = ({ wei }) => {
  const { data, error } = useSWR(
    'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
    fetcher,
  )

  if (error || !data) {
    return <></>
  }

  // div by 1e16 to get cent value
  const usdCent = wei.mul(parseInt(data.USD, 10)).div('10000000000000000')

  // div by 100 to get usd in float
  return <>{usdCent.toNumber() / 100.0}</>
}

export default EthPriceInUsd
