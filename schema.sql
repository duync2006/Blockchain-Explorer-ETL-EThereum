--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.1

-- Started on 2024-05-02 16:51:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16404)
-- Name: blocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocks (
    "timestamp" timestamp(6) without time zone,
    number bigint,
    hash character varying(66) NOT NULL,
    parent_hash character varying(66),
    nonce character varying(42),
    sha3_uncles character varying(66),
    logs_bloom text,
    transactions_root character varying(66),
    state_root character varying(66),
    receipts_root character varying(66),
    miner character varying(42),
    difficulty numeric,
    total_difficulty numeric,
    size bigint,
    extra_data text,
    gas_limit bigint,
    gas_used bigint,
    transaction_count bigint,
    base_fee_per_gas bigint
);


ALTER TABLE public.blocks OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16409)
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    address character varying(42) NOT NULL,
    bytecode text,
    function_sighashes text[],
    is_erc20 boolean,
    is_erc721 boolean,
    block_number bigint,
    block_hash character varying(66),
    block_timestamp timestamp(6) without time zone,
    creator character varying(42)
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16424)
-- Name: geth_traces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geth_traces (
    from_address character varying(42),
    to_address character varying(42),
    value numeric(38,0),
    input text,
    output text,
    trace_type character varying(16),
    call_type character varying(16),
    gas bigint,
    gas_used bigint,
    block_timestamp timestamp(6) without time zone,
    block_number bigint,
    trace_id text NOT NULL,
    transaction_hash text,
    trace_address text
);


ALTER TABLE public.geth_traces OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16429)
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    log_index bigint NOT NULL,
    transaction_hash character varying(66) NOT NULL,
    transaction_index bigint,
    address character varying(42),
    data text,
    topic0 character varying(66),
    topic1 character varying(66),
    topic2 character varying(66),
    topic3 character varying(66),
    block_timestamp timestamp(6) without time zone,
    block_number bigint,
    block_hash character varying(66),
    decode jsonb,
    is_decoded boolean DEFAULT false NOT NULL,
    decode_failed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16437)
-- Name: token_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token_transfers (
    token_address character varying(42),
    from_address character varying(42),
    to_address character varying(42),
    value numeric(78,0),
    transaction_hash character varying(66) NOT NULL,
    log_index bigint NOT NULL,
    block_timestamp timestamp(6) without time zone,
    block_number bigint,
    block_hash character varying(66)
);


ALTER TABLE public.token_transfers OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16440)
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
    address character varying(42) NOT NULL,
    name text,
    symbol text,
    decimals integer,
    total_supply numeric(78,0),
    block_number bigint,
    block_hash character varying(66),
    block_timestamp timestamp(6) without time zone
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16445)
-- Name: traces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.traces (
    transaction_hash character varying(66),
    transaction_index bigint,
    from_address character varying(42),
    to_address character varying(42),
    value numeric(38,0),
    input text,
    output text,
    trace_type character varying(16),
    call_type character varying(16),
    reward_type character varying(16),
    gas bigint,
    gas_used bigint,
    subtraces bigint,
    trace_address character varying(8192),
    error text,
    status integer,
    block_timestamp timestamp(6) without time zone,
    block_number bigint,
    block_hash character varying(66),
    trace_id text NOT NULL
);


ALTER TABLE public.traces OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16450)
-- Name: transaction_statistic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_statistic (
    block_date date NOT NULL,
    total_transaction integer
);


ALTER TABLE public.transaction_statistic OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16453)
-- Name: transaction_statistic_in_one_year; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_statistic_in_one_year (
    year integer NOT NULL,
    quarter integer,
    total_transactions integer
)
PARTITION BY RANGE (year);


ALTER TABLE public.transaction_statistic_in_one_year OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16456)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    hash character varying(66) NOT NULL,
    nonce bigint,
    transaction_index bigint,
    from_address character varying(42),
    to_address character varying(42),
    value numeric(38,0),
    gas bigint,
    gas_price bigint,
    input text,
    receipt_cumulative_gas_used bigint,
    receipt_gas_used bigint,
    receipt_contract_address character varying(42),
    receipt_root character varying(66),
    receipt_status bigint,
    block_timestamp timestamp(6) without time zone,
    block_number bigint,
    block_hash character varying(66),
    max_fee_per_gas bigint,
    max_priority_fee_per_gas bigint,
    transaction_type bigint,
    receipt_effective_gas_price bigint,
    receipt_l1_fee bigint,
    receipt_l1_gas_used bigint,
    receipt_l1_gas_price bigint,
    receipt_l1_fee_scalar numeric,
    "decodeInput" json
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16461)
-- Name: transactions_statistic_in_one_month; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions_statistic_in_one_month (
    block_timestamp timestamp(6) without time zone NOT NULL,
    total_transaction integer
);


ALTER TABLE public.transactions_statistic_in_one_month OWNER TO postgres;

--
-- TOC entry 3458 (class 2606 OID 16948)
-- Name: blocks blocks_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pk PRIMARY KEY (hash);


--
-- TOC entry 3462 (class 2606 OID 16952)
-- Name: contracts contracts_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pk PRIMARY KEY (address);


--
-- TOC entry 3466 (class 2606 OID 16958)
-- Name: geth_traces geth_traces_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geth_traces
    ADD CONSTRAINT geth_traces_pk PRIMARY KEY (trace_id);


--
-- TOC entry 3471 (class 2606 OID 16960)
-- Name: logs logs_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pk PRIMARY KEY (transaction_hash, log_index);


--
-- TOC entry 3475 (class 2606 OID 16962)
-- Name: token_transfers token_transfers_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_transfers
    ADD CONSTRAINT token_transfers_pk PRIMARY KEY (transaction_hash, log_index);


--
-- TOC entry 3480 (class 2606 OID 16964)
-- Name: tokens tokens_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pk PRIMARY KEY (address);


--
-- TOC entry 3485 (class 2606 OID 168929)
-- Name: traces traces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traces
    ADD CONSTRAINT traces_pkey PRIMARY KEY (trace_id);


--
-- TOC entry 3491 (class 2606 OID 16968)
-- Name: transaction_statistic_in_one_year transaction_statistic_in_one_year_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_statistic_in_one_year
    ADD CONSTRAINT transaction_statistic_in_one_year_pkey PRIMARY KEY (year);


--
-- TOC entry 3489 (class 2606 OID 16970)
-- Name: transaction_statistic transaction_statistic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_statistic
    ADD CONSTRAINT transaction_statistic_pkey PRIMARY KEY (block_date);


--
-- TOC entry 3494 (class 2606 OID 16972)
-- Name: transactions transactions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pk PRIMARY KEY (hash);


--
-- TOC entry 3500 (class 2606 OID 16974)
-- Name: transactions_statistic_in_one_month transactions_statistic_in_one_month_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions_statistic_in_one_month
    ADD CONSTRAINT transactions_statistic_in_one_month_pkey PRIMARY KEY (block_timestamp);


--
-- TOC entry 3487 (class 1259 OID 16975)
-- Name: block_date_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX block_date_index ON public.transaction_statistic USING btree (block_date DESC);


--
-- TOC entry 3498 (class 1259 OID 16976)
-- Name: block_timestamp_transactions_statistic_in_one_month; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX block_timestamp_transactions_statistic_in_one_month ON public.transactions_statistic_in_one_month USING btree (block_timestamp DESC);


--
-- TOC entry 3455 (class 1259 OID 17062)
-- Name: blocks_number_timestamp_txn_miner_gasused_basefee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blocks_number_timestamp_txn_miner_gasused_basefee ON public.blocks USING btree (number DESC, "timestamp", transaction_count, miner, gas_used, base_fee_per_gas);


--
-- TOC entry 3456 (class 1259 OID 17056)
-- Name: blocks_number_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX blocks_number_uindex ON public.blocks USING btree (number DESC);


--
-- TOC entry 3459 (class 1259 OID 16978)
-- Name: blocks_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blocks_timestamp_index ON public.blocks USING btree ("timestamp" DESC);


--
-- TOC entry 3460 (class 1259 OID 16979)
-- Name: contracts_address_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contracts_address_index ON public.contracts USING btree (address DESC);


--
-- TOC entry 3463 (class 1259 OID 16981)
-- Name: geth_traces_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX geth_traces_block_timestamp_index ON public.geth_traces USING btree (block_timestamp DESC);


--
-- TOC entry 3464 (class 1259 OID 16982)
-- Name: geth_traces_from_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX geth_traces_from_address_block_timestamp_index ON public.geth_traces USING btree (from_address, block_timestamp DESC);


--
-- TOC entry 3467 (class 1259 OID 16983)
-- Name: geth_traces_to_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX geth_traces_to_address_block_timestamp_index ON public.geth_traces USING btree (to_address, block_timestamp DESC);


--
-- TOC entry 3468 (class 1259 OID 16984)
-- Name: logs_address_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX logs_address_index ON public.logs USING btree (address DESC);


--
-- TOC entry 3469 (class 1259 OID 17587)
-- Name: logs_blocknumber; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX logs_blocknumber ON public.logs USING btree (block_number);


--
-- TOC entry 3472 (class 1259 OID 16985)
-- Name: token_transfers_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX token_transfers_block_timestamp_index ON public.token_transfers USING btree (block_timestamp DESC);


--
-- TOC entry 3473 (class 1259 OID 16986)
-- Name: token_transfers_from_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX token_transfers_from_address_block_timestamp_index ON public.token_transfers USING btree (from_address, block_timestamp DESC);


--
-- TOC entry 3476 (class 1259 OID 16987)
-- Name: token_transfers_to_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX token_transfers_to_address_block_timestamp_index ON public.token_transfers USING btree (to_address, block_timestamp DESC);


--
-- TOC entry 3477 (class 1259 OID 16988)
-- Name: token_transfers_token_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX token_transfers_token_address_block_timestamp_index ON public.token_transfers USING btree (token_address, block_timestamp DESC);


--
-- TOC entry 3478 (class 1259 OID 16989)
-- Name: tokens_address_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tokens_address_index ON public.tokens USING btree (address DESC);


--
-- TOC entry 3481 (class 1259 OID 16990)
-- Name: traces_block_number_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX traces_block_number_index ON public.traces USING btree (block_number DESC);


--
-- TOC entry 3482 (class 1259 OID 16991)
-- Name: traces_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX traces_block_timestamp_index ON public.traces USING btree (block_timestamp DESC);


--
-- TOC entry 3483 (class 1259 OID 16992)
-- Name: traces_from_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX traces_from_address_block_timestamp_index ON public.traces USING btree (from_address, block_timestamp DESC);


--
-- TOC entry 3486 (class 1259 OID 16993)
-- Name: traces_to_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX traces_to_address_block_timestamp_index ON public.traces USING btree (to_address, block_timestamp DESC);


--
-- TOC entry 3492 (class 1259 OID 17060)
-- Name: transactions_from_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_from_address_block_timestamp_index ON public.transactions USING btree (block_timestamp DESC, from_address);


--
-- TOC entry 3495 (class 1259 OID 17063)
-- Name: transactions_receipt_contract_address_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_receipt_contract_address_idx ON public.transactions USING btree (receipt_contract_address) WHERE (receipt_contract_address IS NOT NULL);


--
-- TOC entry 3496 (class 1259 OID 16996)
-- Name: transactions_to_address_block_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_to_address_block_timestamp_index ON public.transactions USING btree (to_address, block_timestamp DESC);


--
-- TOC entry 3497 (class 1259 OID 51425)
-- Name: transactions_to_block_number_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_to_block_number_index ON public.transactions USING btree (block_number DESC);


--
-- TOC entry 3501 (class 2620 OID 16997)
-- Name: transactions delete_transactions_statistic_one_month; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_transactions_statistic_one_month AFTER INSERT ON public.transactions FOR EACH STATEMENT EXECUTE FUNCTION public.delete_transactions_statistic_one_month();


--
-- TOC entry 3502 (class 2620 OID 16998)
-- Name: transactions update_transactions_statistic; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_transactions_statistic AFTER INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_transaction_statistic();


--
-- TOC entry 3503 (class 2620 OID 16999)
-- Name: transactions update_transactions_statistic_one_month; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_transactions_statistic_one_month AFTER INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_transactions_statistic_one_month();


-- Completed on 2024-05-02 16:51:43

--
-- PostgreSQL database dump complete
--

