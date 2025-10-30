import React from "react";

const EmptyCard = ({ imgSrc = "", message = "No content available" }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-16 sm:mt-20 px-4">
      <img
        src={imgSrc}
        alt="No content"
        className="w-40 sm:w-56 md:w-60 lg:w-72 object-contain transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />

      <p className="mt-5 text-center text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-xs sm:max-w-sm md:max-w-md">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
