import { useEffect, useState } from "react";
import "./index.css";
import Nav from "./components/Nav";

interface Shop {
  icon: string;
  name: string;
  implicitMods: string;
  explicitMods: string;
  [key: string]: unknown;
}

function App() {
  const [catalog, setCatalog] = useState<Shop[][]>([]);
  /*useEffect(() => {
    const getShops = async () => {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(url);
      const shops: Shop[][] = await response.json();
      setCatalog(shops);
    };

    getShops();
  }, []);*/

  return (
    <div>
      <Nav />
    </div>
  );
}

export default App;
