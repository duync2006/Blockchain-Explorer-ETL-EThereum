// const { exec, spawn } = require('child_process');
// const Web3 = require("web3");
// const Docker = require('dockerode');



// const ExtractController = {
//   extractManual: async(request, response) => {
//     try {
//     startBlock = request.body.startBlockNumber;
//     endBlock = request.body.endBlockNumber;
//     provider = request.body.provider;
//     const web3 = new Web3(provider)
//     if (startBlock == undefined) startBlock = await web3.eth.getBlockNumber()
//     if (endBlock == undefined) endBlock = await web3.eth.getBlockNumber()
    
//     // docker run 
//     // const docker = new Docker({socketPath: '/var/run/docker.sock'});
//     // docker.run(
//     //   'etl_ethereum:latest',
//     //   ['export_all', '-s', `${startBlock}`, '-e', `${endBlock}`, '-b', '10000', '-p', `${provider}`],
//     //   process.stdout,  // Kết quả stdout sẽ được xuất ra terminal của Node.js
//     //   {
//     //       HostConfig: {
//     //         AutoRemove: true // Auto remove container after run
//     //       }
//     //   },
//     //   function(err, data, container) {
//     //       if (err) {
//     //           console.error('Lỗi khi chạy lệnh Docker:', err);
//     //           response.status(500).send(`Command failed with code ${err.code}`);
//     //       }
//     //       // Xử lý kết quả
//     //       response.status(200).send('Command executed successfully');
//     //   })
//     // } catch (error) {
//     //   console.error('Lỗi khi chạy lệnh Docker:', error);
//     //   response.status(500).send(`Command failed with code ${error.code}`);
//     // }
//     // local
//     let path_name = process.cwd()
//     path_name = path_name + '/ethereum-etl/ethereumetl.py'
//     const command = 'python'
//     const args = [path_name,'export_all', '-s', startBlock, '-e', endBlock, '-o', 'output.txt', '-p', provider]

//     const ethereumetlProcess = spawn(command, args)

//     ethereumetlProcess.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//     })

//     ethereumetlProcess.stderr.on('data', (data) => {
//       console.error(`stderr: ${data}`);
//     })

//     ethereumetlProcess.on('close', (code) => {
//       if (code === 0) {
//         // Quá trình kết thúc thành công
//         console.log('Command executed successfully');
//         response.status(200).send('Command executed successfully');
//       } else {
//         // Quá trình kết thúc với lỗi
//         console.error(`Command failed with code ${code}`);
//         response.status(500).send(`Command failed with code ${code}`);
//       }
//     });
//     } catch (error) {
//       console.error('Lỗi khi chạy lệnh Docker:', error);
//       response.status(500).send(`Command failed with code ${error.code}`);
//     }
// },
//   extractAutomatic: async(request, response) => {
//     try {
//       startBlock = request.body.startBlockNumber
//       provider = request.body.provider
//       if (startBlock == undefined) {
//         const web3 = new Web3(provider)
//         startBlock = await web3.eth.getBlockNumber()
//       }
//       database = process.env.DATABASE_URL_FOR_EXTRACT
//       // const docker = new Docker();
//       // docker.run(
//       //   'ethereum-etl:latest',
//       //   ['stream', '-s', `${startBlock}`,'-o', database,'-p', `${provider}`],
//       //   process.stdout,  // Kết quả stdout sẽ được xuất ra terminal của Node.js
//       //   {
//       //   },
//       //   function(err, data, container) {
//       //       if (err) {
//       //           console.error('Lỗi khi chạy lệnh Docker:', err);
//       //       }
//       //       // Xử lý kết quả
//       //       console.log('Kết quả:', data);
//       //   });
//       let path_name = process.cwd()
//       path_name = path_name + '/ethereum-etl/ethereumetl.py'
//       const command = 'python'
      
//       const args = [path_name,'stream', '-s', startBlock, '-o', database, '-p', provider]

//       const ethereumetlProcessAutomate = spawn(command, args)

//       ethereumetlProcessAutomate.stdout.on('data', (data) => {
//         console.log(`stdout: ${data}`);
//       })

//       ethereumetlProcessAutomate.stderr.on('data', (data) => {
//         console.error(`stderr: ${data}`);
//       })

//       response.status(200).send(`Command Executing with Process ID: ${ethereumetlProcessAutomate.pid} \nMust call api to stop before call automate again!`)
//     } catch (err) {
//       console.log(err)
//       response.status(500).send(`Command failed with code ${err.code}`);
//     }
    
//   },

//   stopAutomateExtract: (request, response) => {
//     try {
//       const pid = request.params.pid
//       process.kill(pid); // Dừng child process nếu tồn tại
//       response.status(200).send("Stopping Automate Extract");
//     } catch (err) {
//       console.log(err)
//       response.status(500).send("Failed");
//     }
//   },

//   extractWithDecodeLog: async (request, response) => {
//     try {
//       startBlock = request.body.startBlockNumber;
//       endBlock = request.body.endBlockNumber;
//       provider = request.body.provider;
//       const web3 = new Web3(provider)
//       if (startBlock == undefined) startBlock = await web3.eth.getBlockNumber()
//       if (endBlock == undefined) endBlock = await web3.eth.getBlockNumber()
//       const hostOutputPath = `${process.env.HOME}/output`;
//       const docker = new Docker({socketPath: '/var/run/docker.sock'});
//       docker.run(
//         'etl_ethereum_decode_log:latest',
//         ['export_all', '-s', `${startBlock}`, '-e', `${endBlock}`, '-b', '10000', '-p', `${provider}`],
//         process.stdout,  // Kết quả stdout sẽ được xuất ra terminal của Node.js
//         {
//             HostConfig: {
//               AutoRemove: true // Auto remove container after run
//             }
//         },
//         function(err, data, container) {
//             if (err) {
//                 console.error('Lỗi khi chạy lệnh Docker:', err);
//                 response.status(500).send(`Command failed with code ${err.code}`);
//             }
//             // Xử lý kết quả
//             response.status(200).send('Command executed successfully');
//         })
//       } catch (error) {
//         console.error('Lỗi khi chạy lệnh Docker:', error);
//         response.status(500).send(`Command failed with code ${error.code}`);
//       }
//   }

// }

// module.exports = ExtractController
