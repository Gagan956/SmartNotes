import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(noteData?.image || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;

    try {
      let data;
      let config = { withCredentials: true };

      if (image) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("image", image);

        data = formData;
        config.headers = { "Content-Type": "multipart/form-data" };
      } else {
        data = { title, content };
        config.headers = { "Content-Type": "application/json" };
      }

      const res = await axios.post(
       `https://smartnotes-2aes.onrender.com/api/note/edit/${noteId}`,
        data,
        config
      );

      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const addNewNote = async () => {
    try {
      let data;
      let config = { withCredentials: true };

      if (image) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("image", image);

        data = formData;
        config.headers = { "Content-Type": "multipart/form-data" };
      } else {
        data = { title, content };
        config.headers = { "Content-Type": "application/json" };
      }

      const res = await axios.post(
        "https://smartnotes-2aes.onrender.com/api/note/add",
        data,
        config
      );

      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success("Posted");
      getAllNotes();
      onClose();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleAddNote = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!content.trim()) {
      setError("Please enter some content");
      return;
    }

    setError("");

    const loadingToast = toast.loading(
      type === "edit" ? "Updating..." : "Posting..."
    );

    try {
      if (type === "edit") {
        await editNote();
      } else {
        await addNewNote();
      }
    } catch (error) {
      setError(error.message);
      toast.error("Failed to save note");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="text-2xl text-gray-800 outline-none font-medium placeholder-gray-400"
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="text-lg text-gray-700 outline-none min-h-[120px] placeholder-gray-400 resize-none"
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full rounded-lg max-h-[300px] object-cover"
            />
            <button
              onClick={() => {
                setImagePreview("");
                setImage(null);
              }}
              className="absolute top-2 right-2 p-1 bg-gray-800/50 rounded-full text-white hover:bg-gray-800/70"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 border-t border-b py-3">
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Add Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "POST"}
      </button>
    </div>
  );
};

export default AddEditNotes;
