# MIT License
#
# Copyright (c) 2018 Evgeny Medvedev, evge.medvedev@gmail.com
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


import csv
import logging
import os
import shutil
from time import time

from ethereumetl.csv_utils import set_max_field_size_limit
from blockchainetl.file_utils import smart_open
from ethereumetl.jobs.export_blocks_job import ExportBlocksJob
from ethereumetl.jobs.export_contracts_job import ExportContractsJob
from ethereumetl.jobs.export_receipts_job import ExportReceiptsJob
from ethereumetl.jobs.export_token_transfers_job import ExportTokenTransfersJob
from ethereumetl.jobs.export_tokens_job import ExportTokensJob
from ethereumetl.jobs.exporters.blocks_and_transactions_item_exporter import blocks_and_transactions_item_exporter
from ethereumetl.jobs.exporters.contracts_item_exporter import contracts_item_exporter
from ethereumetl.jobs.exporters.receipts_and_logs_item_exporter import receipts_and_logs_item_exporter
from ethereumetl.jobs.exporters.token_transfers_item_exporter import token_transfers_item_exporter
from ethereumetl.jobs.exporters.tokens_item_exporter import tokens_item_exporter
from ethereumetl.providers.auto import get_provider_from_uri
from ethereumetl.thread_local_proxy import ThreadLocalProxy
from ethereumetl.web3_utils import build_web3
from urllib.parse import urlparse

logger = logging.getLogger('export_all')
# import time

def is_log_filter_supported(provider_uri):
    pass


def extract_csv_column_unique(input, output, column):
    set_max_field_size_limit()

    with smart_open(input, 'r') as input_file, smart_open(output, 'w') as output_file:
        reader = csv.DictReader(input_file)
        seen = set()  # set for fast O(1) amortized lookup
        for row in reader:
            if row[column] in seen:
                continue
            seen.add(row[column])
            output_file.write(row[column] + '\n')


def export_all_common(partitions, output_dir, provider_uri, max_workers, batch_size):
    # starts = time()
    for batch_start_block, batch_end_block, partition_dir in partitions:

        from blockchainetl.jobs.exporters.postgres_item_exporter import PostgresItemExporter
        from blockchainetl.streaming.postgres_utils import create_insert_statement_for_table
        from blockchainetl.jobs.exporters.converters.unix_timestamp_item_converter import UnixTimestampItemConverter
        from blockchainetl.jobs.exporters.converters.int_to_decimal_item_converter import IntToDecimalItemConverter
        from blockchainetl.jobs.exporters.converters.list_field_item_converter import ListFieldItemConverter
        from ethereumetl.streaming.postgres_tables import GETH_TRACES, BLOCKS, TRANSACTIONS, LOGS, TOKEN_TRANSFERS, TRACES, TOKENS, CONTRACTS
        item_exporter_to_Postgres = PostgresItemExporter(
            'postgresql+pg8000://postgres:etl777@localhost:5432/etl_ethereum', item_type_to_insert_stmt_mapping={
                'block': create_insert_statement_for_table(BLOCKS),
                'transaction': create_insert_statement_for_table(TRANSACTIONS),
                'log': create_insert_statement_for_table(LOGS),
                'token_transfer': create_insert_statement_for_table(TOKEN_TRANSFERS),
                'trace': create_insert_statement_for_table(TRACES),
                'geth_trace': create_insert_statement_for_table(GETH_TRACES),
                'token': create_insert_statement_for_table(TOKENS),
                'contract': create_insert_statement_for_table(CONTRACTS),
            },
        converters=[UnixTimestampItemConverter(), IntToDecimalItemConverter(),
                        ListFieldItemConverter('topics', 'topic', fill=4)])
        
        from ethereumetl.streaming.eth_streamer_adapter import EthStreamerAdapter
        
        node_type = get_type_provider_uri(provider_uri)
        
        Exporter = EthStreamerAdapter(
            batch_web3_provider=ThreadLocalProxy(lambda: get_provider_from_uri(provider_uri, batch=True)),
            item_exporter=item_exporter_to_Postgres,
            batch_size=batch_size,
            max_workers=max_workers,
            node_type=node_type
        )

        Exporter.export_all(batch_start_block, batch_end_block)

def get_type_provider_uri(uri_string):
    uri = urlparse(uri_string)
    infura = 'infura'
    agd = 'agd'
    isInfura = infura in uri.netloc
    isAGD = agd in uri.netloc
    if isInfura or isAGD: 
        return 'PARITY'
    else: 
        return 'GETH'
