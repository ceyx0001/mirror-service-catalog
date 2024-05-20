import { useState, useEffect } from "react";
import "../index.css";
import icon from "../assets/Mirror_of_Kalandra.png";

function Nav() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <nav className="flex justify-around items-center space-x-20 border-b-1 border-accent border-opacity-30 sticky p-2">
      <div className="flex w-1/6 justify-center items-center space-x-5">
        <img className="w-10 h-10" src={icon} />
        <p className="font-bold text-lg">Mirror Service Catalog</p>
      </div>
      <form className="group w-1/4 relative p-1">
        <input
          className="peer p-1 w-full placeholder-text text-center bg-transparent focus:outline-none focus:placeholder-opacity-0 caret-text text-text"
          type="text submit"
          placeholder="Search"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="absolute top-1/2 transform text-background group-hover:text-text -translate-y-1/2 h-6 w-6 duration-150 transition-all peer-focus:text-text"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <div className="absolute -translate-x-1/2 left-1/2 border-b-1 w-0 bg-text transition-all duration-150 group-hover:w-full peer-focus:w-full"></div>
      </form>
      <div className="flex justify-center w-1/6 space-x-20">
        <button className="bg-background text-primary hover:text-accent transition">
          About
        </button>
        <button className="bg-background text-primary hover:text-accent transition">
          Contact
        </button>
      </div>
    </nav>
  );
}

export default Nav;
