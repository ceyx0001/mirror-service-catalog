import { useEffect, useState } from "react";
import "./index.css";

interface Shop {
  icon: string;
  name: string;
  implicitMods: string;
  explicitMods: string;
  [key: string]: unknown;
}

function App() {
  const [catalog, setCatalog] = useState<Shop[][]>([]);

  useEffect(() => {
    const getShops = async () => {
      const params = new URLSearchParams({
        startPage: '1',
        endPage: '1',
      });
      const url = `${process.env.API_URL}/catalog?${params.toString()}`;
      const response = await fetch(url);
      const shops: Shop[][] = await response.json();
      setCatalog(shops);
    };
    
    getShops();
  }, []);

  return <div></div>;
}

export default App;
