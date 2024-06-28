import { useState } from "react";
import { Tooltip } from "./Tooltip";

type Mods = {
  enchant: string[];
  implicit: string[];
  explicit: string[];
  fractured: string[];
  crafted: string[];
  crucible: string[];
};

export type ItemType = {
  itemId: string;
  fee: string;
  icon: string;
  name: string;
  baseType: string;
  quality: number;
  mods: Mods;
};

function renderMods(mods: string[], id: string, color: string) {
  return mods ? (
    <div className={`py-1`}>
      {mods.map((text: string, i) => (
        <p key={`${id}${i}`} className={`${color}`}>
          {text}
        </p>
      ))}
    </div>
  ) : null;
}

function writeItem(item: ItemType) {
  let mods = "";
  for (const key in item.mods) {
    if (key) {
      for (const value of item.mods[key as keyof Mods]) {
        if (value) {
          mods = mods + "\n" + value;
        }
      }
    }
  }
  return `${item.name}\n${item.baseType}\nQuality: ${item.quality}%\n${mods}`;
}

// item information
export function Item({ item, owner }: { item: ItemType; owner: string }) {
  const [enlarge, setEnlarge] = useState(false);

  function handleWhisper() {
    if (owner) {
      navigator.clipboard.writeText(
        "@" +
          owner +
          " Hello, I would like to mirror " +
          item.name +
          " " +
          item.baseType +
          (item.fee ? " for " + item.fee : "")
      );
    }
  }

  console.log(item.fee);

  return (
    <article
      className={`text-[0.7rem] bg-card h-min max-h-min
        rounded-3xl px-4 pb-3 grid grid-rows-auto
        shadow-lg shadow-black hover:cursor-pointer transition-[transform, colors] border border-secondary duration-300 ${
          enlarge && "scale-[1.3] relative z-40 border border-accent"
        }`}
      onClick={(e) => {
        e.stopPropagation();
        setEnlarge(!enlarge);
      }}
    >
      <img src={item.icon} className="justify-self-center m-5" />

      <div className="inline-flex space-x-5">
        <Tooltip baseText={"Copy POB"} eventText={"Copied"}>
          <button
            aria-label="Copy-POB"
            onClick={() => navigator.clipboard.writeText(writeItem(item))}
          >
            <svg
              className="w-5 h-5 text-primary hover:text-text transition-colors"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
          </button>
        </Tooltip>

        <Tooltip
          baseText={"Copy Whisper"}
          eventText={owner === null ? "Missing IGN/Private Profile" : "Copied"}
        >
          <button aria-label="Copy-Whisper" onClick={handleWhisper}>
            <svg
              className="w-5 h-5 text-primary hover:text-text transition-colors"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 14 3-3m-3 3 3 3m-3-3h16v-3m2-7-3 3m3-3-3-3m3 3H3v3"
              />
            </svg>
          </button>
        </Tooltip>
        {item.fee && <span className="text-[0.85rem]">Fee: {item.fee}D</span>}
      </div>

      <span className="py-2 text-[0.9rem]">
        {item.name} {item.baseType}
      </span>
      <div>
        {item.quality ? (
          <span className="">Quality: {item.quality}%</span>
        ) : null}
        {renderMods(item.mods.enchant, item.itemId, "text-crafted")}
        {item.mods.implicit ? (
          <>
            <hr className="h-px my-1 bg-accent border-0" />
            {renderMods(item.mods.implicit, item.itemId, "text-mod")}
          </>
        ) : null}
        <hr className="h-px my-1 bg-accent border-0" />
        {renderMods(item.mods.explicit, item.itemId, "text-mod")}
        {renderMods(item.mods.fractured, item.itemId, "text-fractured")}
        {renderMods(item.mods.crafted, item.itemId, "text-crafted")}
        {renderMods(item.mods.crucible, item.itemId, "text-crucible")}
      </div>
    </article>
  );
}
