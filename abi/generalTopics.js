const GeneralAbi = {
  generalTopics: [
    // Approval(address,address,uint256)
    "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",

    // Transfer(address,address,uint256)
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",

    // ApprovalForAll(address owner, address operator, bool approved)
    "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31",

    // Unfreeze(uint256)
    "0xe2babfd5e77285a3c3dbc4b25592cbe4a7a26e97a7ac63067a22ebdaa9b82add",

    //OwnershipTransferred (index_topic_1 address previousOwner, index_topic_2 address newOwner)

    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0",

    //UserOperationEvent (index_topic_1 address userOpHash, index_topic_2 address sender, index_topic_3 address paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)
    "0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f",

    //Deposited(index_topic_1 address account, uint256 value)
    "0x2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c4",

    //BeforeExecution ()
    "0xbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972"

  ],

  abi: {
    "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": [
      { type: "address", name: "from", indexed: true },
      { type: "address", name: "to", indexed: true },
      { type: "uint256", name: "tokenId", indexed: false},
    ],
    "transfer": [
      { type: "address", name: "from", indexed: true },
      { type: "address", name: "to", indexed: true },
      { type: "uint256", name: "tokenId", indexed: true},
    ],
    "e2babfd5e77285a3c3dbc4b25592cbe4a7a26e97a7ac63067a22ebdaa9b82add": [{ type: "uint256", name: "tokenId", indexed: false }],
    "8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
    "8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": [
      { type: "address", name: "previousOwner", indexed: true },
      { type: "address", name: "newOwner", indexed: true }
    ],
    "49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f": [
      { type: "bytes", name: "userOpHash", indexed: true },
      { type: "address", name: "sender", indexed: true },
      { type: "bytes", name: "paymaster", indexed: true },
      { type: "uint256", name: "nonce", indexed: false },
      { type: "bool", name: "success", indexed: false },
      { type: "uint256", name: "actualGasCost", indexed: false },
      { type: "uint256", name: "actualGasUsed", indexed: false },
    ],
    "2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c4": [
      { type: "address", name: "account", indexed: true },
      { type: "uint256", name: "value", indexed: false },
    ],
    "bb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972":[]
  },
  abiName: {
    "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": "Transfer (index_topic_1 address from, index_topic_2 address to, uint256 tokens)",
    "e2babfd5e77285a3c3dbc4b25592cbe4a7a26e97a7ac63067a22ebdaa9b82add": "Unfreeze (uint256 tokenId)",
    "8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925":"Approval (index_topic_1 address owner, index_topic_2 address approved, index_topic_3 uint256 tokenId)",
    "transfer": "Transfer (index_topic_1 address from, index_topic_2 address to,index_topic_3 uint256 tokens)",
    "49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f":"UserOperationEvent (index_topic_1 address userOpHash, index_topic_2 address sender, index_topic_3 address paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)",
    "2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c4":"Deposited (index_topic_1 address account, uint256 value)",
    "bb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972":"BeforeExecution ()",
    "8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": "OwnershipTransferred (index_topic_1 address previousOwner, index_topic_2 address newOwner)"
  }
};

module.exports = GeneralAbi;
