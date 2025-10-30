import { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const { currentUser } = useSelector((state) => state?.user || {});
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser?.rest);
      getAllNotes();
    }
  }, [currentUser, navigate]);

  // ✅ Fetch all notes
  const getAllNotes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/note/all", {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to fetch notes");
        setAllNotes([]);
        return;
      }

      setAllNotes(res.data.notes);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes");
      setAllNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  // ✅ Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const res = await axios.delete(
        import.meta.env.VITE_API_URL + `/note/delete/${noteId}`,
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Search Notes
  const onSearchNote = async (query) => {
    if (!query.trim()) {
      setIsSearch(false);
      getAllNotes();
      return;
    }

    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/note/search", {
        params: { query },
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setIsSearch(true);
      setAllNotes(res.data.notes);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // ✅ Update Pin
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/note/update-note-pinned/${noteId}`,
        { isPinned: !noteData.isPinned },
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* ✅ Navbar */}
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      {/* ✅ Notes Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {allNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdAt}
                content={note.content}
                image={note.image}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={
              isSearch
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtakcQoMFXwFwnlochk9fQSBkNYkO5rSyY9A&s"
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDCtZLuixBFGTqGKdWGLaSKiO3qyhW782aZA&s"
            }
            message={
              isSearch
                ? "Oops! No Notes found matching your search"
                : "Ready to capture your ideas? Click the 'Add' button to start noting down your thoughts, inspiration and reminders."
            }
          />
        )}
      </div>

      {/* ✅ Floating Add Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-[#2B85FF] hover:bg-blue-600 shadow-lg transition-all"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-white text-3xl sm:text-[32px]" />
      </button>

      {/* ✅ Add/Edit Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: 50 },
        }}
        className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[45%] max-h-[85vh] bg-white rounded-lg mx-auto mt-10 overflow-auto outline-none p-5 sm:p-6"
        contentLabel="Add/Edit Note Modal"
      >
        <AddEditNotes
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
