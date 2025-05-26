import { useState } from 'react';
import { SidebarHeader } from './header';
import { Notifications } from './notifications';
import { Search, SearchResults } from './search';
import { Conversations } from './conversations'; // Commented out

export default function Sidebar({ onlineUsers, typing }) {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="flex flex-col min-w-[280px] max-w-[20%] h-full bg-dark_bg_4 dark:border-r-white select-none overflow-hidden">
      <SidebarHeader />

      {/* <Notifications /> */}

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
