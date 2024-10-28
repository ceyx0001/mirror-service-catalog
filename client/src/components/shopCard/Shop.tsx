import { Item, ItemType } from "./Item";
import { Accordion } from "../Accordian";
import { useRef, useState } from "react";

export type ShopType = {
  profileName: string;
  characterName: string;
  threadIndex: number;
  title: string;
  views: number;
  items: ItemType[];
};

// shop information
export function Shop({
  shop,
  renderAsOpen = true,
  stateCallback,
}: {
  shop: ShopType;
  renderAsOpen?: boolean;
  stateCallback: (openState: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enlarge, setEnlarge] = useState<string | null>(null);

  return (
    <div ref={ref} className="px-12 py-5 relative bg-background">
      <div className="flex items-end pb-5">
        <span className="lg:text-xl">{shop.profileName}</span>
        <a
          className="text-primary hover:text-text transition"
          aria-label="Shop-Link"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.pathofexile.com/forum/view-thread/${shop.threadIndex}`}
        >
          <span className="text-primary hover:text-text transition pl-10">
            {shop.title}
          </span>
        </a>
      </div>
      <Accordion renderAsOpen={renderAsOpen} handleClick={stateCallback} animate={false}>
        <div className="grid lg:grid-cols-4 grid-cols-1 grid-flow-row gap-10 pt-5">
          {shop.items.map((item: ItemType) => (
            <Item
              key={item.itemId}
              item={item}
              owner={shop.characterName}
              enlarge={enlarge === item.itemId}
              setEnlarge={setEnlarge}
            />
          ))}
        </div>
      </Accordion>
    </div>
  );
}
