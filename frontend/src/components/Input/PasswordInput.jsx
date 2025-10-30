import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center bg-transparent border border-gray-300 focus-within:border-blue-500 px-4 sm:px-5 rounded-md mb-3 transition-all">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full text-sm sm:text-base bg-transparent py-2.5 sm:py-3 pr-2 outline-none rounded placeholder:text-gray-400"
      />

      <button
        type="button"
        onClick={togglePassword}
        className="text-gray-400 hover:text-blue-500 transition-colors flex items-center justify-center p-1.5 sm:p-2"
      >
        {showPassword ? (
          <FaRegEye size={20} className="text-blue-500" />
        ) : (
          <FaRegEyeSlash size={20} />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
