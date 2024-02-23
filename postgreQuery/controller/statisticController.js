const prisma = require('../config')
const web3 = require('../web3')
const toObject = (data) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
                            typeof value === 'bigint'
                                ? value.toString()
                                : value // return everything else unchanged
  ))
}
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
      
      // Lấy giá trị của tham số truy vấn từ phần thân của yêu cầu
      const filterOption = req.query.options;
      
      console.log(req.query)
      let startDate;
  
      if (filterOption === '1') {
        startDate = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '2') {
        startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '3') {
        startDate = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);
      } else {
        return res.status(400).json({ error: 'Invalid filter option' });
      }
  
      // Lấy danh sách các giao dịch trong khoảng thời gian đã xác định
      const transactions = await prisma.transactions.findMany({
        where: {
          block_timestamp: {
            gte: startDate,
            lte: currentDate,
          },
        },
        orderBy: {
          block_timestamp: 'asc',
        },
      });
      
      const transactionCountByDay = {};

      transactions.forEach((transaction) => {
        const date = transaction.block_timestamp.toISOString().split('T')[0];
        if (transactionCountByDay[date]) {
          transactionCountByDay[date]++;
        } else {
          transactionCountByDay[date] = 1;
        }
      });

      return res.json({ "transactionStatistics": transactionCountByDay });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = StatisticController;