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


from ethereumetl.domain.contract import EthContract
from ethereumetl.executors.batch_work_executor import BatchWorkExecutor
from blockchainetl.jobs.base_job import BaseJob
from ethereumetl.mappers.contract_mapper import EthContractMapper

from ethereumetl.service.eth_contract_service import EthContractService
from ethereumetl.utils import to_int_or_none
import pika
import json
# Extract contracts
class ExtractContractsJob(BaseJob):
    def __init__(
            self,
            traces_iterable,
            batch_size,
            max_workers,
            item_exporter,
            node_type):
        self.traces_iterable = traces_iterable
        self.batch_size = batch_size
        self.batch_work_executor = BatchWorkExecutor(batch_size, max_workers)
        self.item_exporter = item_exporter

        self.contract_service = EthContractService()
        self.contract_mapper = EthContractMapper()
        self.node_type = node_type

    def _start(self):
        self.item_exporter.open()

    def _export(self):
        self.batch_work_executor.execute(self.traces_iterable, self._extract_contracts)

    def _extract_contracts(self, traces):
        print('traces length:', len(traces))
        for trace in traces:
            trace['status'] = to_int_or_none(trace.get('status'))
            trace['block_number'] = to_int_or_none(trace.get('block_number'))
        
        # GETH_TRACE
        if(self.node_type == 'GETH'):
            contract_creation_traces = [trace for trace in traces
                                    if ( trace.get('trace_type') == 'CREATE' and trace.get('to_address') is not None
                                    and len(trace.get('to_address')) > 0)]
        
        # PARITY_TRACE
        elif(self.node_type == 'PARITY'):
            contract_creation_traces = [trace for trace in traces
                                    if trace.get('trace_type') == 'create' and trace.get('to_address') is not None
                                    and len(trace.get('to_address')) > 0 and trace.get('status') == 1]
        print('contract_creation_traces length ----------> ', len(contract_creation_traces))
        contracts = []
       
        try: 
            # Put to Queue (RABBITMQ)
            connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
            channel = connection.channel()
            channel.queue_declare(queue = "dissassemble_SC", durable=True, arguments={'x-queue-mode': 'lazy'})
            
            # print("logMessages: ", logMessages)
            for trace in contract_creation_traces:
                contract = EthContract()
                contract.address = trace.get('to_address')
                contract.creator = trace.get('from_address')
                bytecode = trace.get('output')
                contract.bytecode = bytecode
                contract.block_number = trace.get('block_number')
                contracts.append(contract)
                temp = {}
                temp['address'] = contract.address;
                temp['bytecode'] = bytecode
                channel.basic_publish(
                    exchange='',
                    routing_key='dissassemble_SC',
                    body=json.dumps(temp),
                    properties=pika.BasicProperties(delivery_mode=2) 
                )
                
            connection.close()
        except: 
            pass
        
            # function_sighashes = self.contract_service.get_function_sighashes(bytecode)
            # contract.function_sighashes = function_sighashes
            # contract.is_erc20 = self.contract_service.is_erc20_contract(function_sighashes)
            # contract.is_erc721 = self.contract_service.is_erc721_contract(function_sighashes)

        for contract in contracts:
            self.item_exporter.export_item(self.contract_mapper.contract_to_dict(contract))

    def _end(self):
        self.batch_work_executor.shutdown()
        self.item_exporter.close()
