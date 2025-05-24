import React, { useState } from 'react';
import { FilterIcon, ReturnIcon, SearchIcon } from '../../../svg';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Search = ({ searchLength, setSearchResults }) => {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [show, setShow] = useState(false);

  const handleSearch = async (e) => {
    if (e.target.value && e.key === 'Enter') {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(data);
      } catch (error) {
        console.log(error.response.data.error.message);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="h-[52px] px-3 py-2 dark:bg-dark_bg_2">
      <div className="flex items-center gap-2">
        <div className="flex items-center w-full bg-dark_bg_1 dark:bg-dark_hover_1 rounded-xl px-3 py-1.5 focus-within:ring-2 ring-green_1">
          {show || searchLength > 0 ? (
            <span
              className="w-6 h-6 flex items-center justify-center rotateAnimation cursor-pointer"
              onClick={() => setSearchResults([])}
            >
              <ReturnIcon className="fill-green_1 w-5 h-5" />
            </span>
          ) : (
            <span className="w-6 h-6 flex items-center justify-center">
              <SearchIcon className="dark:fill-dark_svg_2 w-5 h-5" />
            </span>
          )}
          <input
            type="text"
            placeholder="Search or start a chat"
            className="bg-transparent outline-none px-2 text-sm w-full dark:text-dark_text_1 placeholder:text-dark_text_2"
            onFocus={() => setShow(true)}
            onBlur={() => searchLength === 0 && setShow(false)}
            onKeyDown={(e) => handleSearch(e)}
          />
        </div>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-dark_bg_3 transition-colors"
          title="Filter"
        >
          <FilterIcon className="dark:fill-dark_svg_2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Search;
