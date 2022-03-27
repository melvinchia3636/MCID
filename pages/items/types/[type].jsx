/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

export const getStaticPaths = async () => ({
  paths: [], // indicates that no page needs be created at build time
  fallback: 'blocking', // indicates the type of fallback
});

export async function getStaticProps(context) {
  const db = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  const database = db.db('mcid');
  const items = await database.collection('types').find({
    name: context.params.type.split('-').map((e) => e[0].toUpperCase() + e.slice(1)).join(' '),
  }).toArray();
  items[0].items = await database.collection('items').find({
    _id: {
      $in: items[0].items,
    },
  }).toArray();
  items[0]._id = null;
  items[0].items = items[0].items.map((e) => ({
    ...e,
    _id: null,
  }));
  db.close();

  return {
    props: {
      data: items[0],
    },
  };
}

function Types({ data }) {
  const [query, setQuery] = useState('');
  const [displayType, setDisplayType] = useState(0);
  const router = useRouter();
  const { type } = router.query;

  return (
    <div className="w-full h-screen flex items-center overflow-y-auto bg-neutral-100 text-neutral-600 flex-col py-16 md:py-56">
      <Head>
        <title>
          Minecraft Item ID List -
          {' '}
          {type}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="px-8 md:px-44 w-full">
        <button type="button" onClick={() => router.back()} className="text-sm cursor-pointer font-semibold mb-7 tracking-[0.2em] uppercase flex items-center gap-1">
          <Icon icon="uil:arrow-left" className="w-5 h-5 -mt-0.5" />
          Go Back
        </button>
        <h1 className="text-4xl uppercase tracking-[0.325em]">
          Minecraft
          {' '}
          {type}
          {' '}
          ID List
        </h1>
        <p className="mt-6">
          {data.description}
        </p>
      </div>
      <div className="w-full px-8 md:px-44 content">
        <div className="flex gap-2 w-full mb-4 mt-24">
          <div className="border-2 w-full lg:w-auto border-neutral-600 p-4 flex items-center justify-center gap-4">
            <button type="button" onClick={() => setDisplayType(0)}>
              <Icon icon="akar-icons:sidebar-left" className={`w-7 h-7 ${displayType !== 0 ? 'text-neutral-400' : ''}`} />
            </button>
            <button type="button" onClick={() => setDisplayType(1)}>
              <Icon icon="akar-icons:grid" className={`w-7 h-7 ${displayType !== 1 ? 'text-neutral-400' : ''}`} />
            </button>
          </div>
          <div className="hidden lg:flex border-2 border-neutral-600 w-full p-4 gap-4 items-center">
            <Icon icon="akar-icons:search" className="w-7 h-7" />
            <input onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-neutral-600 placeholder-neutral-600 text-lg focus:outline-none" type="text" placeholder="Search for an item" />
          </div>
        </div>
        <div className="lg:hidden border-2 border-neutral-600 w-full p-4 mb-4 gap-4 flex items-center">
          <Icon icon="akar-icons:search" className="w-7 h-7" />
          <input onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-neutral-600 placeholder-neutral-600 text-lg focus:outline-none" type="text" placeholder="Search for an item" />
        </div>
        {displayType === 0 && (
        <div className="flex flex-wrap lg:flex-nowrap p-4 gap-y-4 gap-x-8 lg:gap-12 uppercase border-b-2 border-neutral-600">
          <div className="w-16 font-semibold text-sm flex">image</div>
          <div className="w-auto lg:w-1/4 font-semibold text-sm">name</div>
          <div className="w-auto lg:w-1/4 font-semibold text-sm">item id</div>
          <div className="w-auto lg:w-1/4 font-semibold text-sm">legacy item id</div>
          <div className="w-auto lg:w-1/4 font-semibold text-sm">numeral item id</div>
        </div>
        )}
      </div>
      {displayType === 0 ? (
        <div className="divide-y divide-neutral-600 w-full px-8 md:px-44">
          {data.items.map((e) => (
            <Link href={`/item/${e.name.toLowerCase().replace(/\s/g, '-')}`}>
              <div className="flex flex-wrap lg:flex-nowrap p-4 gap-4 lg:gap-12 items-center hover:bg-neutral-200 hover:bg-opacity-50 cursor-pointer transition-all duration-300">
                <div className="w-16 h-8 flex items-center justify-center">
                  {e.image && <img alt="" src={`https://minecraftitemids.com${e.image}`} />}
                </div>
                <div className="w-full lg:w-1/4 font-semibold cursor-pointer">{e.name}</div>
                <div className="w-full lg:w-1/4 break-all">{e.item_id}</div>
                <div className="w-full lg:w-1/4 break-all">{e.legacy_item_id}</div>
                <div className="w-full lg:w-1/4 break-all">{e.numeral_id}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <ul className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] px-8 md:px-44 gap-2 content-grid">
          {data.items
            .filter((e) => !query || e.name
              .toLowerCase()
              .includes(query.toLowerCase()))
            .map((e) => (
              <Link href={`/item/${e.name.toLowerCase().replace(/\s/g, '-')}`}>
                <li className="p-6 gap-8 items-center border-2 border-neutral-600 justify-between hover:bg-neutral-200 hover:bg-opacity-50 cursor-pointer transition-all duration-300">
                  <div className="flex items-center justify-between w-full gap-8">
                    <div className="text-xl font-semibold">{e.name}</div>
                    <div className="h-12 w-12 flex items-center justify-center">
                      {e.image && <img alt="" className="w-full h-full object-contain" src={`https://minecraftitemids.com${e.image.replace('32', '64')}`} />}
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-4 mt-8">
                    <div className="flex w-full">
                      <p className="text-xs font-semibold uppercase whitespace-nowrap w-36 flex-shrink-0">Item id</p>
                      <div className="break-all -mt-[0.25rem]">{e.item_id}</div>
                    </div>
                    {e.legacy_item_id && (
                      <div className="flex w-full">
                        <p className="text-xs font-semibold uppercase whitespace-nowrap w-36 flex-shrink-0">Legacy Item id</p>
                        <div className="break-all -mt-[0.25rem]">{e.legacy_item_id}</div>
                      </div>
                    )}
                    {e.numeral_id && (
                      <div className="flex w-full">
                        <p className="text-xs font-semibold uppercase whitespace-nowrap w-36 flex-shrink-0">Numeral id</p>
                        <div className="break-all -mt-[0.25rem]">{e.numeral_id}</div>
                      </div>
                    )}
                  </div>
                </li>
              </Link>
            ))}
        </ul>
      )}
    </div>
  );
}

export default Types;
