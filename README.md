# Vibi ETL Ethereum
An application used to extracting blockchain data with both GETH and PARITY node.

# How to run

## Clone Source Code
- Clone down this repository via this link: _https://github.com/duync2006/Blockchain-Explorer-ETL-EThereum.git
  
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

```bash
DATABASE_URL = 'postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]'
DATABASE_URL_FOR_EXTRACT = 'postgresql+pg8000://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]'
```

## docker
Build images: 
```bash
docker build -t postgres:2.0.0 .\database\.
docker build -t decode_log:1.0.0 .\decodeLogService\.
docker build -t decompile_contract:1.0.0 .\dissassemblyService\.
docker build -t etl_ethereum:1.0.0 .\ethereum-etl\.
docker build -t explorer_service:1.0.0 .\postgreQuery\.

```

Run docker compose: 
```bash
docker compose up
```



