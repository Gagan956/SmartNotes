import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout, userInfo = {} }) => {
  // Derive initials with useMemo for performance
  const initials = useMemo(() => getInitials(userInfo?.username || ""), [userInfo?.username]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-sm">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md overflow-hidden flex-shrink-0">
          {userInfo?.profilePhoto ? (
            <img
              src={userInfo.profilePhoto}
              alt={userInfo?.username}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[120px] sm:max-w-[160px]">
            {userInfo?.username || "Guest User"}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[160px]">
            {userInfo?.email || "guest@example.com"}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        <Link
          to="/profile"
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Profile
        </Link>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
