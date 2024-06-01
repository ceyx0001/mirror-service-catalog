import "../index.css";
import { Item, ItemType } from "./Item";

export interface ShopType {
  profileName: string;
  threadIndex: number;
  title: string;
  items: ItemType[];
}

export function Shop({ shopDetails }: { shopDetails: ShopType }) {
  return (
    <div className="bg-background rounded-t-3xl rounded-b-3xl">
      <div className="flex pt-5 pl-5 space-x-10 items-end">
        <p className="text-xl">{shopDetails.profileName}</p>
        <a
          className="text-text hover:text-accent transition"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.pathofexile.com/forum/view-thread/${shopDetails.threadIndex}`}
        >
          {shopDetails.title}
        </a>
      </div>
      <div className="p-5">
        <div className="flex space-x-5 hover:overflow-x-auto overflow-hidden h-[36rem] transition">
          {shopDetails.items.map((item: ItemType) => (
            <Item key={item.id} itemDetails={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
