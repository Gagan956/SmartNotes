import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import moment from "moment";
import React from "react";

const NoteCard = ({
  title = "",
  date = "",
  content = "",
  image = "",
  isPinned = false,
  onPinNote,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded-xl p-5 bg-white hover:shadow-xl transition-all ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
            {title[0]?.toUpperCase()}
          </div>
          <div>
            <h6 className="text-base font-semibold text-gray-800">{title}</h6>
            <span className="text-xs text-gray-500">
              {moment(date).format("MMM Do, YYYY · h:mm a")}
            </span>
          </div>
        </div>

        <MdOutlinePushPin
          className={`text-xl cursor-pointer transition-colors ${
            isPinned ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={onPinNote}
        />
      </div>

      {/* Content */}
      <div className="py-3 space-y-3">
        <p className="text-gray-700 leading-relaxed">
          {content?.slice(0, 120)}
          {content?.length > 120 ? "..." : ""}
        </p>

        {image && (
          <div className="relative pt-[56.25%]">
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end pt-2 border-t">
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
            aria-label="Edit note"
          >
            <MdCreate className="text-xl" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
            aria-label="Delete note"
          >
            <MdDelete className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
