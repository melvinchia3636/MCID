import pymongo
import json
import os

MONGODB_URI = os.environ.get('MONGODB_URI')

db = pymongo.MongoClient(MONGODB_URI).get_database('mcid')
collection = db.get_collection('items')

data = json.load(open('minecraft-items-details.json'))
name_list = [i['name'] for i in json.load(open('minecraft-items.json'))]
for k, v in data.items():
  name = ' '.join(k.split('-')).lower()
  name = [i for i in name_list if i.lower() == name][0]
  print(collection.update_one({
    'name': name
  }, {
    '$set': v
  }))
  