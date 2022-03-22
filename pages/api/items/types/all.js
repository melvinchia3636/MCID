/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
import { MongoClient } from 'mongodb';

const DB = MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

export default async function handler(req, res) {
  const db = await DB;
  const database = db.db('mcid');
  const items = await database.collection('types').find({}).toArray();
  res.status(200).json(items.map((e) => ({
    ...e,
    items: null,
  })));
}
