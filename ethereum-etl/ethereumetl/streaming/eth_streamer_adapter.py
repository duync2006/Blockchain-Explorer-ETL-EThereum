import logging
import pika 
from blockchainetl.jobs.exporters.console_item_exporter import ConsoleItemExporter
from blockchainetl.jobs.exporters.in_memory_item_exporter import InMemoryItemExporter
from ethereumetl.enumeration.entity_type import EntityType
from ethereumetl.jobs.export_blocks_job import ExportBlocksJob
from ethereumetl.jobs.export_receipts_job import ExportReceiptsJob
from ethereumetl.jobs.export_traces_job import ExportTracesJob
from ethereumetl.jobs.extract_contracts_job import ExtractContractsJob
from ethereumetl.jobs.extract_token_transfers_job import ExtractTokenTransfersJob
from ethereumetl.jobs.extract_tokens_job import ExtractTokensJob
from ethereumetl.streaming.enrich import enrich_transactions, enrich_logs, enrich_token_transfers, enrich_traces, \
    enrich_contracts, enrich_tokens, enrich_geth_traces
from ethereumetl.streaming.eth_item_id_calculator import EthItemIdCalculator
from ethereumetl.streaming.eth_item_timestamp_calculator import EthItemTimestampCalculator
from ethereumetl.thread_local_proxy import ThreadLocalProxy
from ethereumetl.web3_utils import build_web3
from ethereumetl.jobs.export_geth_traces_job import ExportGethTracesJob

from web3 import Web3
from ethereumetl.mappers.event_decoder import EventLogDecoder
from ethereumetl.mappers.function_decoder import FunctionInputDecoder
from blockchainetl.jobs.exporters.postgres_item_exporter import PostgresItemExporter
from sqlalchemy import create_engine
from sqlalchemy import text
from psycopg2.extras import Json

from hexbytes import HexBytes
from web3._utils.abi import get_abi_input_names, get_abi_input_types, map_abi_data
from eth_abi import abi
from web3._utils.normalizers import BASE_RETURN_NORMALIZERS
from typing import Any, Dict, cast, Union
# import numpy as np
# import pandas as pd
import time

# from vaex import vaex 
from ethereumetl.storageABI import eternalStorage
import json
w3 = Web3(Web3.HTTPProvider('https://agd-seed-1.vbchain.vn/'))
engine = create_engine("postgresql+pg8000://postgres:billboss123@postgres_db:5432/ETL_Ethereum")
class EthStreamerAdapter:
    def __init__(
            self,
            batch_web3_provider,
            item_exporter=ConsoleItemExporter(),
            batch_size=100,
            max_workers=5,
            entity_types=tuple(EntityType.ALL_FOR_STREAMING),
            node_type=None):
        self.batch_web3_provider = batch_web3_provider
        self.item_exporter = item_exporter
        self.batch_size = batch_size
        self.max_workers = max_workers
        self.entity_types = entity_types
        self.item_id_calculator = EthItemIdCalculator()
        self.item_timestamp_calculator = EthItemTimestampCalculator()
        self.node_type = node_type
    def open(self):
        self.item_exporter.open()

    def get_current_block_number(self):
        w3 = build_web3(self.batch_web3_provider)
        return int(w3.eth.getBlock("latest").number)

    def export_all(self, start_block, end_block):
        # starts = time.time()
        # Export blocks and transactions
        blocks, transactions = [], []
        
        if self._should_export(EntityType.BLOCK) or self._should_export(EntityType.TRANSACTION):
            blocks, transactions = self._export_blocks_and_transactions(start_block, end_block)
            # for transaction in transactions:
            #     try:
            #         contract_address = transaction['to_address']
            #         contract_address_to_checksum = w3.to_checksum_address(contract_address)
            #         selector = transaction["input"][:10]
            #         with engine.connect() as connection:
            #             query = text('SELECT abi FROM abis WHERE contract_address = :c')
            #             contract_abi = connection.execute(statement=query, parameters=dict(c = contract_address_to_checksum)).mappings().all()
            #             if contract_abi:
            #                 pass
            #             else: 
            #                 query = text('SELECT * FROM function_signature WHERE selector = :s')
            #                 function_signature = connection.execute(statement=query, parameters=dict(s = selector)).mappings().all()
            #                 if function_signature:
            #                     myContract = w3.eth.contract(address="0x0000000000000000000000000000000000000000", abi=function_signature[0]['inputs'])
            #                     functionDecoder = FunctionInputDecoder(myContract)
            #                     result = functionDecoder.decode_function_input(transaction["input"])
            #                     result["method"] = function_signature[0]["func_name"]
            #                     # print("result: ", result)
            #                     transaction["decodeInput"] = result
            #     except:
            #         pass
                    # print(error)
                
        # Export receipts and logs
        # enriched_transactions = enrich_transactions(transactions, receipts) \
        #     if EntityType.TRANSACTION in self.entity_types else []
        receipts, logs = [], []
        if self._should_export(EntityType.RECEIPT) or self._should_export(EntityType.LOG):
            receipts, logs = self._export_receipts_and_logs(transactions)
            try: 
                # Put to Queue (RABBITMQ)
                connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
                channel = connection.channel()
                channel.queue_declare(queue = "decode_log_etl", durable=True, arguments={'x-queue-mode': 'lazy'})
                
                logMessages = transformLogsToDict(logs)
                # print("logMessages: ", logMessages)
                for message in logMessages:
                    temp = {}
                    temp[message] = logMessages[message]
                    channel.basic_publish(
                        exchange='',
                        routing_key='decode_log_etl',
                        body=json.dumps(temp),
                        properties=pika.BasicProperties(delivery_mode=2) 
                    )

                connection.close()
            except: 
                pass
        # Extract token transfers
        token_transfers = []
        if self._should_export(EntityType.TOKEN_TRANSFER):
            token_transfers = self._extract_token_transfers(logs)
  
        # Export traces
        traces = []
        if self._should_export(EntityType.TRACE):
            traces = self._export_traces(start_block, end_block, transactions)
        
        if self.node_type == 'PARITY':
            # Export contracts
            contracts = []
            if self._should_export(EntityType.CONTRACT):
                contracts = self._export_contracts(traces,  self.node_type)
                print('contract: ', contracts)
            # Export tokens
            tokens = []
            if self._should_export(EntityType.TOKEN):
                tokens = self._extract_tokens(contracts)
        print("Traces length: ", len(traces))

        enriched_blocks = blocks \
            if EntityType.BLOCK in self.entity_types else []
        enriched_transactions = enrich_transactions(transactions, receipts) \
            if EntityType.TRANSACTION in self.entity_types else []
        enriched_logs = enrich_logs(blocks, logs) \
            if EntityType.LOG in self.entity_types else []
        enriched_token_transfers = enrich_token_transfers(blocks, token_transfers) \
            if EntityType.TOKEN_TRANSFER in self.entity_types else []
        if self.node_type == 'PARITY':
            enriched_traces = enrich_traces(blocks, traces) \
                if EntityType.TRACE in self.entity_types else []
        else: 
            enriched_traces = enrich_geth_traces(transactions, traces) \
                if EntityType.TRACE in self.entity_types else []
            # Export contracts
            contracts = []
            if self._should_export(EntityType.CONTRACT):
                contracts = self._export_contracts(enriched_traces, self.node_type)

            # Export tokens
            tokens = []
            if self._should_export(EntityType.TOKEN):
                tokens = self._extract_tokens(contracts)

        enriched_contracts = enrich_contracts(blocks, contracts) \
            if EntityType.CONTRACT in self.entity_types else []
        enriched_tokens = enrich_tokens(blocks, tokens) \
            if EntityType.TOKEN in self.entity_types else []
        logging.info('Exporting with ' + type(self.item_exporter).__name__)

        all_items = \
            sort_by(enriched_blocks, 'number') + \
            sort_by(enriched_transactions, ('block_number', 'transaction_index')) + \
            sort_by(enriched_logs, ('block_number', 'log_index')) + \
            sort_by(enriched_token_transfers, ('block_number', 'log_index')) + \
            sort_by(enriched_traces, ('block_number', 'trace_index')) + \
            sort_by(enriched_contracts, ('block_number',)) + \
            sort_by(enriched_tokens, ('block_number',))
    
        self.calculate_item_ids(all_items)
        self.calculate_item_timestamps(all_items)
        self.item_exporter.export_items(all_items)
        # print("Time to export 10000 blocks: ", time.time() - starts)
    def _export_blocks_and_transactions(self, start_block, end_block):
        start_time = time.time()
        blocks_and_transactions_item_exporter = InMemoryItemExporter(item_types=['block', 'transaction'])
        
        blocks_and_transactions_job = ExportBlocksJob(
            start_block=start_block,
            end_block=end_block,
            batch_size=self.batch_size,
            batch_web3_provider=self.batch_web3_provider,
            max_workers=self.max_workers,
            item_exporter=blocks_and_transactions_item_exporter,
            postgres_exporter=None,
            export_blocks=self._should_export(EntityType.BLOCK),
            export_transactions=self._should_export(EntityType.TRANSACTION)
        )
        blocks_and_transactions_job.run()
        blocks = blocks_and_transactions_item_exporter.get_items('block')
        transactions = blocks_and_transactions_item_exporter.get_items('transaction')
        del blocks_and_transactions_item_exporter.items
        print("Time to get Block and transactions-----------: %s" % (time.time() - start_time))
        return blocks, transactions

    def _export_receipts_and_logs(self, transactions):
        start_time = time.time()
        exporter = InMemoryItemExporter(item_types=['receipt', 'log'])
        job = ExportReceiptsJob(
            transaction_hashes_iterable=(transaction['hash'] for transaction in transactions),
            batch_size=self.batch_size,
            batch_web3_provider=self.batch_web3_provider,
            max_workers=self.max_workers,
            item_exporter=exporter,
            export_receipts=self._should_export(EntityType.RECEIPT),
            export_logs=self._should_export(EntityType.LOG)
        )
        job.run()
        receipts = exporter.get_items('receipt')
        logs = exporter.get_items('log')
        del exporter.items
        print("Log and Receipt --------------> %s" % (time.time() - start_time) )
        return receipts, logs

    def _extract_token_transfers(self, logs):
        start_time = time.time()
        exporter = InMemoryItemExporter(item_types=['token_transfer'])
        job = ExtractTokenTransfersJob(
            logs_iterable=logs,
            batch_size=self.batch_size,
            max_workers=self.max_workers,
            item_exporter=exporter)
        job.run()
        token_transfers = exporter.get_items('token_transfer')
        del exporter.items
        exporter.close()
        print("Traces --------------> %s" % (time.time() - start_time))
        return token_transfers

    def _export_traces(self, start_block, end_block, transactions = []):
        start_time = time.time()
        if self.node_type == 'PARITY':
            exporter = InMemoryItemExporter(item_types=['trace'])
            job = ExportTracesJob(
                start_block=start_block,
                end_block=end_block,
                batch_size=self.batch_size,
                web3=ThreadLocalProxy(lambda: build_web3(self.batch_web3_provider)),
                max_workers=self.max_workers,
                item_exporter=exporter
            )
            job.run()
            
            # Change the key-name here
            traces = exporter.get_items('trace')
            
        elif self.node_type == 'GETH': 
            exporter = InMemoryItemExporter(item_types=['geth_trace'])
            #  geth trace

            job = ExportGethTracesJob(
                start_block=start_block,
                end_block=end_block,
                batch_size=self.batch_size,
                batch_web3_provider=self.batch_web3_provider,
                max_workers=self.max_workers,
                item_exporter=exporter,
                transactions=transactions
            )
            job.run()
            # Change the key-name here
            traces = exporter.get_items('geth_trace')
        else: 
            raise Exception("Sorry, cannot identify node type is PARITY or GETH")
        del exporter.items
        print("Traces --------------> %s" % (time.time() - start_time))
        return traces

    def _export_contracts(self, traces, node_type):
        start_time = time.time()
        exporter = InMemoryItemExporter(item_types=['contract'])

        job = ExtractContractsJob(
            traces_iterable=traces,
            batch_size=self.batch_size,
            max_workers=self.max_workers,
            item_exporter=exporter,
            node_type=node_type
        )
        job.run()
        contracts = exporter.get_items('contract')
        del exporter.items
        print("Contract --------------> %s" % (time.time() - start_time))
        return contracts

    def _extract_tokens(self, contracts):
        start_time = time.time()
        exporter = InMemoryItemExporter(item_types=['token'])
        job = ExtractTokensJob(
            contracts_iterable=contracts,
            web3=ThreadLocalProxy(lambda: build_web3(self.batch_web3_provider)),
            max_workers=self.max_workers,
            item_exporter=exporter
        )
        job.run()
        tokens = exporter.get_items('token')
        del exporter.items
        print("Token --------------> %s" % (time.time() - start_time))
        return tokens

    def _should_export(self, entity_type):
        if entity_type == EntityType.BLOCK:
            return True

        if entity_type == EntityType.TRANSACTION:
            return EntityType.TRANSACTION in self.entity_types or self._should_export(EntityType.LOG)

        if entity_type == EntityType.RECEIPT:
            return EntityType.TRANSACTION in self.entity_types or self._should_export(EntityType.TOKEN_TRANSFER)

        if entity_type == EntityType.LOG:
            return EntityType.LOG in self.entity_types or self._should_export(EntityType.TOKEN_TRANSFER)

        if entity_type == EntityType.TOKEN_TRANSFER:
            return EntityType.TOKEN_TRANSFER in self.entity_types

        if entity_type == EntityType.TRACE:
            return EntityType.TRACE in self.entity_types or self._should_export(EntityType.CONTRACT)

        if entity_type == EntityType.CONTRACT:
            return EntityType.CONTRACT in self.entity_types or self._should_export(EntityType.TOKEN)

        if entity_type == EntityType.TOKEN:
            return EntityType.TOKEN in self.entity_types

        raise ValueError('Unexpected entity type ' + entity_type)

    def calculate_item_ids(self, items):
        for item in items:
            item['item_id'] = self.item_id_calculator.calculate(item)

    def calculate_item_timestamps(self, items):
        for item in items:
            item['item_timestamp'] = self.item_timestamp_calculator.calculate(item)

    def close(self):
        self.item_exporter.close()


def sort_by(arr, fields):
    if isinstance(fields, tuple):
        fields = tuple(fields)
    return sorted(arr, key=lambda item: tuple(item.get(f) for f in fields))


def decode_abi(row, ABIStorage): 
    keyEventAbi = w3.keccak(text='EventABI' + row['topics'][0])
    event_abi = ABIStorage.caller().getStringValue(keyEventAbi)
    print(event_abi)
    if event_abi:
        try: 
            data = [t[2:] for t in row['topics']]
            data += [row['data'][2:]]
            data = "0x" + "".join(data)
            # print("data: ", data)
            
            data = HexBytes(data)  # type: ignore
            selector, params = data[:32], data[32:]
            event_abi_dict = json.loads(event_abi)

            names, types = zip(*[(item['name'], item['type']) for item in event_abi_dict if 'name' in item and 'type' in item])

            decoded_abi = ABIStorage.web3.codec.decode(types, cast(HexBytes, params))
            normalized = map_abi_data(BASE_RETURN_NORMALIZERS, types, decoded_abi)
            normalized_decode = ["0x" + n.hex() if isinstance(n, bytes) else n for n in normalized]

            return dict(zip(names, normalized_decode))
        except: 
            return None
    else:
        return None

def convertToHex(normalized): 
    normalize_df = pd.DataFrame(normalized)
    normalize_df.apply(lambda row: "0x" + row.hex() if isinstance(row, bytes) else row)
    
    
def transformLogsToDict(logs): 
    logs_dict = {}
    for log in logs: 
        if log['transaction_hash'] not in logs_dict: 
            logs_dict[log['transaction_hash']] = [log]
        else: 
            logs_dict[log['transaction_hash']].append(log)
    return logs_dict