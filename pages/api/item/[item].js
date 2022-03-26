/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
import { MongoClient } from 'mongodb';

const DB = MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

export default async function handler(req, res) {
  const db = await DB;
  const database = db.db('mcid');
  const name = req.query.item.split('-').join(' ').toLowerCase().replace('(', '\\(')
    .replace(')', '\\)');
  const regex = new RegExp(['^', name, '$'].join(''), 'i');
  const items = await database.collection('items').find({
    name: regex,
  }).toArray();

  res.status(200).json(items[0]);
}
