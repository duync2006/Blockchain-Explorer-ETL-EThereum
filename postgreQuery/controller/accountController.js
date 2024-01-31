const prisma = require('../config')
const web3 = require('../web3')

const toObject = (data) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
                            typeof value === 'bigint'
                                ? value.toString()
                                : value // return everything else unchanged
  ))
}


let minABI = [{
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [
      {
          "name": "",
          "type": "uint256"
      }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
  },
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
      const address_to_check_sum = await web3.utils.toChecksumAddress(req.params.address)
      // console.log(address)
      let result = {};
      bytecode = await web3.eth.getCode(address)
      console.log('bytecode:', bytecode.length)
      if(bytecode == '0x' && bytecode.length == 2) {
        result.type = 'EOA'
        console.log("hello")
      } else {
        result.type = 'SCA'
      }
      console.log("result: ", result)
      const ETH_balance = await web3.eth.getBalance(address_to_check_sum)
      const total_transaction = await web3.eth.getTransactionCount(address_to_check_sum)
      let moreInfor = {}
      if (result.type = 'EOA') {
        const last_txn_sent = await prisma.transactions.findFirst({
          where: {
            from_address: address
          }, 
          orderBy: {
            block_timestamp: 'desc'
          },
          select: { 
            hash: true
          }
        })
        const first_txn_sent = await prisma.transactions.findFirst({
          where: {
            from_address: address
          }, 
          orderBy: {
            block_timestamp: 'asc'
          },
          select: { 
            hash: true
          }
        })
        moreInfor.last_txn_sent = last_txn_sent
        moreInfor.first_txn_sent = first_txn_sent
      }

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

      result.moreInfor = moreInfor

      const uniqueTokenAddressSet = new Set(asset.map(item => item.token_address));
      // console.log(uniqueTokenAddressSet)
      const uniqueTokenAddressArray = Array.from(uniqueTokenAddressSet);
      result.token_holding = uniqueTokenAddressArray.length
      result.ETH_balance = ETH_balance
      result.total_transaction = total_transaction
      result.tokens_list = []

      for (let token of uniqueTokenAddressArray) {
        let item = {}
        item.token_address = token 
        const tokenExisting = await prisma.tokens.findUnique({
          where: {
            address: token
          }
        })
        item.tokenDetail = tokenExisting
        if(tokenExisting){
          item.tokenDetail = tokenExisting
          if(tokenExisting.decimals == null) {
            item.type = 'ERC721'
          } else {
            item.type = 'ERC20'
          }
        } else {
          item.type = null
        }
        let contract = await new web3.eth.Contract(minABI, token);
        let balance = null;
        try {
          console.log("token: ", token)
          balance = await contract.methods.balanceOf(address_to_check_sum).call();         
        } catch (error) {
          console.log("Balance Error")
        }
        item.balance = balance  
        result.tokens_list.push(item)
      }

      res.status(200).send(toObject(result))

    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  }, 
  getTokenTransferERC20: async(req, res) => {

    try {
      const address = req.params.address.toLowerCase()
      const tokenTransfersERC20 = []
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
            if(token.decimals != null) {
              tokenTransfer.token = token
              tokenTransfersERC20.push(tokenTransfer)
            }
          }
      }
      res.status(200).send(toObject(tokenTransfersERC20))
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
        // console.log("tokenTransfer: ", tokenTransfer)
          const token = await prisma.tokens.findUnique({
            where: {
              address: tokenTransfer.token_address
            }
          })
          if (token != null) {
            console.log(token)
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
  },
  getAccountOverview: async(req, res) => {
    try {
      const address = req.params.address.toLowerCase()
      console.log(address)
      let result = {};
      let moreInfor = {};
      bytecode = await web3.eth.getCode(address)
      
      if(bytecode == '0x') {
        result.type = 'EOA'
        const last_txn_sent = await prisma.transactions.findFirst({
          where: {
            from_address: address
          }, 
          orderBy: {
            block_timestamp: 'desc'
          },
          select: { 
            hash: true
          }
        })
        const first_txn_sent = await prisma.transactions.findFirst({
          where: {
            from_address: address
          }, 
          orderBy: {
            block_timestamp: 'asc'
          },
          select: { 
            hash: true
          }
        })
        // console.log(last_txn_sent)
        moreInfor.last_txn_sent = last_txn_sent
        moreInfor.first_txn_sent = first_txn_sent
        result.moreInfor = moreInfor
      } else {
        result.type = 'SCA'
        const creator = await prisma.transactions.findFirst({
          where: {
            receipt_contract_address: address
          }, 
          select: {
            hash: true,
            from_address: true
          }
        })
        moreInfor.creator = creator
        const tokenTracker = await prisma.tokens.findUnique({
          where: {
            address: address
          }
        })
        moreInfor.tokenTracker = tokenTracker
        result.moreInfor = moreInfor
      }
      const ETH_balance = await web3.eth.getBalance(address)
      const total_transaction = await web3.eth.getTransactionCount(address)
      result.overview = {
        ETH_balance: ETH_balance,
        nonce: total_transaction
      }


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
      const uniqueTokenAddressSet = new Set(asset.map(item => item.token_address));
      const uniqueTokenAddressArray = Array.from(uniqueTokenAddressSet);
      result.overview.token_holding = uniqueTokenAddressArray.length
      result.overview.tokens_list = []

      
      asset.push(result)
      const promises = uniqueTokenAddressArray.map(async (token) =>{
        let contract = new web3.eth.Contract(minABI, token);
        try {
          balance = await contract.methods.balanceOf(address).call();
  
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
          result.overview.tokens_list.push(item)
        } catch (err) {

          item = {}
          item.token_address = token
          item.balance = null
          result.overview.tokens_list.push(item)
        }
      })
      Promise.all(promises)
      .then(()=>{
        res.status(200).send(toObject(result))
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }, 

  getAccountERC20Overview: async(req, res) => {
    try {
      const address = req.params.address.toLowerCase()
      const addressToCheckSum = await web3.utils.toChecksumAddress(address)
      const contract = new web3.eth.Contract(minABI, addressToCheckSum)
      const stakeHolders = await prisma.token_transfers.findMany({
        where: {
          token_address: address
        }, 
        select: {
          from_address: true,
          to_address: true, 
        }
      })
      const uniqueAddressesSet = new Set();

      stakeHolders.forEach(transaction => {
        uniqueAddressesSet.add(transaction.from_address)
        uniqueAddressesSet.add(transaction.to_address)
      })

      const uniqueAddressesArray  = Array.from(uniqueAddressesSet)
      
      let totalNumberHolder = 0;
      let holders = []
      for (let holder of uniqueAddressesArray) {
        console.log(contract)
        balance = await contract.methods.balanceOf(holder).call()
        if (holder == '0x0000000000000000000000000000000000000000') {
          continue;
        }
        if(balance > 0) {
          totalNumberHolder += 1;
          newHolder = {}
          newHolder.address = holder
          newHolder.quantity = balance
          holders.push(newHolder)
        } 
      }
      const totalSupply = await contract.methods.totalSupply().call()
      

      res.status(200).send({
        totalSupply: totalSupply,
        totalNumberHolder: totalNumberHolder,
        holdersAddress: holders,
      })

    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  getERCTokenTransfers_SCA: async(req, res) => {
    try {
      address = req.params.address.toLowerCase()
      tokenTransfers = await prisma.token_transfers.findMany({
        where: {
          token_address: address
        }
      })
      res.status(200).send(toObject(tokenTransfers))
    } catch (error) {
      res.status(500).send(error)
    }
  },

  getAccountERC721Overview: async(req, res) => {
    try {
      const address = req.params.address.toLowerCase()
      const addressToCheckSum = await web3.utils.toChecksumAddress(address)
      const contract = new web3.eth.Contract(minABI, addressToCheckSum)
      const stakeHolders = await prisma.token_transfers.findMany({
        where: {
          token_address: address
        }, 
        select: {
          from_address: true,
          to_address: true, 
        }
      })
      const uniqueAddressesSet = new Set();

      stakeHolders.forEach(transaction => {
        uniqueAddressesSet.add(transaction.from_address)
        uniqueAddressesSet.add(transaction.to_address)
      })

      const uniqueAddressesArray  = Array.from(uniqueAddressesSet)
      
      console.log(uniqueAddressesArray)

      let totalNumberHolder = 0;
      let holders = []
      for (let holder of uniqueAddressesArray) {
        if (holder == '0x0000000000000000000000000000000000000000') {
          continue;
        }
        balance = await contract.methods.balanceOf(holder).call()
        if(balance > 0) {
          totalNumberHolder += 1;
          newHolder = {}
          newHolder.address = holder
          newHolder.quantity = balance
          holders.push(newHolder)
        } 
      }
      // const totalSupply = await contract.methods.totalSupply().call()
      

      res.status(200).send({
        totalSupply: 0,
        totalNumberHolder: totalNumberHolder,
        holdersAddress: holders,
      })

    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}

module.exports = AccountController
