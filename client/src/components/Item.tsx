import { useState } from "react";

type Mods = {
  explicit: string[];
  crucible: string[];
  crafted: string[];
  implicit: string[];
  enchant: string[];
  fractured: string[];
};

export type ItemType = {
  item_id: string;
  icon: string;
  name: string;
  base_type: string;
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

export function Item({ item }: { item: ItemType }) {
  return (
    <article
      className={`text-[12px] min-w-[21rem] max-w-[21rem] bg-secondary h-min bg-opacity-30 rounded-3xl px-5 pb-5 text-center grid grid-rows-auto shadow-inner hover:shadow-secondary transition-shadow`}
    >
      <img src={item.icon} className="justify-self-center m-5" />
      <p className="py-2">
        {item.name} {item.base_type}
      </p>
      <div>
        {item.quality ? <p className="">Quality: {item.quality}%</p> : null}
        {renderMods(item.mods.enchant, item.item_id, "text-crafted")}
        {item.mods.implicit ? (
          <>
            <hr className="h-px my-1 bg-accent border-0" />
            {renderMods(item.mods.implicit, item.item_id, "text-mod")}
          </>
        ) : null}
        <hr className="h-px my-1 bg-accent border-0" />
        {renderMods(item.mods.explicit, item.item_id, "text-mod")}
        {renderMods(item.mods.fractured, item.item_id, "text-fractured")}
        {renderMods(item.mods.crafted, item.item_id, "text-crafted")}
        {renderMods(item.mods.crucible, item.item_id, "text-crucible")}
      </div>
    </article>
  );
}
