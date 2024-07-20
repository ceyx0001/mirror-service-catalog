import { Item, ItemType } from "./Item";
import { Accordion } from "../Accordian";
import { useRef, useLayoutEffect } from "react";

export type ShopType = {
  profileName: string;
  characterName: string;
  threadIndex: number;
  title: string;
  items: ItemType[];
};
//USE MEMO USE MEMO YSE MEMO M/USE MEMO USE MEMO YSE MEMO M/USE MEMO USE MEMO YSE MEMO M/USE MEMO USE MEMO YSE MEMO M
// react dev tools
// shop information
export function Shop({ shop }: { shop: ShopType }) {
  const ref = useRef<HTMLDivElement>(null);
  const heightRef = useRef(0);

  useLayoutEffect(() => {
    if (ref.current) {
      heightRef.current = ref.current.clientHeight;
    }
  });

  return (
    <div ref={ref} className="px-12 py-5 space-y-5 relative bg-background">
      <div className="flex space-x-10 items-end">
        <span className="lg:text-xl">{shop.profileName}</span>
        <a
          className="text-primary hover:text-text transition"
          aria-label="Shop-Link"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.pathofexile.com/forum/view-thread/${shop.threadIndex}`}
        >
          <span className="text-primary hover:text-text transition">
            {shop.title}
          </span>
        </a>
      </div>
      <Accordion>
        <div className="grid lg:grid-cols-4 grid-cols-1 grid-flow-row gap-10">
          {shop.items.map((item: ItemType) => (
            <Item key={item.itemId} item={item} owner={shop.characterName} />
          ))}
        </div>
      </Accordion>
    </div>
  );
}
