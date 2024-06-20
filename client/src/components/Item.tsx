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
        <span key={`${id}${i}`} className={`${color}`}>
          {text}
        </span>
      ))}
    </div>
  ) : null;
}

// item information
export function Item({ item }: { item: ItemType }) {
  const [enlarge, setEnlarge] = useState(false);

  function blockClick(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  return (
    <article
      className={`text-[0.65rem] bg-card w-80 min-h-min
        rounded-3xl px-4 pb-3 grid grid-rows-auto
        shadow-lg shadow-black hover:cursor-pointer transition-[transform, colors] border border-secondary duration-300 ${
          enlarge && "scale-[1.3] relative z-40 border border-accent"
        }`}
      onClick={(e) => {
        blockClick(e);
        setEnlarge(!enlarge);
      }}
    >
      <img src={item.icon} className="justify-self-center m-5" />
      <span className="py-2">
        {item.name} {item.base_type}
      </span>
      <div>
        {item.quality ? (
          <span className="">Quality: {item.quality}%</span>
        ) : null}
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
