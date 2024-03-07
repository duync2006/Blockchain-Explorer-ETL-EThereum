const web3 = require('./web3')
const contractABI = require('./abi.json')

const contract = new web3.eth.Contract(contractABI, '0x00ae63e10e63792a8a063d36667bb870a47b4336')


const getEventAbi = async(keyEventString) => {
  return await contract.methods.getStringValue(keyEventString).call()
}

const getEventName = async(key) => {
  return await contract.methods.getStringValue(key).call()
}

const main = async() => {
  console.log(await getEventAbi("0xcd922406a01506bad177954c0dc7374a2785db2576ffd7d30855938ebc2989bf"))
  console.log(await getEventName("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"))
}

main()