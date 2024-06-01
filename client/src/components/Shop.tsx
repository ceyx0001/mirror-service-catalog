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
    <div>
      <div className="flex pt-5 pl-5 space-x-10 items-end bg-black rounded-t-3xl">
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
      <div className="bg-black p-5 rounded-b-3xl">
        <div className="flex space-x-5 overflow-auto">
          {shopDetails.items.map((item: ItemType) => (
            <Item key={item.id} itemDetails={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
