import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import { Shop, ShopType } from "./components/Shop";
import { Search } from "./components/Search";
import icon from "./assets/Mirror_of_Kalandra.png";

interface Paging {
  offset: number;
  max: number;
}

const navBtn = (
  <div className="flex justify-end">
    <div className="inline-flex justify-center items-center rounded-full text-primary hover:bg-primary/20 p-1">
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

function App() {
  const [catalog, setCatalog] = useState<ShopType[]>([]);
  const [paging, setPaging] = useState<Paging>({ offset: 1, max: 10 });
  const [toggleSidebar, setToggleSidebar] = useState(true);

  useEffect(() => {
    const getShops = async () => {
      const url = `http://localhost:3000/api/shops?offset=${paging.offset}&max=${paging.max}`; //import.meta.env.VITE_API_URL;
      const response = await fetch(url);
      const shops: ShopType[] = await response.json();
      setCatalog(shops);
    };

    getShops();
  }, [paging]);

  return (
    <div className="relative bg-background">
      <nav className="flex flex-row items-center fixed border-b-1 border-secondary/55 py-1 w-full bg-background">
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
      <div className="flex pt-[49px] flex-shrink-0">
        <aside className="w-1/6 h-full">
          <Transition show={toggleSidebar}>
            <div className="">
              <Search />
            </div>
          </Transition>
        </aside>
        <div className="grow my-5 mx-5 space-y-12 box-content overflow-auto">
          {catalog.map((shop) => (
            <Shop key={shop.profileName} shopDetails={shop} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
