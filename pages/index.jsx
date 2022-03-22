/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Head from 'next/head';

export default function Home() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [displayType, setDisplayType] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetch('/api/items/all')
      .then((res) => res.json())
      .then((res) => {
        const d = res.map((e) => ({ ...e, _id: undefined }));
        setData(d);
      });
  }, []);

  useEffect(() => {
    document.querySelector('.content').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [currentPage]);

  return (
    <div className="w-full h-screen flex items-center overflow-y-auto bg-neutral-100 text-neutral-600 flex-col py-56">
      <Head>
        <title>Minecraft Item ID List</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="px-44 w-full">
        <p className="mb-2">The world&apos;s favorite complete, up-to-date 1.18</p>
        <h1 className="text-4xl uppercase tracking-[0.325em]">Minecraft Item ID List</h1>
        <p className="mt-6">
          This is a searchable, interactive database of all Minecraft item and block IDs. On this website, you can find lists of all types of items.
          <br />
          <br />
          Each item has its own individual page, on which you can find crafting recipes, spawn commands, and useful information about it. For example, the command block page contains information about its block state.
        </p>
        <button type="button" className="font-medium px-8 py-4 mt-8 border-2 border-neutral-600 tracking-[0.2em]">SORT ITEM IDS BY TYPE</button>
      </div>
      <div className="w-full px-44 content">
        <div className="flex gap-2 w-full mb-4 mt-24">
          <div className="border-2 border-neutral-600 p-4 flex items-center justify-center gap-4">
            <button type="button" onClick={() => setDisplayType(0)}>
              <Icon icon="akar-icons:sidebar-left" className={`w-7 h-7 ${displayType !== 0 ? 'text-neutral-400' : ''}`} />
            </button>
            <button type="button" onClick={() => setDisplayType(1)}>
              <Icon icon="akar-icons:grid" className={`w-7 h-7 ${displayType !== 1 ? 'text-neutral-400' : ''}`} />
            </button>
          </div>
          <div className="border-2 border-neutral-600 w-full p-4 gap-4 flex items-center">
            <Icon icon="akar-icons:search" className="w-7 h-7" />
            <input onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-neutral-600 placeholder-neutral-600 text-lg focus:outline-none" type="text" placeholder="Search for an item" />
          </div>
          <div className="border-2 border-neutral-600 p-4 flex items-center justify-center gap-4 font-semibold text-lg">
            <Icon icon="uil:filter" className="w-7 h-7" />
            Filter
            <Icon icon="uil:angle-down" className="w-7 h-7" />
          </div>
        </div>
        {displayType === 0 && (
        <div className="flex p-4 gap-12 items-center uppercase border-b-2 border-neutral-600">
          <div className="w-16 font-semibold text-sm flex items-center justify-center">image</div>
          <div className="w-1/4 font-semibold text-sm">name</div>
          <div className="w-1/4 font-semibold text-sm">item id</div>
          <div className="w-1/4 font-semibold text-sm">legacy item id</div>
          <div className="w-1/4 font-semibold text-sm">numeral item id</div>
        </div>
        )}
      </div>
      {displayType === 0 ? (data.length > 0 ? (
        <div className="divide-y divide-neutral-600 w-full px-44">
          {data.filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase())).slice(query ? 0 : currentPage * 60, query ? data.length : currentPage * 60 + 60).map((e) => (
            <div className="flex p-4 gap-12 items-center">
              <div className="w-16 h-8 flex items-center justify-center">
                {e.image && <img alt="" src={`https://minecraftitemids.com${e.image}`} />}
              </div>
              <div className="w-1/4 font-semibold">{e.name}</div>
              <div className="w-1/4 break-all">{e.item_id}</div>
              <div className="w-1/4 break-all">{e.legacy_item_id}</div>
              <div className="w-1/4 break-all">{e.numeral_id}</div>
            </div>
          ))}
        </div>
      ) : 'Loading...'
      ) : (
        <div>
          <ul className="w-full grid grid-cols-3 px-44 gap-2 content-grid">
            {data
              .filter((e) => !query || e.name
                .toLowerCase()
                .includes(query.toLowerCase()))
              .slice(query ? 0 : currentPage * 60, query ? data.length : currentPage * 60 + 60)
              .map((e) => (
                <li className="p-6 gap-8 items-center border-2 border-neutral-600 justify-between">
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
              ))}
          </ul>
        </div>
      )}
      {!query && (
      <div className="w-full flex items-center justify-center mt-8 gap-6 font-semibold">
        <button type="button" onClick={() => setCurrentPage(currentPage - 1)}>
          <Icon icon="uil:angle-left" className="w-5 h-5" />
        </button>
        {currentPage > 1 && (
        <>
          <button type="button" className="text-neutral-400" onClick={() => setCurrentPage(0)}>1</button>
          <span className="text-neutral-400">...</span>
        </>
        )}
        {currentPage - 1 > 1 && <button type="button" className="text-neutral-400" onClick={() => setCurrentPage(currentPage - 2)}>{currentPage - 1}</button>}
        {currentPage > 0 && <button type="button" className="text-neutral-400" onClick={() => setCurrentPage(currentPage - 1)}>{currentPage}</button>}
        <button type="button" className="text-xl" onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 1}</button>
        {currentPage + 2 <= 23 && <button type="button" className="text-neutral-400" onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 2}</button>}
        {currentPage + 3 < 23 && <button type="button" className="text-neutral-400" onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 3}</button>}
        {currentPage + 2 < 23 && (
        <>
          <span className="text-neutral-400">...</span>
          <button type="button" className="text-neutral-400" onClick={() => setCurrentPage(22)}>23</button>
        </>
        )}
        <button type="button" onClick={() => setCurrentPage(currentPage + 1)}>
          <Icon icon="uil:angle-right" className="w-5 h-5" />
        </button>
      </div>
      )}
    </div>
  );
}
