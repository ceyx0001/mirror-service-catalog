import { Item, ItemType } from "./Item";

export type ShopType = {
  profile_name: string;
  thread_index: number;
  title: string;
  items: ItemType[];
};

export function Shop({ shop }: { shop: ShopType }) {
  return (
    <div className="bg-background rounded-t-3xl rounded-b-3xl p-5 space-y-5">
      <div className="flex space-x-10 items-end">
        <p className="text-xl">{shop.profile_name}</p>
        <a
          className="text-text hover:text-accent transition"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.pathofexile.com/forum/view-thread/${shop.thread_index}`}
        >
          {shop.title}
        </a>
      </div>
        <div className="flex space-x-5 transition overflow-auto">
          {shop.items.map((item: ItemType) => (
            <Item key={item.item_id} item={item} />
          ))}
        </div>
    </div>
  );
}
