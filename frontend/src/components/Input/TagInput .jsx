import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    const newTag = inputValue.trim();
    if (newTag !== "" && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      {/* Tag List */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-800 bg-gray-100 px-2 sm:px-3 py-1 rounded-full"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <MdClose className="text-base sm:text-lg" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Section */}
      <div className="flex items-center gap-2 sm:gap-3 mt-3 w-full">
        <input
          type="text"
          value={inputValue}
          placeholder="Add tags..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm sm:text-base bg-transparent border border-gray-300 focus:border-blue-500 px-3 py-2 sm:py-2.5 rounded-md outline-none transition-all"
        />
        <button
          type="button"
          onClick={addNewTag}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
        >
          <MdAdd className="text-xl sm:text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
