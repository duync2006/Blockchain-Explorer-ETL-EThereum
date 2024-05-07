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
Build postgres image: 
```bash
cd .\database 
docker build -t postgres:2.0.0 .
```
Build Decode Log Service: 
```bash
cd .\decodeLogService\
docker build -t decode_log:1.0.0 .
```

Build dissassembly smartcontract service: 

```bash
cd .\dissassemblyService\
docker build -t decompile_contract:1.0.0 .
```

Build ETL Service
```bash
cd .\dissassamblyService
docker build -t etl_ethereum:1.0.0
```
Build Explorer Service
```bash
cd .\postgreQuery\
docker build -t explorer_service:1.0.0
```

Run docker compose: 
```bash
docker compose up
```



