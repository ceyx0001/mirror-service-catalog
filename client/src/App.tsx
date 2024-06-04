import { useState, useEffect } from "react";
import "./index.css";
import { Shop, ShopType } from "./components/Shop";
import { Search } from "./components/Search";
import icon from "./assets/Mirror_of_Kalandra.png";

interface Paging {
  offset: number;
  limit: number;
}

export function App() {
  const [catalog, setCatalog] = useState<ShopType[]>([]);
  const [paging, setPaging] = useState<Paging>({ offset: 1, limit: 10 });
  const [toggleSidebar, setToggleSidebar] = useState(true);

  useEffect(() => {
    const getShops = async () => {
      const url = `http://localhost:3000/api/shops/range?offset=${paging.offset}&limit=${paging.limit}`; //import.meta.env.VITE_API_URL;
      const response = await fetch(url);
      const shops: ShopType[] = await response.json();
      setCatalog(shops);
    };

    getShops();
  }, [paging]);

  return (
    <div className="relative bg-black">
      <nav className="flex flex-row items-center fixed top-0 border-b-1 border-secondary/55 py-1 w-full bg-background z-50">
        <button
          className={`mx-4 transition group outline-none ${
            toggleSidebar ? "left-64" : "left-2"
          }`}
          onClick={() => setToggleSidebar((toggleSidebar) => !toggleSidebar)}
        >
          {navBtn}
        </button>
        <div className="flex flex-row items-center space-x-2">
          <img className="w-8 h-8" src={icon} />
          <p className="font-bold text-lg">Mirror Service Catalog</p>
        </div>
        <div className="ml-auto space-x-20 mx-20">
          <button className="text-primary hover:text-accent transition">
            About
          </button>
          <button className="text-primary hover:text-accent transition">
            Contact
          </button>
        </div>
      </nav>

      <aside
        className={`border-r-1 border-secondary/55 bg-background h-screen fixed top-0 z-10 pt-20 overflow-y-auto transition-transform duration-150 ease-out ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Search setCatalog={setCatalog} />
      </aside>

      <div
        className={`pt-10 px-3 my-5 space-y-12 flex flex-col ${
          toggleSidebar
            ? "ml-[268px]"
            : "ml-0"
        }`}
      >
        {catalog.map((shop) => (
          <div key={shop.profile_name} className="overflow-auto">
            <Shop shop={shop} />
          </div>
        ))}
      </div>
    </div>
  );
}

const navBtn = (
  <div className="flex justify-end">
    <div className="inline-flex justify-center items-center rounded-full text-primary transition hover:bg-primary/20 p-1">
      <svg
        className="flex-shrink-0 size-8"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
      </svg>
    </div>
  </div>
);
