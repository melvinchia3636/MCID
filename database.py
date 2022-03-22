import pymongo
import json

mongo = pymongo.MongoClient('mongodb+srv://redaxe3636:t9y9kz6EajfViZA@mcid.22hyl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

db = mongo['mcid']
col = db['items']

data = json.load(open('results.json'))

for k, v in data.items():
  print(db['types'].insert_one({
    'name': k,
    'description': v['description'],
    'items': [i['_id'] for i in col.find({"name": {
      "$in": [i['name'] for i in v['items']]
    }})]
  }))