const prisma = require('../config')
const web3 = require('../web3')
const toObject = require('../helpers/toObject')

const StatisticController = {
  dashboardStatistic: async(req, res) => {
    const totalTransaction = await prisma.transactions.count()
    const finalizedBlock = await web3.eth.getBlockNumber()
    
    const currentDate = new Date();
    const fourteenDaysAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    const transactionsWithin14Days = await prisma.transactions.findMany({
      where: {
        block_timestamp: {
          gte: fourteenDaysAgo,
          lte: currentDate,
        },
      },
      orderBy: {
        block_timestamp: 'desc',
      },
    });

    const transactionCountByDay = {};

    transactionsWithin14Days.forEach((transaction) => {
      const date = transaction.block_timestamp.toISOString().split('T')[0];
      if (transactionCountByDay[date]) {
        transactionCountByDay[date]++;
      } else {
        transactionCountByDay[date] = 1;
      }
    });
    console.log('Number of transactions each day within the last 14 days:', transactionCountByDay);
    res.status(200).json({
      'totalTransaction': totalTransaction,
      'lastFinalizedBlock': finalizedBlock,
      'transactionCountBy14Days': toObject(transactionCountByDay)
    })
  },

  filterNumberTrans: async(req, res) => {
    try {
      const currentDate = new Date();
      console.log(currentDate.toISOString().split('T')[0])
      // Lấy giá trị của tham số truy vấn từ phần thân của yêu cầu
      const filterOption = req.query.options;

      let startDate;
  
      if (filterOption === '1') {
        startDate = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '2') {
        startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '3') {
        startDate = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '4') {
        startDate = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '5') {
        startDate = new Date(currentDate.getTime() - 2* 365 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '6') {
        startDate = new Date(currentDate.getTime() - 3* 365 * 24 * 60 * 60 * 1000);
      }
      else {
        return res.status(400).json({ error: 'Invalid filter option' });
      }
  
      // Lấy danh sách các giao dịch trong khoảng thời gian đã xác định
      // const transactions = await prisma.transaction_partition.findMany({
      //   where: {
      //     block_timestamp: {
      //       gte: startDate,
      //       lte: currentDate,
      //     },
      //   },
      //   orderBy: {
      //     block_timestamp: 'asc',
      //   },
      // });
      const transactions = await prisma.$queryRaw`SELECT block_timestamp FROM transaction_partition where block_timestamp >= ${startDate} and block_timestamp <= ${currentDate}`

      const transactionCountByDay = {};

      const promise = transactions.map((transaction) => {
        const date = transaction.block_timestamp.toISOString().split('T')[0];
        if (transactionCountByDay[date]) {
          transactionCountByDay[date]++;
        } else {
          transactionCountByDay[date] = 1;
        }
      });
      await Promise.all(promise)
      const convertArrayOfObjects = Object.entries(transactionCountByDay).map(([date, quantity]) => ({
        date,
        quantity
      }));
      const arrayOfObjects =  await Promise.all(convertArrayOfObjects)
      return res.json(arrayOfObjects);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = StatisticController;