from flask import Flask, redirect, url_for, request
from decompileWorker import consume
import subprocess

app = Flask(__name__)

@app.route('/createWorker')
def consume_api():
  consume()

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=3006)
  consume()
   