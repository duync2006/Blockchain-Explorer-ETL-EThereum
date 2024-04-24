import pika
import json
import sys
from eth_utils import function_signature_to_4byte_selector
from ethereum_dasm.evmdasm import EvmCode, Contract



class ContractWrapper:
    def __init__(self, sighashes):
        self.sighashes = sighashes

    def implements(self, function_signature):
        sighash = get_function_sighash(function_signature)
        return sighash in self.sighashes

    def implements_any_of(self, *function_signatures):
        return any(self.implements(function_signature) for function_signature in function_signatures)



def get_function_sighash(signature):
    return '0x' + function_signature_to_4byte_selector(signature).hex()

def is_erc20_contract(function_sighashes):
  c = ContractWrapper(function_sighashes)
  return c.implements('totalSupply()') and \
          c.implements('balanceOf(address)') and \
          c.implements('transfer(address,uint256)') and \
          c.implements('transferFrom(address,address,uint256)') and \
          c.implements('approve(address,uint256)') and \
          c.implements('allowance(address,address)')

def is_erc721_contract(function_sighashes):
        c = ContractWrapper(function_sighashes)
        return c.implements('balanceOf(address)') and \
               c.implements('ownerOf(uint256)') and \
               c.implements_any_of('transfer(address,uint256)', 'transferFrom(address,address,uint256)') and \
               c.implements('approve(address,uint256)')

def clean_bytecode(bytecode):
  if bytecode is None or bytecode == '0x':
      return None
  elif bytecode.startswith('0x'):
      return bytecode[2:]
  else:
      return bytecode


def get_function_sighashes(bytecode):
  bytecode = clean_bytecode(bytecode)
  if bytecode is not None:
      evm_code = EvmCode(contract=Contract(bytecode=bytecode), static_analysis=False, dynamic_analysis=False)
      evm_code.disassemble(bytecode)
      basic_blocks = evm_code.basicblocks
      
      if basic_blocks and len(basic_blocks) > 0:
          init_block = basic_blocks[0]
          # Solve Bug Here
          # https://github.com/blockchain-etl/ethereum-etl/issues/349
          instructions = [inst for block in basic_blocks for inst in block.instructions]
          push4_instructions = [inst for inst in instructions if inst.name == 'PUSH4']
          return sorted(list(set('0x' + inst.operand for inst in push4_instructions)))
      else:
          return []
  else:
      return []

def decompile(ch, method, properties, body):
    # print(f" [x] Received {body.decode()}")
    try:
      contract = json.loads(body.decode())
      bytecode = contract['bytecode']
      function_sighashes = get_function_sighashes(bytecode)
      contract['function_sighashes'] = function_sighashes
      contract['is_erc20'] = is_erc20_contract(function_sighashes)
      contract['is_erc721'] = is_erc721_contract(function_sighashes)
      print("contract: ", contract)

    except:
      pass
    
    ch.basic_ack(delivery_tag=method.delivery_tag)

def consume():
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    # channel.basic_qos(prefetch_count=50)
    channel.queue_declare(queue = "dissassemble_SC", durable=True, arguments={'x-queue-mode': 'lazy'})

    # channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='dissassemble_SC', on_message_callback=decompile)

    channel.start_consuming()
