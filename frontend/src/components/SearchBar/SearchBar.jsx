import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-40 sm:w-60 md:w-80 bg-slate-100 rounded-md px-3">
      <input
        type="text"
        placeholder="Search Notes..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent text-sm py-2 outline-none placeholder:text-slate-500"
      />

      {value && (
        <IoMdClose
          onClick={onClearSearch}
          className="text-slate-500 text-lg cursor-pointer hover:text-black"
        />
      )}

      <FaMagnifyingGlass
        onClick={handleSearch}
        className="text-slate-500 text-lg cursor-pointer hover:text-black ml-2"
      />
    </div>
  );
};

export default SearchBar;
