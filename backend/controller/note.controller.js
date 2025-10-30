import Note from "../models/note.model.js"
import { errorHandler } from "../utils/error.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"

//addNote
export const addNote = async (req, res, next) => {
  try {
    // When using FormData, fields might be strings
    const title = req.body.title?.toString().trim()
    const content = req.body.content?.toString().trim()
    const { id } = req.user

    if (!title) {
      return next(errorHandler(400, "Title is required"))
    }

    if (!content) {
      return next(errorHandler(400, "Content is required"))
    }

    let imageUrl = ""
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file)
      } catch (uploadError) {
        return next(errorHandler(500, "Failed to upload image. Please try again."))
      }
    }

    const note = new Note({
      title,
      content,
      userId: id,
      image: imageUrl,
    })

    try {
      await note.save()
      res.status(201).json({
        success: true,
        message: "Note added successfully",
        note,
      })
    } catch (saveError) {
      if (imageUrl) {
        // TODO: Add cleanup of uploaded image if note save fails
      }
      return next(errorHandler(500, "Failed to save note. Please try again."))
    }
  } catch (error) {
    console.error('Add note error:', error)
    next(errorHandler(500, "An unexpected error occurred. Please try again."))
  }
}

//editNote
export const editNote = async (req, res, next) => {
  const note = await Note.findById(req.params.noteId)

  if (!note) {
    return next(errorHandler(404, "Note not found"))
  }

  if (req.user.id !== note.userId) {
    return next(errorHandler(401, "You can only update your own note!"))
  }

  const { title, content, isPinned } = req.body

  if (!title && !content) {
    return next(errorHandler(404, "No changes provided"))
  }

  try {
    if (title) {
      note.title = title
    }

    if (content) {
      note.content = content
    }

    if (req.file) {
      note.image = await uploadToCloudinary(req.file)
    }

    if (isPinned !== undefined) {
      note.isPinned = isPinned
    }

    await note.save()

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    next(error)
  }
}

//getAllNotes
export const getAllNotes = async (req, res, next) => {
  const userId = req.user.id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const sortBy = req.query.sortBy || 'createdAt'
  const order = req.query.order || 'desc'

  try {
    const totalNotes = await Note.countDocuments({ userId })
    
    // Always sort by isPinned first, then by the requested field
    const sortOptions = { isPinned: -1 }
    sortOptions[sortBy] = order === 'desc' ? -1 : 1

    const notes = await Note.find({ userId })
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)

    res.status(200).json({
      success: true,
      message: "All notes retrieved successfully",
      notes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalNotes / limit),
        totalNotes,
        hasMore: page * limit < totalNotes
      }
    })
  } catch (error) {
    next(error)
  }
}

//getNoteStats
export const getNoteStats = async (req, res, next) => {
  const userId = req.user.id

  try {
    const totalNotes = await Note.countDocuments({ userId })
    const pinnedNotes = await Note.countDocuments({ userId, isPinned: true })
    const recentNotes = await Note.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })

    // Get tag statistics
    const notes = await Note.find({ userId }, 'tags')
    const tagStats = notes.reduce((acc, note) => {
      note.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {})

    res.status(200).json({
      success: true,
      message: "Note statistics retrieved successfully",
      stats: {
        totalNotes,
        pinnedNotes,
        recentNotes,
        tagStats: Object.entries(tagStats)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) // Top 5 tags
      }
    })
  } catch (error) {
    next(error)
  }
}

//deleteNote
export const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId

  const note = await Note.findOne({ _id: noteId, userId: req.user.id })

  if (!note) {
    return next(errorHandler(404, "Note not found"))
  }

  try {
    await Note.deleteOne({ _id: noteId, userId: req.user.id })

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

//updateNotePinned
export const updateNotePinned = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId)

    if (!note) {
      return next(errorHandler(404, "Note not found!"))
    }

    if (req.user.id !== note.userId) {
      return next(errorHandler(401, "You can only update your own note!"))
    }

    const { isPinned } = req.body

    note.isPinned = isPinned

    await note.save()

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    next(error)
  }
}


//SearchNote
export const searchNote = async (req, res, next) => {
  const { query } = req.query;

  try {
    // if query is empty → return all notes
    if (!query) {
      const allNotes = await Note.find({ userId: req.user.id });
      return res.status(200).json({
        success: true,
        message: "All notes fetched successfully",
        notes: allNotes,
      });
    }

    const matchingNotes = await Note.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    next(error);
  }
};
