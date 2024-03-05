# MIT License
#
# Copyright (c) 2018 Evgeniy Filatov, evgeniyfilatov@gmail.com
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

import json

from ethereumetl.executors.batch_work_executor import BatchWorkExecutor
from ethereumetl.json_rpc_requests import generate_trace_block_by_number_json_rpc
from ethereumetl.json_rpc_requests import generate_geth_trace_by_transaction_hash_json_rpc
from blockchainetl.jobs.base_job import BaseJob
from ethereumetl.mappers.geth_trace_mapper import EthGethTraceMapper
from ethereumetl.utils import validate_range, rpc_response_to_result
from ethereumetl.service.trace_id_calculator import calculate_geth_trace_ids
from ethereumetl.json_rpc_requests import generate_geth_trace_by_by_number_json_rpc

# Exports geth traces
class ExportGethTracesJob(BaseJob):
    def __init__(
            self,
            start_block,
            end_block,
            batch_size,
            batch_web3_provider,
            max_workers,
            item_exporter,
            transactions):
        validate_range(start_block, end_block)
        self.start_block = start_block
        self.end_block = end_block

        self.batch_web3_provider = batch_web3_provider

        self.batch_work_executor = BatchWorkExecutor(batch_size, max_workers)
        self.item_exporter = item_exporter

        self.geth_trace_mapper = EthGethTraceMapper()
        self.transactions = transactions

    def _start(self):
        self.item_exporter.open()

    def _export(self):
        self.batch_work_executor.execute(
            range(self.start_block, self.end_block + 1),
            self._export_batch,
            total_items=self.end_block - self.start_block + 1
        )

    def _export_batch(self, block_number_batch):
        trace_block_rpc = list(generate_trace_block_by_number_json_rpc(block_number_batch))
        response = self.batch_web3_provider.make_batch_request(json.dumps(trace_block_rpc))

        # geth_trace_block_rpc = list(generate_geth_trace_by_by_number_json_rpc(block_number_batch))
        # geth_response = self.batch_web3_provider.make_batch_request(json.dumps(geth_trace_block_rpc))
        # print('RESPONSE: ', response)
        # print('GETH RESPONSE: ', geth_response)

        trace_transaction_rpc = list(generate_geth_trace_by_transaction_hash_json_rpc(self.transactions))
        response_1 = self.batch_web3_provider.make_batch_request(json.dumps(trace_transaction_rpc))
        # print('RPC: ', trace_transaction_rpc)
        print("RESPONSE 1: ", json.dumps(response_1))
        # print("RESPONSE: ", response)

        # for response_item in response:
        #     block_number = response_item.get('id')
        #     result = rpc_response_to_result(response_item)

        #     geth_traces = self.geth_trace_mapper.json_dict_to_geth_trace({
        #         'block_number': block_number,
        #         'transaction_traces': [tx_trace.get('result') for tx_trace in result]
        #     })
        # # calculate_trace_indexes(geth_traces)
        #     try:
                # calculate_geth_trace_ids(geth_traces)
        #         for trace in geth_traces:
        #             self.item_exporter.export_item(self.geth_trace_mapper.geth_trace_to_dict(trace))
        #             # print("geth_tract_to_dict: ", self.geth_trace_mapper.geth_trace_to_dict(trace))
        #     except: 
        #         pass

        for response_item in response_1:
            if type(response_item) is str:
                break 
            txHash = response_item.get('id')
            traceArray = flattenTraceCalls(response_item)
            print("TRACE ARRAY: ", traceArray)
            geth_traces = self.geth_trace_mapper.array_to_EthGethTrace(traceArray, txHash, response_item['result']['type'])
            print("geth_traces: ", geth_traces)
            calculate_trace_indexes(geth_traces)
            try: 
                calculate_geth_trace_ids(geth_traces)
                for trace in geth_traces:
                    # print("geth_tract_to_dict: ", self.geth_trace_mapper.geth_trace_to_dict(trace))
                    self.item_exporter.export_item(self.geth_trace_mapper.geth_trace_to_dict(trace))
            except Exception as error: 
                print(error)
            


    def _end(self):
        self.batch_work_executor.shutdown()
        self.item_exporter.close()

def calculate_trace_indexes(traces):
    # Only works if traces were originally ordered correctly which is the case for Parity traces
    for ind, trace in enumerate(traces):
        trace.trace_index = ind

def getTraceIndex(index): 
    address = []
    if index > 1000:
        address.extend(getTraceIndex(int(index/1000)))
    address.append(index % 1000)
    return (address)
    
       
def getTraceAddress(traceResult, index = 1, isChild = False):
    internalTnxs = []
    if 'calls' in traceResult:
        # print(len(traceResult['calls']))
        if len(traceResult['calls']) >= 1 and isChild == True: 
            index = index*1000
        for trace_call in range (len(traceResult['calls'])):
            traceAddress = getTraceIndex(index)
            traceResult['calls'][trace_call]['traceAddress'] = traceAddress
            internalTnxs.extend(getTraceAddress(traceResult['calls'][trace_call], index, True))
            if 'calls' in traceResult['calls'][trace_call]:
                tmp = traceResult['calls'][trace_call].copy()
                tmp.pop('calls', None)
                internalTnxs.extend([tmp])
            else:
                internalTnxs.extend([traceResult['calls'][trace_call]])
            index = index + 1;
    return internalTnxs
        

def flattenTraceCalls(traceDict):
    traceArray = []
    traceArray.extend(getTraceAddress(traceDict['result']))
    firstTrace = traceDict.copy()
    if 'calls' in traceDict['result']:
        firstTrace['result'].pop('calls', None)
    firstTrace['result']['traceAddress'] = []
    # print("firstTrace: ", firstTrace)
    traceArray.extend([firstTrace['result']])
    # print("flatten TRACE: ", traceArray )
    return traceArray