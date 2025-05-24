import React from 'react';
import Contact from './Contact';

const SearchResults = ({ searchResults, setSearchResults }) => {
  // Ensure it's always an array
  const resultsArray = Array.isArray(searchResults) ? searchResults : [];

  return (
    <div className="w-full convos scrollbar dark:bg-dark_bg_2 rounded-lg overflow-hidden">
      <div>
        <div className="flex flex-col px-6 pt-6 pb-2">
          <h1 className="font-extralight text-md text-green_2 select-none">
            Contacts
          </h1>
          <div className="w-full mt-3 border-b border-green_2 opacity-40"></div>
        </div>
        <ul>
          {resultsArray.map((user) => (
            <Contact
              contact={user}
              key={user._id}
              setSearchResults={setSearchResults}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResults;
