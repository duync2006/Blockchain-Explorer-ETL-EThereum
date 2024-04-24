import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='dissassemble_SC', durable=True)

import json

print(type(data))
channel.basic_publish(exchange='',
                      routing_key='logs_queue',
                      body=json.dumps(data))
print(" [x] Sent 'Hello World!'")


connection.close()