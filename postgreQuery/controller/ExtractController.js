const { exec, spawn } = require('child_process');
const Web3 = require("web3");

const ExtractController = {
  extractManual: async(request, response) => {
    startBlock = request.body.startBlockNumber;
    endBlock = request.body.endBlockNumber;
    provider = request.body.provider;
    // if (startBlock == undefined || endBlock == undefined) {
    //   const web3 = new Web3(provider)
    //   startBlock = await web3.eth.getBlockNumber()
    //   endBlock = startBlock
    // }
    const web3 = new Web3(provider)
    if (startBlock == undefined) startBlock = await web3.eth.getBlockNumber()
    if (endBlock == undefined) endBlock = await web3.eth.getBlockNumber()
    const command = 'ethereumetl'
    const args = ['export_all', '-s', startBlock, '-e', endBlock, '-o', 'output.txt', '-p', provider]

    const ethereumetlProcess = spawn(command, args)

    ethereumetlProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    })

    ethereumetlProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    })

    ethereumetlProcess.on('close', (code) => {
      if (code === 0) {
        // Quá trình kết thúc thành công
        console.log('Command executed successfully');
        response.status(200).send('Command executed successfully');
      } else {
        // Quá trình kết thúc với lỗi
        console.error(`Command failed with code ${code}`);
        response.status(500).send(`Command failed with code ${code}`);
      }
    });

},
  extractAutomatic: async(request, response) => {
    try {
      startBlock = request.body.startBlockNumber
      provider = request.body.provider
      if (startBlock == undefined) {
        const web3 = new Web3(provider)
        startBlock = await web3.eth.getBlockNumber()
      }
      database = process.env.DATABASE_URL_FOR_EXTRACT
      const command = 'ethereumetl'
      const args = ['stream', '-s', startBlock, '-o', database, '-p', provider]

      const ethereumetlProcessAutomate = spawn(command, args)

      ethereumetlProcessAutomate.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      })

      ethereumetlProcessAutomate.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      })

      response.status(200).send(`Command Executing with Process ID: ${ethereumetlProcessAutomate.pid} \nMust call api to stop before call automate again!`)
    } catch (err) {
      response.status(500).send(`Command failed with code ${err.code}`);
    }
    
  },

  stopAutomateExtract: (request, response) => {
    try {
      const pid = request.params.pid
      process.kill(pid); // Dừng child process nếu tồn tại
      response.status(200).send("Stopping Automate Extract");
    } catch (err) {
      console.log(err)
      response.status(400).send("No Extract Process Running");
    }
  }
}

module.exports = ExtractController
