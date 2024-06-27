import { Item, ItemType } from "./Item";
import { Accordion } from "./Accordian";

export type ShopType = {
  profileName: string;
  characterName: string;
  threadIndex: number;
  title: string;
  items: ItemType[];
};

// shop information
export function Shop({ shop }: { shop: ShopType }) {
  return (
    <div className="bg-background px-12 pt-5 space-y-5 relative">
      <div className="flex space-x-10 items-end">
        <span className="lg:text-xl">{shop.profileName}</span>
        <a
          className="text-primary hover:text-text transition"
          aria-label="Shop-Link"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.pathofexile.com/forum/view-thread/${shop.threadIndex}`}
        >
          <span className="text-primary hover:text-text transition">{shop.title}</span>
        </a>
      </div>
      <Accordion defaultOpen={true}>
        <div className="grid lg:grid-cols-4 grid-cols-1 grid-flow-row gap-10">
          {shop.items.map((item: ItemType) => (
            <Item key={item.itemId} item={item} owner={shop.characterName} />
          ))}
        </div>
      </Accordion>
    </div>
  );
}
