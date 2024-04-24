-- CreateTable
CREATE TABLE "blocks" (
    "timestamp" TIMESTAMP(6),
    "number" BIGINT,
    "hash" VARCHAR(66) NOT NULL,
    "parent_hash" VARCHAR(66),
    "nonce" VARCHAR(42),
    "sha3_uncles" VARCHAR(66),
    "logs_bloom" TEXT,
    "transactions_root" VARCHAR(66),
    "state_root" VARCHAR(66),
    "receipts_root" VARCHAR(66),
    "miner" VARCHAR(42),
    "difficulty" DECIMAL,
    "total_difficulty" DECIMAL,
    "size" BIGINT,
    "extra_data" TEXT,
    "gas_limit" BIGINT,
    "gas_used" BIGINT,
    "transaction_count" BIGINT,
    "base_fee_per_gas" BIGINT,

    CONSTRAINT "blocks_pk" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "contracts" (
    "address" VARCHAR(42) NOT NULL,
    "bytecode" TEXT,
    "function_sighashes" TEXT[],
    "is_erc20" BOOLEAN,
    "is_erc721" BOOLEAN,
    "block_number" BIGINT,
    "block_hash" VARCHAR(66),
    "block_timestamp" TIMESTAMP(6),
    "creator" VARCHAR(42),

    CONSTRAINT "contracts_pk" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "logs" (
    "log_index" BIGINT NOT NULL,
    "transaction_hash" VARCHAR(66) NOT NULL,
    "transaction_index" BIGINT,
    "address" VARCHAR(42),
    "data" TEXT,
    "topic0" VARCHAR(66),
    "topic1" VARCHAR(66),
    "topic2" VARCHAR(66),
    "topic3" VARCHAR(66),
    "block_timestamp" TIMESTAMP(6),
    "block_number" BIGINT,
    "block_hash" VARCHAR(66),
    "decode" JSON,

    CONSTRAINT "logs_pk" PRIMARY KEY ("transaction_hash","log_index")
);

-- CreateTable
CREATE TABLE "test" (
    "Value" CHAR(1)
);

-- CreateTable
CREATE TABLE "token_transfers" (
    "token_address" VARCHAR(42),
    "from_address" VARCHAR(42),
    "to_address" VARCHAR(42),
    "value" DECIMAL(78,0),
    "transaction_hash" VARCHAR(66) NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_timestamp" TIMESTAMP(6),
    "block_number" BIGINT,
    "block_hash" VARCHAR(66),

    CONSTRAINT "token_transfers_pk" PRIMARY KEY ("transaction_hash","log_index")
);

-- CreateTable
CREATE TABLE "tokens" (
    "address" VARCHAR(42) NOT NULL,
    "name" TEXT,
    "symbol" TEXT,
    "decimals" INTEGER,
    "total_supply" DECIMAL(78,0),
    "block_number" BIGINT,
    "block_hash" VARCHAR(66),
    "block_timestamp" TIMESTAMP(6),

    CONSTRAINT "tokens_pk" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "traces" (
    "transaction_hash" VARCHAR(66),
    "transaction_index" BIGINT,
    "from_address" VARCHAR(42),
    "to_address" VARCHAR(42),
    "value" DECIMAL(38,0),
    "input" TEXT,
    "output" TEXT,
    "trace_type" VARCHAR(16),
    "call_type" VARCHAR(16),
    "reward_type" VARCHAR(16),
    "gas" BIGINT,
    "gas_used" BIGINT,
    "subtraces" BIGINT,
    "trace_address" VARCHAR(8192),
    "error" TEXT,
    "status" INTEGER,
    "block_timestamp" TIMESTAMP(6),
    "block_number" BIGINT,
    "block_hash" VARCHAR(66),
    "trace_id" TEXT NOT NULL,

    CONSTRAINT "traces_pk" PRIMARY KEY ("trace_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "hash" VARCHAR(66) NOT NULL,
    "nonce" BIGINT,
    "transaction_index" BIGINT,
    "from_address" VARCHAR(42),
    "to_address" VARCHAR(42),
    "value" DECIMAL(38,0),
    "gas" BIGINT,
    "gas_price" BIGINT,
    "input" TEXT,
    "receipt_cumulative_gas_used" BIGINT,
    "receipt_gas_used" BIGINT,
    "receipt_contract_address" VARCHAR(42),
    "receipt_root" VARCHAR(66),
    "receipt_status" BIGINT,
    "block_timestamp" TIMESTAMP(6),
    "block_number" BIGINT,
    "block_hash" VARCHAR(66),
    "max_fee_per_gas" BIGINT,
    "max_priority_fee_per_gas" BIGINT,
    "transaction_type" BIGINT,
    "receipt_effective_gas_price" BIGINT,
    "receipt_l1_fee" BIGINT,
    "receipt_l1_gas_used" BIGINT,
    "receipt_l1_gas_price" BIGINT,
    "receipt_l1_fee_scalar" DECIMAL,
    "decodeInput" JSON,

    CONSTRAINT "transactions_pk" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "abis" (
    "contract_address" CHAR(42) NOT NULL,
    "abi" JSON,

    CONSTRAINT "contract_address" PRIMARY KEY ("contract_address")
);

-- CreateTable
CREATE TABLE "event_signatures" (
    "topic_0" VARCHAR(66) NOT NULL,
    "event_name" TEXT,
    "inputs" JSON,

    CONSTRAINT "event_signatures_pkey" PRIMARY KEY ("topic_0")
);

-- CreateTable
CREATE TABLE "function_signature" (
    "selector" VARCHAR(10) NOT NULL,
    "func_name" TEXT NOT NULL,
    "inputs" JSON,

    CONSTRAINT "function_signature_pkey" PRIMARY KEY ("selector","func_name")
);

-- CreateTable
CREATE TABLE "geth_traces" (
    "from_address" VARCHAR(42),
    "to_address" VARCHAR(42),
    "value" DECIMAL(38,0),
    "input" TEXT,
    "output" TEXT,
    "trace_type" VARCHAR(16),
    "call_type" VARCHAR(16),
    "gas" BIGINT,
    "gas_used" BIGINT,
    "block_timestamp" TIMESTAMP(6),
    "block_number" BIGINT,
    "trace_id" TEXT NOT NULL,
    "transaction_hash" TEXT,
    "trace_address" TEXT,

    CONSTRAINT "geth_traces_pk" PRIMARY KEY ("trace_id")
);

-- CreateTable
CREATE TABLE "t1" (
    "id" INTEGER,
    "year_col" INTEGER
);

-- CreateTable
CREATE TABLE "transaction_statistic" (
    "block_date" DATE NOT NULL,
    "total_transaction" INTEGER,

    CONSTRAINT "transaction_statistic_pkey" PRIMARY KEY ("block_date")
);

-- CreateTable
CREATE TABLE "transactions_statistic_in_one_month" (
    "block_timestamp" TIMESTAMP(6) NOT NULL,
    "total_transaction" INTEGER,

    CONSTRAINT "transactions_statistic_in_one_month_pkey" PRIMARY KEY ("block_timestamp")
);

-- CreateIndex
CREATE UNIQUE INDEX "blocks_number_uindex" ON "blocks"("number" DESC);

-- CreateIndex
CREATE INDEX "blocks_timestamp_index" ON "blocks"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "contracts_address_index" ON "contracts"("address" DESC);

-- CreateIndex
CREATE INDEX "logs_address_index" ON "logs"("address" DESC);

-- CreateIndex
CREATE INDEX "token_transfers_block_timestamp_index" ON "token_transfers"("block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "token_transfers_from_address_block_timestamp_index" ON "token_transfers"("from_address", "block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "token_transfers_to_address_block_timestamp_index" ON "token_transfers"("to_address", "block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "token_transfers_token_address_block_timestamp_index" ON "token_transfers"("token_address", "block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "tokens_address_index" ON "tokens"("address" DESC);

-- CreateIndex
CREATE INDEX "traces_block_timestamp_index" ON "traces"("block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "traces_from_address_block_timestamp_index" ON "traces"("from_address", "block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "traces_to_address_block_timestamp_index" ON "traces"("to_address", "block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "traces_block_number_index" ON "traces"("block_number" DESC);

-- CreateIndex
CREATE INDEX "transactions_block_timestamp_index" ON "transactions"("block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "transactions_from_address_block_timestamp_index" ON "transactions"("from_address", "block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "transactions_to_address_block_timestamp_index" ON "transactions"("to_address", "block_timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "event_signatures_pk_topic_0" ON "event_signatures"("topic_0");

-- CreateIndex
CREATE INDEX "geth_traces_block_timestamp_index" ON "geth_traces"("block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "geth_traces_from_address_block_timestamp_index" ON "geth_traces"("from_address", "block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "geth_traces_to_address_block_timestamp_index" ON "geth_traces"("to_address", "block_timestamp" DESC);

-- CreateIndex
CREATE INDEX "block_date_index" ON "transaction_statistic"("block_date" DESC);

-- CreateIndex
CREATE INDEX "block_timestamp_transactions_statistic_in_one_month" ON "transactions_statistic_in_one_month"("block_timestamp" DESC);
