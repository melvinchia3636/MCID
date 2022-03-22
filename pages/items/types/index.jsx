/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import Link from 'next/link';

export async function getStaticProps() {
  const data = await fetch('http://localhost:3000/api/items/types/all').then((res) => res.json());
  const d = data.map((e) => ({ ...e, _id: null }));
  return {
    props: {
      data: d,
    },
  };
}

export default function Types({ data }) {
  return (
    <div className="w-full h-screen flex items-center overflow-y-auto bg-neutral-100 text-neutral-600 flex-col py-56">
      <Head>
        <title>Minecraft Item ID List</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="px-44 w-full">
        <Link href="/items" className="w-min">
          <div className="text-sm cursor-pointer font-semibold mb-7 tracking-[0.2em] uppercase flex items-center gap-1">
            <Icon icon="uil:arrow-left" className="w-5 h-5" />
            Go Back
          </div>
        </Link>
        <h1 className="text-4xl uppercase tracking-[0.325em]">Sort Item IDs By Type</h1>
        <p className="mt-6">
          Find below links to lists of Minecraft items sorted by their type.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-2 w-full px-44 gap-2">
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
