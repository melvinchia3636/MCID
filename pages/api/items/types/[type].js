/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
import { MongoClient } from 'mongodb';

const DB = MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

export default async function handler(req, res) {
  const db = await DB;
  const database = db.db('mcid');
  const items = await database.collection('types').find({
    name: req.query.type.split('-').map((e) => e[0].toUpperCase() + e.slice(1)).join(' '),
  }).toArray();
  items[0].items = await database.collection('items').find({
    _id: {
      $in: items[0].items,
    },
  }).toArray();
  res.status(200).json(items[0]);
}
