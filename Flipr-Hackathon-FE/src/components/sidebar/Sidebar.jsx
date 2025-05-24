import React, { useState } from 'react';
import { SidebarHeader } from './header';
import { Notifications } from './notifications';
import { Search, SearchResults } from './search';
import { Conversations } from './conversations';

export default function Sidebar({ onlineUsers, typing }) {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="flex flex-col max-w-[30%] h-full bg-dark_bg_1 dark:border-r-dark_border_2 select-none overflow-hidden">
      <SidebarHeader />

      <Notifications />

      <Search searchLength={searchResults.length} setSearchResults={setSearchResults} />

      <div className="flex-1 overflow-auto scrollbar px-2">
        {searchResults.length > 0 ? (
          <SearchResults searchResults={searchResults} setSearchResults={setSearchResults} />
        ) : (
          <Conversations onlineUsers={onlineUsers} typing={typing} />
        )}
      </div>
    </div>
  );
}
