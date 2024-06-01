import "../index.css";

export interface ItemType {
  id: string;
  icon: string;
  name: string;
  base_type: string;
  quality: number;
  enchant_mods: string[];
  implicit_mods: string[];
  explicit_mods: string[];
  fractured_mods: string[];
  crucible_mods: string[];
}

function renderMods(mods: string[], id: string, color: string) {
  return mods !== null ? (
    <div className={`py-1 text-xs`}>
      {mods.map((text: string, j) => (
        <p key={`${id}${j}`} className={`${color}`}>
          {text}
        </p>
      ))}
    </div>
  ) : null;
}

export function Item({ itemDetails }: { itemDetails: ItemType }) {
  return (
    <article className="bg-secondary h-min bg-opacity-30 rounded-3xl p-5 text-center mb-5 grid grid-rows-auto min-w-fit">
      <img src={itemDetails.icon} className="justify-self-center m-5" />
      <p className="py-2 text-sm">
        {itemDetails.name} {itemDetails.base_type}
      </p>
      <div>
        {itemDetails.quality ? (
          <p className="py-2 text-xs">Quality: {itemDetails.quality}%</p>
        ) : null}
        {renderMods(itemDetails.enchant_mods, itemDetails.id, "text-crafted")}
        {itemDetails.implicit_mods ? (
          <>
            <hr className="h-px my-1 bg-accent border-0" />
            {renderMods(itemDetails.implicit_mods, itemDetails.id, "text-mod")}
          </>
        ) : null}
        <hr className="h-px my-1 bg-accent border-0" />
        {renderMods(itemDetails.explicit_mods, itemDetails.id, "text-mod")}
        {renderMods(
          itemDetails.fractured_mods,
          itemDetails.id,
          "text-fractured"
        )}
        {renderMods(itemDetails.crucible_mods, itemDetails.id, "text-crucible")}
      </div>
    </article>
  );
}
