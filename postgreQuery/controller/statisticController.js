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
        // 1d
        startDate = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        const result = await prisma.$queryRaw`SELECT \
                  DATE_TRUNC('hour', block_timestamp) AS timestamp,\
                  SUM(total_transaction) AS quantity\
              FROM transactions_statistic_in_one_month WHERE block_timestamp >= ${startDate} and block_timestamp <= ${currentDate}\
              GROUP BY timestamp\
              ORDER BY timestamp DESC;`

        return res.json(toObject(result))
      } else if (filterOption === '2') {
        // 1 week
        startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        const result = await prisma.$queryRaw`SELECT \
                  DATE_TRUNC('day', block_date) AS timestamp,\
                  SUM(total_transaction) AS quantity\
              FROM transaction_statistic WHERE block_date >= ${startDate} and block_date <= ${currentDate}\
              GROUP BY timestamp\
              ORDER BY timestamp DESC;`

        return res.json(toObject(result))
      } else if (filterOption === '3') {
        // 1 month
        startDate = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        const result = await prisma.$queryRaw`SELECT \
                  DATE_TRUNC('week', block_date) AS timestamp,\
                  SUM(total_transaction) AS quantity\
              FROM transaction_statistic WHERE block_date >= ${startDate} and block_date <= ${currentDate}\
              GROUP BY timestamp\
              ORDER BY timestamp DESC;`
        return res.json(toObject(result))
      } else if (filterOption === '4') {
        startDate = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000);
        const result = await prisma.$queryRaw`SELECT \
                  DATE_TRUNC('month', block_date) AS timestamp,\
                  SUM(total_transaction) AS quantity\
              FROM transaction_statistic WHERE block_date >= ${startDate} and block_date <= ${currentDate}\
              GROUP BY timestamp\
              ORDER BY timestamp DESC;`
        return res.json(toObject(result))
      } else if (filterOption === '5') {
        startDate = new Date(currentDate.getTime() - 2* 365 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '6') {
        startDate = new Date(currentDate.getTime() - 3* 365 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '7') {
        startDate = new Date(currentDate.getTime() - 4* 365 * 24 * 60 * 60 * 1000);
      } else if (filterOption === '8') {
        startDate = new Date(currentDate.getTime() - 5* 365 * 24 * 60 * 60 * 1000);
      }
      else {
        return res.status(400).json({ error: 'Invalid filter option' });
      }
      // const transactions = await prisma.$queryRaw`SELECT * FROM transaction_statistic where block_date >= ${startDate} and block_date <= ${currentDate} order by block_date DESC`

      const result = await prisma.$queryRaw`SELECT \
                  DATE_TRUNC('quarter', block_date) AS timestamp,\
                  SUM(total_transaction) AS quantity\
              FROM transaction_statistic WHERE block_date >= ${startDate} and block_date <= ${currentDate}\
              GROUP BY timestamp\
              ORDER BY timestamp DESC;`
      return res.json(toObject(result))
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

const filter = async (objs, option) => {
  

}

const getWeekData = (date) => {
  const year = date.getFullYear();
  const week = Math.floor((date.getDate() - 1) / 7) + 1;
  return { year, week };
};

const result = (transactions) =>{
  transactions.reduce((acc, curr) => {
    const { year, week } = getWeekData(new Date(curr.block_date));
    const weekKey = `week${week}`;
    if (!acc[weekKey]) {
      acc[weekKey] = {
        date: `${year}-W${week}-1 - ${year}-W${week}-7`,
        totalTransaction: 0,
      };
    }
    acc[weekKey].totalTransaction += curr.total_transaction;
    return acc;
  }, {});
}




module.exports = StatisticController;