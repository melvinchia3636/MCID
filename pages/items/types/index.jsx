/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MongoClient } from 'mongodb';

export async function getStaticProps() {
  const db = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  const database = db.db('mcid');
  const items = await database.collection('types').find({}).toArray();
  db.close();
  return {
    props: {
      data: items.map((e) => ({
        ...e,
        _id: null,
        items: null,
      })),
    },
  };
}

export default function Types({ data }) {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex items-center overflow-y-auto bg-neutral-100 text-neutral-600 flex-col py-16 md:py-56">
      <Head>
        <title>Minecraft Item ID List - Type Index</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="px-8 md:px-44 w-full">
        <button type="button" onClick={() => router.back()} className="text-sm cursor-pointer font-semibold mb-7 tracking-[0.2em] uppercase flex items-center gap-1">
          <Icon icon="uil:arrow-left" className="w-5 h-5 -mt-0.5" />
          Go Back
        </button>
        <h1 className="text-4xl uppercase tracking-[0.325em]">Sort Item IDs By Type</h1>
        <p className="mt-6">
          Find below links to lists of Minecraft items sorted by their type.
        </p>
      </div>
      <div className="mt-16 grid lg:grid-cols-2 w-full px-8 md:px-44 gap-2">
        {data?.map((e) => (
          <div className="border-2 border-neutral-600 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-medium">{e.name}</h2>
              <p className="mt-2">{e.description}</p>
            </div>
            <Link href={`/items/types/${e.name.toLowerCase().replace(/\s/, '-')}`}>
              <div className="w-full uppercase font-medium tracking-[0.325em] border-2 border-neutral-600 hover:bg-neutral-600 hover:text-white transition-colors duration-300 cursor-pointer flex items-center justify-center py-4 mt-8">Browse items</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
