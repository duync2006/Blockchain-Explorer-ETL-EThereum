import pika
import json
from eth_utils import function_signature_to_4byte_selector
from ethereum_dasm.evmdasm import EvmCode, Contract
import multiprocessing as mp
import sqlalchemy
from sqlalchemy import text
# db = sqlalchemy.create_engine('postgresql+pg8000://postgres:etl777@postgres_db:5432/etl_ethereum')
from dotenv import load_dotenv
import os

load_dotenv()
database_url = os.getenv("DATABASE_URL_FOR_EXTRACT")
rabbitmq = os.getenv("RABBITMQ")
engine = sqlalchemy.create_engine(database_url,  echo = True, pool_recycle=3600)

# query = 'SELECT * FROM contracts LIMIT 1;'  
query = 'INSERT INTO contracts \
        (address, bytecode, function_sighashes, is_erc20, is_erc721)\
        VALUES (:address, :bytecode, :function_sighashes, :is_erc20, :is_erc721)\
        ON CONFLICT (address)\
        DO UPDATE SET function_sighashes = excluded.function_sighashes, is_erc20 = excluded.is_erc20, is_erc721 = excluded.is_erc721;'
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
    # print("Body: ", body)
    # print(f" [x] Received {body.decode()}")
    try:
      contract = json.loads(body.decode())
      bytecode = contract['bytecode']
      function_sighashes = get_function_sighashes(bytecode)
      contract['function_sighashes'] = function_sighashes
      contract['is_erc20'] = is_erc20_contract(function_sighashes)
      contract['is_erc721'] = is_erc721_contract(function_sighashes)
      with engine.connect() as connection:
        connection.execute(text(query), contract)
        connection.commit()
      print(f"Update Contract to DB Success:  {contract['address']}")
    except Exception as e:
      print("The error is: ",e)
    
    ch.basic_ack(delivery_tag=method.delivery_tag)

def consume():
    connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq))
    channel = connection.channel()

    channel.queue_declare(queue = "dissassemble_SC", durable=True, arguments={'x-queue-mode': 'lazy'})

    channel.basic_consume(queue='dissassemble_SC', on_message_callback=decompile)

    channel.start_consuming()

def main():
    process1 = mp.Process(name="Process-1", target=consume, args=())
    process2 = mp.Process(name="Process-2", target=consume, args=())
    process3 = mp.Process(name="Process-3", target=consume, args=())

    process1.start()
    process2.start()
    process3.start()

    process1.join()
    process2.join()
    process3.join()
    
if(__name__) == '__main__':
    main()
    
    
