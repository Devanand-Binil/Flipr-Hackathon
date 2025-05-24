import React from 'react';
import { ArrowIcon, CloseIcon, NotificationIcon } from '../../../svg';

const Notifications = () => {
  return (
    <div className="h-[90px] dark:bg-dark_bg_3 flex items-center px-4 py-3 border-b dark:border-b-dark_border_2">
      <div className="flex items-center justify-between w-full">
        {/* Left: Notification Icon + Text */}
        <div className="flex items-center gap-4">
          <div className="cursor-pointer">
            <NotificationIcon className="dark:fill-blue_1" />
          </div>

          <div className="flex flex-col">
            <span className="textPrimary font-medium">
              Get notified of new messages
            </span>
            <span className="textSecondary mt-0.5 flex items-center gap-1 text-sm">
              Turn on desktop notifications
              <ArrowIcon className="dark:fill-dark_svg_2 mt-px" />
            </span>
          </div>
        </div>

        {/* Right: Close Icon */}
        <div className="cursor-pointer">
          <CloseIcon className="dark:fill-dark_svg_2 w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
