/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import copy from 'copy-to-clipboard';

export const getStaticPaths = async () => ({
  paths: [], // indicates that no page needs be created at build time
  fallback: 'blocking', // indicates the type of fallback
});

export async function getStaticProps(context) {
  const data = await fetch(`http://localhost:3000/api/item/${context.params.item}`).then((res) => res.json());
  return {
    props: {
      data,
    },
  };
}

function ItemID({ data }) {
  const [isCopied, setCopied] = useState(false);

  return (
    <div className="border-2 border-neutral-600 p-6 flex flex-col">
      <div className="flex items-center -ml-1 uppercase gap-2 font-semibold text-lg mb-6">
        <Icon icon="uil:tag-alt" className="w-7 h-7 -mt-0.5" />
        Item ID
      </div>
      <p>
        Each item in Minecraft has a unique ID assigned to it, known as an item ID, this can be used in commands to spawn the item into the game. The item ID for
        {' '}
        {data.name.toLowerCase()}
        {' '}
        in Minecraft is shown below:
      </p>
      <div className="w-full border-2 flex justify-between h-16 border-neutral-600 mt-6 text-lg">
        <div className="p-4 whitespace-nowrap overflow-x-auto">
          {data.item_id}
        </div>
        <button
          type="button"
          onClick={() => {
            copy(data.item_id);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}
          className="px-6 pt-1 -mr-0.5 -mt-0.5 bg-neutral-600 text-white uppercase font-semibold text-sm h-[105%] flex items-center justify-center"
        >
          {isCopied ? 'copied' : 'copy'}
        </button>
      </div>
    </div>
  );
}

function SpawnCommand({ data }) {
  const [isCopied, setCopied] = useState(false);

  return (
    <div className="border-2 border-neutral-600 p-6 flex flex-col">
      <div className="flex items-center -ml-1 uppercase gap-2 font-semibold text-lg mb-6">
        <Icon icon="bx:bx-command" className="w-7 h-7 -mt-0.5" />
        spawn command
      </div>
      <p>
        The
        {' '}
        {data.name}
        {' '}
        item can be spawned in Minecraft with the below command. Cheats must be enabled before this will work.
      </p>
      <div className="w-full border-2 flex justify-between h-16 border-neutral-600 mt-6 text-lg">
        <div className="p-4 whitespace-nowrap overflow-x-auto">
          /give @p
          {' '}
          {data.item_id}
          {' '}
          1
        </div>
        <button
          type="button"
          onClick={() => {
            copy(`/give @p ${data.item_id} 1`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}
          className="px-6 pt-1 -mr-0.5 -mt-0.5 bg-neutral-600 text-white uppercase font-semibold text-sm h-[105%] flex items-center justify-center"
        >
          {isCopied ? 'copied' : 'copy'}
        </button>
      </div>
    </div>
  );
}

function ItemInfo({ data }) {
  return (
    <div className="flex-1 h-min border-2 border-neutral-600 p-6 pb-2 flex flex-col">
      <div className="flex items-center -ml-1 uppercase gap-2 font-semibold text-lg mb-6">
        <Icon icon="uil:info-circle" className="w-7 h-7 -mt-0.5" />
        Item Information
      </div>
      {data.description && (
      <>
        <h2 className="uppercase font-semibold text-sm">Description</h2>
        <div className="mt-2">{data.description}</div>
      </>
      )}
      {JSON.stringify(data.properties) !== '{}' && (
      <>
        <h2 className="uppercase font-semibold text-sm mt-6">Properties</h2>
        <div className="divide-y divide-neutral-500 flex flex-col">
          {Object.entries(data.properties).map(([k, v]) => (
            <div className="flex items-center py-4 gap-8">
              <div className="font-medium w-1/2">{k}</div>
              <div className="w-1/2">{v}</div>
            </div>
          ))}
        </div>
      </>
      )}
    </div>
  );
}

function Recipies({ data }) {
  return (
    <div className="flex-1 h-min border-2 border-neutral-600 p-6 flex flex-col">
      <div className="flex items-center -ml-1 uppercase gap-2 font-semibold text-lg mb-6">
        <Icon icon="jam:tools" className="w-7 h-7 -mt-0.5" />
        Crafting Recipies
      </div>
      <div className="flex py-2 gap-6 items-center uppercase border-b border-neutral-600">
        <div className="w-1/3 font-semibold text-sm">ingredients</div>
        <div className="w-1/3 font-semibold text-sm">pattern</div>
        <div className="w-1/3 font-semibold text-sm">result</div>
      </div>
      <div className="divide-y divide-neutral-600">
        {data.recipies.map((r) => (
          <div className="py-4 flex items-center gap-6">
            <div className="w-1/3 flex-auto">
              <ul>
                {Object.entries(r.ingridient).map(([k, v]) => (
                  <li>
                    {v}
                    x
                    {' '}
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/3 flex-auto">
              <table>
                <tbody className="divide-y-2 divide-neutral-600">
                  {Array(3).fill().map((_, i) => (
                    <tr className="divide-x-2 divide-neutral-600">
                      {r.pattern.slice(i * 3, i * 3 + 3).map((p) => (
                        <td className="p-2">
                          <div className="w-6 h-6">
                            {p !== -1 ? <img src={`https://minecraftitemids.com/item/32/${p}.png`} alt="" /> : null}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-1/3 flex-auto">
              {Object.entries(r.result)[0][1]}
              x
              {' '}
              {Object.entries(r.result)[0][0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiningTools({ data }) {
  return (
    <div className="flex-1 h-min border-2 border-neutral-600 p-6 pb-2 flex flex-col">
      <div className="flex items-center -ml-1 uppercase gap-2 font-semibold text-lg mb-6">
        <Icon icon="jam:tools" className="w-7 h-7 -mt-0.5" />
        Mining Tools
      </div>
      <div className="flex py-2 items-center uppercase border-b border-neutral-600">
        <div className="w-1/2 pl-11 font-semibold text-sm">tools</div>
        <div className="w-1/2 font-semibold text-sm">speed</div>
      </div>
      <div className="divide-y divide-neutral-600">
        {Object.entries(data.mining).map(([k, v]) => (
          <div className="py-4 flex iems-center">
            <div className="font-medium flex items-center gap-4 w-1/2">
              <img src={`https://minecraftitemids.com/item/32/${k.toLowerCase().split(' ').join('_')}.png`} alt="" />
              {k}
            </div>
            <div className="w-1/2 flex items-center">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlockStates({ data }) {
  return (
    <div className="flex-1 h-min border-2 border-neutral-600 p-6 pb-2 flex flex-col">
      <div className="flex items-center -ml-1 uppercase gap-2 font-semibold text-lg mb-6">
        <Icon icon="jam:tools" className="w-7 h-7 -mt-0.5" />
        Block States
      </div>
      <div className="flex py-2 items-center uppercase border-b border-neutral-600">
        <div className="w-1/3 font-semibold text-sm">State name</div>
        <div className="w-1/3 font-semibold text-sm">type</div>
        <div className="w-1/3 font-semibold text-sm">values</div>
      </div>
      <div className="divide-y divide-neutral-600">
        {Object.entries(data.blockstates).map(([k, v]) => (
          <div className="py-4 flex">
            <div className="font-medium w-1/3">{k}</div>
            <div className="font-medium w-1/3">{v.type}</div>
            <div className="font-medium w-1/3">{v.values.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Item({ data }) {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex flex-col overflow-y-auto bg-neutral-100 text-neutral-600 py-16 md:py-56 px-8 md:px-44">
      <div className="flex flex-col gap-4 mb-12">
        <button type="button" onClick={() => router.back()} className="text-sm cursor-pointer font-semibold mb-2 tracking-[0.2em] uppercase flex items-center gap-1">
          <Icon icon="uil:arrow-left" className="w-5 h-5" />
          Go Back
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center">
            {data.image && <img alt="" src={`https://minecraftitemids.com${data.image.replace('32', '64')}`} />}
          </div>
          <h1 className="font-semibold text-2xl">{data.name}</h1>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col xl:flex-row">
        <div className="flex-1 h-min w-full xl:max-w-[50%] flex flex-col gap-4">
          <ItemID data={data} />
          <SpawnCommand data={data} />
          {data.mining.length > 0 && <MiningTools data={data} />}
          {JSON.stringify(data.blockstates) !== '{}' && <BlockStates data={data} />}
        </div>
        <div className="flex-1 h-min w-full xl:max-w-[50%] flex flex-col gap-4">
          {(data.description || JSON.stringify(data.properties) !== '{}') && <ItemInfo data={data} />}
          {data.recipies.length > 0 && <Recipies data={data} />}
        </div>
      </div>
    </div>
  );
}

export default Item;
