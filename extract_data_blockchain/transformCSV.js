

// 0 - block, transaction || 1 - log || 2 receipt || 3 Token Transfer || 4-trace
// let i = 0;
const transform_CSV = (csvFile, arr, type) => {
  return new Promise((resolve, reject) => {
    const stream = fs
      .createReadStream(csvFile)
      .pipe(csv())
      .on("data", (row) => {
        if (type == 0) {
          if (row.hash && row.hash != "\n") {
            if (row.hash.substr(0, 1) == "\n") row.hash = row.hash.slice(1, 67);
            arr.push(row);
          }
        }
        if (type == 1) {
          // console.log(typeof(row.topics))
          if (row.transaction_hash) {
            // console.log(row)
            // let topicArray = handleTopics(row.topics);
            // if (topicArray.type == "transfer") {
            //   const decode = decodeLog(
            //     row.data,
            //     topicArray.topicArray,
            //     transferAbi
            //   );
            //   row.decode = JSON.stringify(decode);
            // } else if (topicArray.type == "unfreeze") {
            //   const decode = decodeLog(
            //     row.data,
            //     topicArray.topicArray,
            //     unfreezeAbi
            //   );
            //   row.decode = JSON.stringify(decode);
            // }
            let log = LogModel(row);
            arr.push(log);
          }
        }
        if (type == 2) {
          if (row.transaction_hash && row.transaction_hash != "\n") {
            if (row.transaction_hash.substr(0, 1) == "\n")
              row.transaction_hash = row.transaction_hash.slice(1, 67);
            arr.push(row);
          }
        }
        if (type == 3) {
          if (row.token_address && row.token_address != "\n") {
            if (row.token_address.substr(0, 1) == "\n")
              row.token_address = row.token_address.slice(1, 67);
            arr.push(row);
          }
        }
      //   if (type == 4) {
      //     // console.log(row)
      //     if (row.transaction_traces) {
      //       const jsonArray = row.transaction_traces
      //         .split("},{")
      //         .map((item, index, array) => {
      //           console.log("item:", typeof(item))
      //           if (index === 0) {
      //             return {
      //               block_number: row.block_number.trim(),
      //               ...JSON.parse(item + "}"),
      //             };
      //           } else if (index === array.length - 1) {
      //             return {
      //               block_number: row.block_number.trim(),
      //               ...JSON.parse("{" + item),
      //             };
      //           } else {
      //             return {
      //               block_number: row.block_number.trim(),
      //               ...JSON.parse("{" + item + "}"),
      //             };
      //           }
      //         });
      //         console.log(jsonArray)
      //       arr.push(...jsonArray);
      //     }
      //   }
      })
      .on("end", () => {
        resolve();
      });
    }
  )}

// const decodeLog = (data, topics, abi) => {
//   const decodeLogsData = web3.eth.abi.decodeLog(abi, data, topics);
//   // console.log("Log Object Decode: ", typeof(decodeLogsData))
//   return decodeLogsData;
// };

// const handleTopics = (topics) => {
//   if (topics) {
//     firstTopic = topics.substr(0, 66);
//     // console.log(firstTopic, '\n')

//     if (
//       firstTopic ==
//       "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
//     ) {
//       firstIndex = topics.substr(67, 66);
//       secondIndex = topics.substr(134, 66);
//       thirdIndex = topics.substr(201, 66);
//       return {
//         type: "transfer",
//         topicArray: [firstIndex, secondIndex, thirdIndex],
//       };
//     } else if (
//       (firstTopic =
//         "0xe2babfd5e77285a3c3dbc4b25592cbe4a7a26e97a7ac63067a22ebdaa9b82add")
//     ) {
//       return { type: "unfreeze", topicArray: [] };
//     }
//   }
//   return { type: "", topicArray: [] }
// };