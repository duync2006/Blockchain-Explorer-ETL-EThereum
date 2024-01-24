const { exec, spawn } = require('child_process');


const ExtractController = {
  extractManual: async(request, response) => {
    startBlock = request.body.startBlockNumber;
    endBlock = request.body.endBlockNumber;
    provider = request.body.provider;
    // exec(`ethereumetl export_all -s ${startBlock} -e ${endBlock} -o output.txt -p ${provider}`, (err, stdout, stderr) => {
    //   if(err) {
    //     console.log(err)
    //     response.status(500).send(err)
    //   }
    // })
    // response.status(200).send("Extract Success")
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
      database = process.env.DATABASE_URL_FOR_EXTRACT
      //   this.childProcess = await exec(`ethereumetl stream --start-block ${startBlock} \
      //   --provider-uri ${provider} \
      //   --output ${database}`, (err, stdout, stderr) => {
      //     if(err) {
      //       console.log(err)
      //       response.status(500).send(err)
      //     }
      //     console.log(stdout)
      //     console.log(stderr)
      // })
      const command = 'ethereumetl'
      const args = ['stream', '-s', startBlock, '-o', database, '-p', provider]

      const ethereumetlProcessAutomate = spawn(command, args)

      // spawn(`ethereumetl stream --start-block ${startBlock} \
      //    --provider-uri ${provider} \
      //    --output ${database}`, { shell: true })
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
