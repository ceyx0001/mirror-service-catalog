import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    const catalogFetch = async () => {
      const params = new URLSearchParams({
        startPage: 1,
        endPage: 1,
      });
      setCatalog(
        await fetch(`http://localhost:3000/api/catalog?${params}`)
      );
    };

    catalogFetch();
  }, []);

  return <div></div>;
}

export default App;
