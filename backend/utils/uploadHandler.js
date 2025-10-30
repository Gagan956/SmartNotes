import multer from "multer"

import path from 'path'
import os from 'os'

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir()) 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  // Check file type
  const filetypes = /jpeg|jpg|png|gif/
  const mimetype = filetypes.test(file.mimetype)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  if (mimetype && extname) {
    cb(null, true)
  } else {
    cb(new Error("Only images (jpeg, jpg, png, gif) are allowed!"), false)
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})