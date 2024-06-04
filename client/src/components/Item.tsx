import "../index.css";

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
    <div className={`py-1 text-xs`}>
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
    <article className="bg-secondary h-min bg-opacity-30 rounded-3xl px-5 pb-5 text-center grid grid-rows-auto min-w-fit border border-secondary">
      <img src={item.icon} className="justify-self-center m-5" />
      <p className="py-2 text-sm">
        {item.name} {item.base_type}
      </p>
      <div>
        {item.quality ? (
          <p className="text-xs">Quality: {item.quality}%</p>
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
        {renderMods(item.mods.crucible, item.item_id, "text-crucible")}
      </div>
    </article>
  );
}
