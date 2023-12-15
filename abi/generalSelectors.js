const GeneralSelectors = {
  selectors: [
  // transfer(address to,uint256 value)
  "0xa9059cbb",

  // approve(address spender,uint256 value)
  "0x095ea7b3",

  //transferFrom(address from,address to,uint256 value)
  "0x23b872dd",

  //safeMint(address to, uint256 tokenId)
  "0xa1448194",
  
  //safeTransferFrom(address from, address to, uint256 tokenId)
  "0x42842e0e",

  //transferOwnership(address newOwner)
  "0xf2fde38b",

  //renounceOwnership()
  "0x715018a6",

  //mint(address _account, uint256 _amount)
  "0x40c10f19",

  //mint()
  "0x1249c58b",

  // /handleOps(tuple[] ops,address beneficiary)
  //handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[], address)
  "0x1fad948c"
  ],

  params: {
    "a9059cbb": ['address','uint256'],
    "095ea7b3": ['address', 'uint256'],
    "23b872dd": ['address','address','uint256'],
    "a1448194": ['address','uint256'],
    "42842e0e": ['address', 'address', 'uint256'],
    "f2fde38b": ['address'],
    "715018a6": [],
    "40c10f19": ['address', 'uint256'],
    "1249c58b": [],
    "1fad948c": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "one",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "two",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "three",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "four",
						"type": "bytes"
					},
					{
						"internalType": "uint256",
						"name": "five",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "six",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "seven",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "eight",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "nine",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "ten",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "eleven",
						"type": "bytes"
					}
				],
				"internalType": "struct Todos.Todo[]",
				"name": "",
				"type": "tuple[]"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		]
  },

  name: {
    "a9059cbb": 'transfer(address to,uint256 value)',
    "095ea7b3": 'approve(address spender,uint256 value)',
    "23b872dd": 'transferFrom(address from,address to,uint256 value)',
    "a1448194": 'safeMint(address to, uint256 tokenId)',
    "42842e0e": 'safeTransferFrom(address from, address to, uint256 tokenId)',
    'f2fde38b': 'transferOwnership(address newOwner)',
    "715018a6": 'renounceOwnership()',
    "40c10f19": 'mint(address _account, uint256 _amount)',
    "1249c58b": 'mint()',
    "1fad948c": 'handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[], address)'
  }
}

module.exports = GeneralSelectors



// [
// 	{
// 		"inputs": [
// 			{
// 				"components": [
// 					{
// 						"internalType": "address",
// 						"name": "one",
// 						"type": "address"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "two",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "bytes",
// 						"name": "three",
// 						"type": "bytes"
// 					},
// 					{
// 						"internalType": "bytes",
// 						"name": "four",
// 						"type": "bytes"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "five",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "six",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "seven",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "eight",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "nine",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "bytes",
// 						"name": "ten",
// 						"type": "bytes"
// 					},
// 					{
// 						"internalType": "bytes",
// 						"name": "eleven",
// 						"type": "bytes"
// 					}
// 				],
// 				"internalType": "struct Todos.Todo[]",
// 				"name": "",
// 				"type": "tuple[]"
// 			},
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"name": "handleOps",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	}
// ]