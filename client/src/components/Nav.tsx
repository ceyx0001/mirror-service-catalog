import { useState, useEffect } from "react";

function Nav() {
  const [searchTerm, setSearchTerm] = useState('');


  return (
    <div>
      <h1>Mirror Service Catalog</h1>
      <form className="search-bar">
        <input type="text submit" placeholder="Search..." />
      </form>
    </div>
  );
}

export default Nav;
