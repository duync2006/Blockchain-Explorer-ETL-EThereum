import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='logs_queue', durable=True)

import json

data = {'0x20bb043a5ec9e1cfb977a3ace8c5df8c828308694acaef82f5452b576575a322':
[{'type': 'log', 'log_index': 5, 'transaction_hash': '0x20bb043a5ec9e1cfb977a3ace8c5df8c828308694acaef82f5452b576575a322', 'transaction_index': 2, 'block_hash': '0x8cb5f7c3500b63c324c0255eefb8e3a7bc09ed87835737060e8c665d77b7479a', 'block_number': 8019670, 'address': '0x526d7d217a7996932ae54860c7a9ca79547817c0', 'data': '0xec471d8c985c17e9da641543717ee678d0dd93bed73deb6330424541d410ebef0000000000000000000000001fae0b37ff268e6a80ef8ad1a928fe2d4468efc800000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000b4769c3b22053e1bb916e67000000000000000000000000000000000000000000', 'topics': ['0xedccefa262e9e9aa013e50d7172f89c38ca112ac3f1b34f42f4b07e74f680fe5'], 'decode': 'None'}]}

print(type(data))
channel.basic_publish(exchange='',
                      routing_key='logs_queue',
                      body=json.dumps(data))
print(" [x] Sent 'Hello World!'")


connection.close()