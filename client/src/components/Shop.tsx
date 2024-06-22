import { Item, ItemType } from "./Item";
import { Accordion } from "./Accordian";

export type ShopType = {
  profile_name: string;
  thread_index: number;
  title: string;
  items: ItemType[];
};

// shop information
export function Shop({ shop }: { shop: ShopType }) {
  return (
    <div className="bg-background px-5 pt-5 space-y-5 relative">
      <div className="flex space-x-10 items-end">
        <span className="lg:text-xl">{shop.profile_name}</span>
        <a
          className="text-primary hover:text-text transition"
          aria-label="Shop-Link"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.pathofexile.com/forum/view-thread/${shop.thread_index}`}
        >
          <span className="text-primary hover:text-text transition">{shop.title}</span>
        </a>
      </div>
      <Accordion defaultOpen={true} title="">
        <div className="grid lg:grid-cols-4 grid-cols-1 grid-flow-row justify-items-center gap-y-5 gap-x-5">
          {shop.items.map((item: ItemType) => (
            <Item key={item.item_id} item={item} />
          ))}
        </div>
      </Accordion>
    </div>
  );
}
