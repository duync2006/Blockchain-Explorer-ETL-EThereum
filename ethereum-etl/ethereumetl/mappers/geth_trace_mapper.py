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


from ethereumetl.domain.geth_trace import EthGethTrace


class EthGethTraceMapper(object):
    def json_dict_to_geth_trace(self, json_dict):
        # geth_trace = EthGethTrace()

        # geth_trace.block_number = json_dict.get('block_number')
        
        blockNumber = json_dict.get('block_number')
        transaction_traces = json_dict.get('transaction_traces')
        # print("transaction_traces: ", transaction_traces)
        if transaction_traces != []:
            result = self.extract_transaction_traces(transaction_traces[0], blockNumber)
        else:
            result = EthGethTrace()
        return result
    
    def geth_trace_to_dict(self, geth_trace):
        return {
            'type': 'geth_trace',
            # 'block_number': geth_trace.block_number,
            'transaction_traces': geth_trace.transaction_traces,
            'from_address': geth_trace.from_address,
            'to_address': geth_trace.to_address,
            'gas': geth_trace.gas,
            'gas_used': geth_trace.gasUsed,
            'input': geth_trace.input,
            'output': geth_trace.output,
            'call_type': geth_trace.call_type,
            'trace_type':geth_trace.trace_type,
            'trace_id': geth_trace.trace_id,
            'trace_address': geth_trace.trace_address,
            'transaction_hash': geth_trace.transaction_hash,
        }

    def extract_transaction_traces(self, obj, block_number): 
        result = []
        # print("obj: ", obj['to'])
        if 'calls' in obj: 
            for call in obj['calls']:
                result.extend(self.extract_transaction_traces(call, block_number))
        if 'output' not in obj: 
            obj['output'] = '0x0'
        try:
            geth_trace = EthGethTrace()
            geth_trace.block_number = block_number
            geth_trace.from_address = obj['from']
            geth_trace.to_address = obj['to']
            geth_trace.gas = obj['gas']
            geth_trace.gasUsed = obj['gasUsed']
            geth_trace.input = obj['input']
            geth_trace.output = obj['output']
            geth_trace.call_type = obj['type']
            geth_trace.trace_type = obj['type']

            result.append(geth_trace)
        except: 
            pass
        return result
    

    def array_to_EthGethTrace(self, traceArray, txHash, trace_type):
        result = []
        try:
            for trace in traceArray: 
                # print('trace in trace Array: ', trace)
                geth_trace = EthGethTrace()
                # geth_trace.block_number = None
                geth_trace.from_address = trace['from']
                geth_trace.to_address = trace['to']
                geth_trace.gas = trace['gas']
                geth_trace.gasUsed = trace['gasUsed']
                geth_trace.input = trace['input']
                if 'output' in trace:
                    geth_trace.output = trace['output']
                geth_trace.call_type = trace['type']
                geth_trace.trace_type = trace_type
                geth_trace.trace_address = trace['traceAddress']
                geth_trace.transaction_hash = txHash
                
                result.append(geth_trace)
        except Exception as error: 
            print("error: ", error)    
        return result