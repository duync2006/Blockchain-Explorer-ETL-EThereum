const { start } = require('postgresql');
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
  },
  {
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

async function getBalance(address) {
  balance = await contract.methods.balanceOf(address).call();;
  return balance;
}

function paginateArray(array, page, perpage) {
  const startIndex = (page - 1)*perpage;
  const endIndex = startIndex + perpage;
  return array.slice(startIndex, endIndex);
}

const AccountController = {
  getAsset: async(req, res) => {
    try {
      const perPage = parseInt(req.query.limit || 20)
      const page = parseInt(req.query.page || 1)

      const address = req.params.address.toLowerCase()
      const address_to_check_sum = await web3.utils.toChecksumAddress(req.params.address)
      const ETH_balancePromise = web3.eth.getBalance(address_to_check_sum)
      const total_transactionPromise = web3.eth.getTransactionCount(address_to_check_sum)
      const bytecodePromise = web3.eth.getCode(address)
      const [ETH_balance, total_transaction, bytecode] = await Promise.all([ETH_balancePromise, total_transactionPromise, bytecodePromise]) 
      let result = {};
      result.ETH_balance = ETH_balance
      result.total_transaction = total_transaction
      
      // console.log('bytecode:', bytecode.length)
      if(bytecode == '0x' && bytecode.length == 2) {
        result.type = 'EOA'
      } else {
        result.type = 'SCA'
      }
      
      let moreInfor = {}
      if (result.type = 'EOA') {
        const last_txn_sent_Promise = prisma.transactions.findFirst({
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
        const first_txn_sent_Promise = prisma.transactions.findFirst({
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
        const [last_txn_sent, first_txn_sent ] = await Promise.all([first_txn_sent_Promise, first_txn_sent_Promise])
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
      
      const paginateArr = paginateArray(uniqueTokenAddressArray, page, perPage)
      result.token_holding = uniqueTokenAddressArray.length
      result.tokens_list = []
  
      // for (let token of uniqueTokenAddressArray) {
      const tokenPromises = paginateArr.map(async(token) => { 
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

        balance = await contract.methods.balanceOf(address_to_check_sum).call();         
      } catch (error) {

      }
      item.balance = balance  
      result.tokens_list.push(item)
    // }
    })
      const tokenPromiseAll = await Promise.all(tokenPromises);
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
        // console.log("tokenTransfe: ", tokenTransfer)
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
      const perPage = parseInt(req.query.limit || 20)
      const page = parseInt(req.query.page || 1)

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
      const totalSupply = await contract.methods.totalSupply().call()
     

      let holders = []
      const updateHolder = uniqueAddressesArray.map(async(holder) => {
        // console.log(contract)
        balance = await contract.methods.balanceOf(holder).call()
        if (holder == '0x0000000000000000000000000000000000000000') {
          
        } else {
          if(balance > 0) {
            newHolder = {}
            newHolder.address = holder
            newHolder.quantity = balance
            newHolder.percentage = balance / totalSupply
            holders.push(newHolder)
          } 
        }
      })
      await Promise.all(updateHolder);
      const sortedHolders = holders.sort((a, b) => b.quantity - a.quantity)
      const paginateArr = paginateArray(sortedHolders, page, perPage);

      res.status(200).send({
        totalSupply: totalSupply,
        totalNumberHolder: holders.length,
        holdersAddress: paginateArr,
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

      const perPage = parseInt(req.query.limit || 20)
      const page = parseInt(req.query.page || 1)

      const address = req.params.address.toLowerCase()
      const addressToCheckSum = await web3.utils.toChecksumAddress(address)
      const contract = new web3.eth.Contract(minABI, addressToCheckSum)
      const stakeHolders = await prisma.token_transfers.findMany({
        where: {
          token_address: address
        }, 
        select: {
          // from_address: true,
          // to_address: true,
          value: true
        },
      })
      // console.log(stakeHolders)
      // const uniqueAddressesSet = new Set();
      const uniqueTokenIdSet = new Set();

      stakeHolders.forEach(transaction => {
        // uniqueAddressesSet.add(transaction.from_address)
        // uniqueAddressesSet.add(transaction.to_address)
        uniqueTokenIdSet.add(Number(transaction.value))
      })
      // const uniqueAddressesArray  = Array.from(uniqueAddressesSet)
      const uniqueTokenIdArray = Array.from(uniqueTokenIdSet)
      // console.log('uniqueTokenIdArray: ', uniqueTokenIdArray)
      let holders = []
      for (let tokenID of uniqueTokenIdArray) {
        // console.log(contract)
        holder = await contract.methods.ownerOf(tokenID).call()
        console.log(holder)
        newHolder = {}
        newHolder.holder = holder
        newHolder.tokenIDs = tokenID
        holders.push(newHolder)
      }

      const resultObject = holders.reduce((accumulator, currentValue) => {
        const holderKey = currentValue.holder;
        console.log("accumulator: ", accumulator)
        // console.log("currentValue: ", currentValue)
        // console.log("accumulator[holderKey]: ", accumulator[holderKey])
        if (!accumulator[holderKey]) {
          accumulator[holderKey] = { holder: holderKey, tokenIDs: [currentValue.tokenIDs] };
        } else {
          accumulator[holderKey].tokenIDs.push(currentValue.tokenIDs);
        }
        
        return accumulator;
      }, {});
      
      const finalResultArray = Object.values(resultObject);

      finalResultArray.map((holder) => {
        holder.quantity = holder.tokenIDs.length
      })
      
      const paginateArr = paginateArray(finalResultArray, page, perPage)

      res.status(200).send({
        totalSupply: 0,
        totalNumberHolder: finalResultArray.length,
        holdersAddress: paginateArr,
      })

    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }, 
  getERC721_item: async(req, res) => {
    try {
      address = req.params.address.toLowerCase()
      id = req.body.tokenId
      result = {}
      
      const NFT = await prisma.tokens.findUnique({
        where: {
          address: address
        }, 
        select: {
          address: true,
          name: true,
          symbol: true,
          block_timestamp: true
        }
      })
      
      const creator = await prisma.transactions.findFirst({
        where: {
          receipt_contract_address: address
        }, 
        select: {
          hash: true,
          from_address: true
        }
      })
      result.creator = creator
      result.NTF_item = NFT,
      result.tokenId = id

      const tokenTransfers = await prisma.token_transfers.findMany({
        where: { 
          AND: {
            token_address: address,
            value: id
          }
        }
      })

      result.token_transfer = tokenTransfers
      res.status(200).send(toObject(result))
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}

module.exports = AccountController
