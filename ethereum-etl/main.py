from flask import Flask, redirect, url_for, request
app = Flask(__name__)
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('https://agd-seed-1.vbchain.vn/'))
import subprocess
import pathlib
import os
import signal
@app.route('/extractManual/', methods = ['POST'])
def extractManual():
  if request.method == 'POST':
    reqData = request.json
    startBlockNumber = reqData['startBlockNumber']
    endBlockNumber = reqData['endBlockNumber'] if 'endBlockNumber' in reqData else w3.eth.get_block('latest')['number']
    provider = reqData['provider']
    path = pathlib.Path().resolve()
    cmd = f'python ethereumetl.py export_all -s {startBlockNumber} -e {endBlockNumber} -p {provider}'
    process = subprocess.Popen(cmd, shell=True)
    return f'Success with pid: {process.pid}'
  
@app.route('/extractAutomate/', methods = ['POST'])
def extractAutomate():
  if request.method == 'POST':
    reqData = request.json
    startBlockNumber = reqData['startBlockNumber']
    database = 'postgresql+pg8000://postgres:etl777@postgres_db:5432/etl_ethereum'
    # endBlockNumber = reqData['endBlockNumber'] if 'endBlockNumber' in reqData else w3.eth.get_block('latest')['number']
    provider = reqData['provider']
    path = pathlib.Path().resolve()
    cmd = f'python ethereumetl.py stream -s {startBlockNumber} -o {database} -p {provider}'
    process = subprocess.Popen(cmd, shell=True)
    return f'Command Executing with Process ID: {process.pid} \n \
            Must call api to stop before call automate again!' 
            
@app.route('/stopExtract/', methods = ['POST'])
def stopExtract():
  if request.method == 'POST':
      # reqData = request.json
      # pid = reqData['pid']
      # cmd = f'TASKKILL /PID {pid} /F /T'
      # os.killpg(pid, 0)
      subprocess.Popen(['pkill', '-9', 'python'])
      return f'Success' 

if __name__ == '__main__':
   app.run(host='0.0.0.0')