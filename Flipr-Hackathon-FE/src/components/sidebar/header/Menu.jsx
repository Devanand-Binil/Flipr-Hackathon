import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from "../../../features/userSlice";

const Menu = ({ setShowCreateGroup }) => {
  const dispatch = useDispatch();
  return (
    <div
      className="absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1
      shadow-md w-52 rounded-md overflow-hidden
      border border-gray-200 dark:border-dark_border_1"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
    >
      <ul>
       {/* <li
          className="py-3 px-5 cursor-pointer hover:bg-dark_bg_3 transition-colors"
          onClick={() => setShowCreateGroup(true)}
          role="menuitem"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && setShowCreateGroup(true)}
        >
          New group
        </li>
        <li
          className="py-3 px-5 cursor-pointer hover:bg-dark_bg_3 transition-colors"
          role="menuitem"
          tabIndex={0}
        >
          New Community
        </li>
        <li
          className="py-3 px-5 cursor-pointer hover:bg-dark_bg_3 transition-colors"
          role="menuitem"
          tabIndex={0}
        >
          Starred Messages
        </li>
        <li
          className="py-3 px-5 cursor-pointer hover:bg-dark_bg_3 transition-colors"
          role="menuitem"
          tabIndex={0}
        >
          Settings
        </li>
        */}
        <li
          className="py-3 px-5 cursor-pointer hover:bg-red-600 hover:text-white transition-colors"
          onClick={() => dispatch(logout())}
          role="menuitem"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && dispatch(logout())}
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Menu;
