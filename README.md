# Vibi ETL Ethereum
An application used to extracting blockchain data with both GETH and PARITY node.

# How to run

## Clone Source Code
- Clone down this repository via this link: _https://github.com/duync2006/Blockchain-Explorer-ETL-EThereum.git
## Install python package etl-ethereum
Install Ethereum ETL:

```bash
pip3 install ethereum-etl
```
## Install node package 
```bash
> cd .\postgreQuery\
> npm install
```

## Config .env file
```bash
> cd .\postgreQuery\
> touch .env
```
Set Your Postgre Database for .env: 

DATABASE_URL = 'postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]'
DATABASE_URL_FOR_EXTRACT = 'postgresql+pg8000://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]'
