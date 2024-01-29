const { model } = require('mongoose')
const prisma = require('../config')

const DeleteController = {
  deleteTransactions: async(req, res) => {
    try {
      const deleteTransactions = await prisma.transactions.deleteMany({})
      res.status(200).send('Delete Transactions Success')
    } catch (error) {
      res.status(500).send('Delete Transactions Failed')
    }
  },
  deleteBlocks: async(req, res) => {
    try {
      const deleteTransactions = await prisma.blocks.deleteMany({})
      res.status(200).send('Delete blocks Success')
    } catch (error) {
      res.status(500).send('Delete blocks Failed')
    }
  },
  deleteLogs: async(req, res) => {
    try {
      const deleteTransactions = await prisma.logs.deleteMany({})
      res.status(200).send('Delete logs Success')
    } catch (error) {
      res.status(500).send('Delete logs Failed')
    }
  },
  deleteTokens: async(req, res) => {
    try {
      const deleteTransactions = await prisma.tokens.deleteMany({})
      res.status(200).send('Delete tokens Success')
    } catch (error) {
      res.status(500).send('Delete tokens Failed')
    }
  },
  deleteTokenTransfers: async(req, res) => {
    try {
      const deleteTransactions = await prisma.token_transfers.deleteMany({})
      res.status(200).send('Delete token_transfers Success')
    } catch (error) {
      res.status(500).send('Delete token_transfers Failed')
    }
  },
  deleteContracts: async(req, res) => {
    try {
      const deleteTransactions = await prisma.contracts.deleteMany({})
      res.status(200).send('Delete contracts Success')
    } catch (error) {
      res.status(500).send('Delete contracts Failed')
    }
  },
  deleteTraces: async(req, res) => {
    try {
      const deleteTransactions = await prisma.traces.deleteMany({})
      res.status(200).send('Delete traces Success')
    } catch (error) {
      res.status(500).send('Delete traces Failed')
    }
  },
  deleteAll: async(req, res) => {
    try {
      const deleteTransactions = await prisma.transactions.deleteMany()
      const deleteBlocks = await prisma.blocks.deleteMany()
      const deleteLogs = await prisma.logs.deleteMany()
      const deleteTraces = await prisma.traces.deleteMany()
      const deleteTokens = await prisma.tokens.deleteMany()
      const deleteToken_transfers = await prisma.token_transfers.deleteMany()
      const deleteContracts = await prisma.contracts.deleteMany()

      await prisma.$transaction([deleteTransactions, deleteBlocks, deleteLogs, deleteTraces, deleteTokens, deleteToken_transfers, deleteContracts])
      res.status(200).send('Delete all Success')
    } catch (error) {
      res.status(500).send('Delete all Failed')
    }
  }, 
  deleteGethTraces: async(req, res) => {
    try {
       
    } catch (error) {
      
    }
  }
}

module.exports = DeleteController