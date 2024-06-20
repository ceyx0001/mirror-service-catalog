import { Item, ItemType } from "./Item";
import { Accordion } from "./Accordian";

export type ShopType = {
  profile_name: string;
  thread_index: number;
  title: string;
  items: ItemType[];
};

export function Shop({ shop }: { shop: ShopType }) {
  return (
    <div className="bg-background px-5 pt-5 space-y-5 relative">
      <div className="flex space-x-10 items-end">
        <p className="text-xl">{shop.profile_name}</p>
        <a
          className="text-primary hover:text-text transition"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.pathofexile.com/forum/view-thread/${shop.thread_index}`}
        >
          {shop.title}
        </a>
      </div>
      <Accordion defaultOpen={true} title="">
        <div className="grid grid-cols-4 grid-flow-row justify-items-center gap-y-5">
          {shop.items.map((item: ItemType) => (
            <Item key={item.item_id} item={item} />
          ))}
        </div>
      </Accordion>
    </div>
  );
}
