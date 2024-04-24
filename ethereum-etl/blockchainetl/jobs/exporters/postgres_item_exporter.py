# MIT License
#
# Copyright (c) 2020 Evgeny Medvedev, evge.medvedev@gmail.com
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

import collections

from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy_utils import database_exists, create_database
import time

from blockchainetl.jobs.exporters.converters.composite_item_converter import CompositeItemConverter
# import pymongo
# from pymongo import MongoClient

class PostgresItemExporter:

    def __init__(self, connection_url, item_type_to_insert_stmt_mapping, converters=(), print_sql=True):
        self.connection_url = connection_url
        self.item_type_to_insert_stmt_mapping = item_type_to_insert_stmt_mapping
        self.converter = CompositeItemConverter(converters)
        self.print_sql = print_sql
        self.engine = self.create_engine()
        
    def open(self):
        pass

    def export_items(self, items):
        items_grouped_by_type = group_by_item_type(items)
        time_insert = []
        for item_type, insert_stmt in self.item_type_to_insert_stmt_mapping.items():
            start_time = time.time()
            item_group = items_grouped_by_type.get(item_type)
            if item_group:
                try:
                    converted_items = list(self.convert_items(item_group))            
                    with self.engine.connect() as connection:
                        connection.execute(insert_stmt, converted_items)
                        # connection.commit()
                except NameError:
                    print("Lỗi khi thực hiện execute:", NameError)
            end_time = time.time()
            time_insert.append(end_time - start_time)
            
        print('Time to insert '+ 'block' +' to database:  %s' % time_insert[0])
        print('Time to insert '+ 'transaction' +' to database:  %s' % time_insert[1])
        print('Time to insert '+ 'token_transfer' +' to database:  %s' % time_insert[2])
        print('Time to insert '+ 'log' +' to database:  %s' % time_insert[3])
        print('Time to insert '+ 'trace' +' to database:  %s' % time_insert[4])
        print('Time to insert '+ 'token' +' to database:  %s' % time_insert[5])
        print('Time to insert '+ 'contract' +' to database:  %s' % time_insert[6])
        
    def convert_items(self, items):
        for item in items:
            yield self.converter.convert_item(item)

    def create_engine(self):
        engine = create_engine(self.connection_url, echo=self.print_sql, pool_recycle=3600)
        return engine

    def close(self):
        pass

import json
def group_by_item_type(items):
    result = collections.defaultdict(list)
    for item in items:
        result[item.get('type')].append(item)
    return result
