# Vibi ETL Ethereum
An application used to extracting blockchain data with both GETH and PARITY node.

# How to run

## Clone Source Code
- Clone down this repository via this link: _https://github.com/duync2006/Blockchain-Explorer-ETL-EThereum.git

## docker
Windows: 
```bash
docker build -t postgres:2.0.0 .\database\.
docker build -t decode_log:1.0.0 .\decodeLogService\.
docker build -t decompile_contract:1.0.0 .\dissassemblyService\.
docker build -t etl_ethereum:1.0.0 .\ethereum-etl\.
docker build -t explorer_service:1.0.0 .\postgreQuery\.

```
Linux:
```bash
sudo docker build -t postgres:2.0.0 ./database/.
sudo docker build -t decode_log:1.0.0 ./decodeLogService/.
sudo docker build -t decompile_contract:1.0.0 ./dissassemblyService/.
sudo docker build -t etl_ethereum:1.0.0 ./ethereum-etl/.
sudo docker build -t explorer_service:1.0.0 ./postgreQuery/.
```

## Config .env file
```bash
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_DB=${POSTGRES_DB}

DATABASE_URL = 'postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]'
DATABASE_URL_FOR_EXTRACT = 'postgresql+pg8000://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]'

RABBITMQ=${rabbitmq_host}
PROVIDER=${BLOCKCHAIN_RPC}
```

## Run docker compose: 
```bash
docker compose up
```



