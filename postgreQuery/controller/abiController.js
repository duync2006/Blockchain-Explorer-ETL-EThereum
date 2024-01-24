// const eventModel = require('../../model/event')
const prisma = require('../config')
const web3 = require('../web3')
const AbiController = {
  addContractAbi: async(request, response) => {
    const contract_address = request.body.contract_address
    const abi = request.body.abi
    // console.log(contract_address)
    // console.log(abi)
    if (contract_address) {
      try {
        await prisma.abis.create({
          data: {
            contract_address: contract_address,
            abi: abi
          }
        })
        response.status(200).send("Add Contract Abi Success")
      } catch (e) {
        // console.log(err)
          // The .code property can be accessed in a type-safe manner
          if (e.code === 'P2002') {
            response.status(500).send(
              'There is a unique constraint violation, a new contract abi cannot be created with this contract address'
            )
          }
          // response.status(500).send("Add failed")
        }
        
    } else {
      eventObjects = abi.filter(obj => obj.type === 'event')
      functionObjects = abi.filter(obj => obj.type === 'function')
      // console.log("eventObjects: ", eventObjects)
      try{
        for (let log of eventObjects) {
          topic0 = web3.eth.abi.encodeEventSignature(log);
          const existingAbi = await prisma.event_signatures.findUnique({where:{topic_0: topic0}})
          if (existingAbi) {
            // console.log("existingAbi: ", existingAbi)
            // console.log("log.input", log.inputs)
            existingAbi.inputs.push(log)
            // console.log(log.inputs)
            await prisma.event_signatures.update({
              where: {
                topic_0: existingAbi.topic_0
              },
              data: {
                inputs: existingAbi.inputs
              }
            })
          } else { 
            await prisma.event_signatures.create({
              data: {
                topic_0: topic0,
                inputs: [log],
                event_name: log.name
              }
            })
        }
      }
      
      for(let func of functionObjects) {
          selector_encode = web3.eth.abi.encodeFunctionSignature({
            name: func.name,
            type: 'function',
            inputs: func.inputs
          })
          
          await prisma.function_signature.create({
            data: {
              selector: selector_encode,
              func_name: func.name,
              inputs: [func]
            }
          })
      }
    } catch (err) {
      console.log(err)
      response.status(500).send(err)
    }
    response.status(200).send("success")
  }
}
  
}

module.exports = AbiController