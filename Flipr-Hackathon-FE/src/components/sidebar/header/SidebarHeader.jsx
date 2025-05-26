import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from '../../../svg';
import Menu from './Menu';
import { CreateGroup } from './createGroup';

export default function SidebarHeader() {
  const { user } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <>
      <div className="h-[50px] dark:bg-dark_bg_4 border-b-white flex items-center p-4">
        <div className="w-full flex items-center justify-between">
          <button
            className="btn"
            aria-label="User profile"
            title={user.name}
          >
            <img
              src={user.picture}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </button>

          <ul className="flex items-center gap-x-2">
<<<<<<< HEAD
            {/* <li>
=======
           {/*} <li>
>>>>>>> da3314b7321c6c74fc800426cd1c69e05ea4b165
              <button className="btn" aria-label="Community" title="Community">
                <CommunityIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li>
              <button className="btn" aria-label="Stories" title="Stories">
                <StoryIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li>
              <button className="btn" aria-label="Chats" title="Chats">
                <ChatIcon className="dark:fill-dark_svg_1" />
              </button>
<<<<<<< HEAD
            </li> */}
=======
            </li>
            */}
>>>>>>> da3314b7321c6c74fc800426cd1c69e05ea4b165
            <li className="relative" onClick={() => setShowMenu((prev) => !prev)}>
              <button
                className={`btn ${showMenu ? "bg-dark_hover_1" : ""}`}
                aria-label="Menu"
                title="Menu"
              >
                <DotsIcon className="dark:fill-dark_svg_1" />
              </button>
              {showMenu && <Menu setShowCreateGroup={setShowCreateGroup} />}
            </li>
          </ul>
        </div>
      </div>
      {showCreateGroup && <CreateGroup setShowCreateGroup={setShowCreateGroup} />}
    </>
  );
}
