import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { upload } from "../utils/uploadHandler.js"
import {
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  getNoteStats,
  searchNote,
  updateNotePinned,
} from "../controller/note.controller.js"

const router = express.Router()

router.post("/add", verifyToken, upload.single("image"), addNote)
router.post("/edit/:noteId", verifyToken, editNote)
router.get("/all", verifyToken, getAllNotes)
router.get("/stats", verifyToken, getNoteStats)
router.delete("/delete/:noteId", verifyToken, deleteNote)
router.put("/update-note-pinned/:noteId", verifyToken, updateNotePinned)
router.get("/search", verifyToken, searchNote)

export default router
