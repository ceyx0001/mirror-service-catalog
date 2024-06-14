import { useState, useEffect } from "react";
import { Shop, ShopType } from "./components/Shop";
import { Search } from "./components/search/Search";
import { Nav } from "./components/nav/Nav";

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
      <Nav toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />

      <aside
        className={`border-r-1 border-secondary/55 bg-background h-screen fixed top-0 z-10 pt-20 transition-transform duration-150 ease-out ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Search setCatalog={setCatalog} setPaging={setPaging} />
      </aside>

      <div
        className={`px-10 my-10 flex flex-col space-y-3 ${
          toggleSidebar ? "lg:ml-[16rem] ml-[8rem]" : "ml-0"
        }`}
      >
        {catalog.map((shop) => (
          <div key={shop.profile_name} className="overflow-visible">
            <Shop shop={shop} />
          </div>
        ))}
      </div>
    </div>
  );
}
