const prisma = require('../config')
const web3 = require('../web3')

const toObject = (data) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
                            typeof value === 'bigint'
                                ? value.toString()
                                : value // return everything else unchanged
  ))
}

let minABI = [
  // balanceOf
  {
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

async function getBalance(address) {
  balance = await contract.methods.balanceOf(address).call();;
  return balance;
}


const AccountController = {
  getAsset: async(req, res) => {
    try {
      const address = req.params.address.toLowerCase()
      console.log(address)
      const ETH_balance = await web3.eth.getBalance(address)
      const total_transaction = await web3.eth.getTransactionCount(address)
      const asset = await prisma.token_transfers.findMany({
          where: {
            OR: [
              {
                to_address: address,
              },
              {
                from_address: address
              }
            ]
          },
          select: {
            token_address: true
          },
      })
      let result = {};
      
      
      const uniqueTokenAddressSet = new Set(asset.map(item => item.token_address));
      const uniqueTokenAddressArray = Array.from(uniqueTokenAddressSet);
      result.token_holding = uniqueTokenAddressArray.length
      result.ETH_balance = ETH_balance
      result.total_transaction = total_transaction
      result.tokens_list = []
      
      asset.push(result)
      const promises = uniqueTokenAddressArray.map(async (token) =>{
        let contract = new web3.eth.Contract(minABI, token);
        try {
          balance = await contract.methods.balanceOf(address).call();
          // console.log("balance: ", balance)
          item = {}
          item.token_address = token
          try {
            _token = await prisma.tokens.findUnique({
              where: {
                address: token
              }
            })
            if(token){
              item.token_detailed = _token
              if(_token.decimals == null) {
                item.type = 'ERC721'
              } else {
                item.type = 'ERC20'
              }
            }
          } catch (err) {

          }
          if (balance) {
            item.balance = balance
          }
          result.tokens_list.push(item)
        } catch (err) {
          // console.log(err)
          item = {}
          item.token_address = token
          item.balance = null
          result.tokens_list.push(item)
        }
      })
      Promise.all(promises)
      .then(()=>{
        res.status(200).send(toObject(result))
      })
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  }, 
  getTokenTransferERC20: async(req, res) => {

    try {
      const address = req.params.address.toLowerCase()
      const tokenTransfersERC721 = []
      const tokenTransfers = await prisma.token_transfers.findMany({
        where: {
          OR: [
            {from_address: address},
            {to_address: address}
          ]
        },
        orderBy: {
          block_timestamp: 'desc'
        }
      })
      for (let tokenTransfer of tokenTransfers) {
        console.log("tokenTransfe: ", tokenTransfer)
          const token = await prisma.tokens.findUnique({
            where: {
              address: tokenTransfer.token_address
            }
          })
          if(token.decimals != null) {
            tokenTransfer.token = token
            tokenTransfersERC721.push(tokenTransfer)
          }
      }
      res.status(200).send(toObject(tokenTransfersERC721))
    } catch (err) {
      console.log(err)
      res.status(500).send(err.code)
    }
  },

  getTokenTransferNFT: async(req, res) => {
    try {
      const address = req.params.address.toLowerCase()
      const tokenTransfersERC721 = []
      const tokenTransfers = await prisma.token_transfers.findMany({
        where: {
          OR: [
            {from_address: address},
            {to_address: address}
          ]
        },
        orderBy: {
          block_timestamp: 'desc'
        }
      })
      for (let tokenTransfer of tokenTransfers) {
        console.log("tokenTransfe: ", tokenTransfer)
          const token = await prisma.tokens.findUnique({
            where: {
              address: tokenTransfer.token_address
            }
          })
          if (token != null) {
            if(token.decimals == null) {
              tokenTransfer.token = token
              tokenTransfersERC721.push(tokenTransfer)
            }
          } 
      }
      res.status(200).send(toObject(tokenTransfersERC721))
    } catch (err) {
      console.log(err)
      res.status(500).send(err.code)
    }
  },
  identify: async(req, res) => {
    try {
      const address = req.params.address.toLowerCase()
      result = {}
      result.address = address
      bytecode = await web3.eth.getCode(address)
      if(bytecode == '0x') {
        result.type = 'EOA'
      } else {
        result.type = 'SCA'
      }
      res.status(200).send(result)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

module.exports = AccountController
