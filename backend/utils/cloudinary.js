import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

import fs from 'fs'

export const uploadToCloudinary = async (file) => {
  try {
    if (!file || !file.path) {
      throw new Error('Invalid file provided')
    }

    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET?.slice(0, 5) + '...' 
    })

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "smartnote",
      resource_type: "auto",
    })

    console.log('Cloudinary upload result:', {
      public_id: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height
    })

    // Clean up the temporary file after successful upload
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err)
    })

    if (!result || !result.secure_url) {
      throw new Error('Failed to get upload URL')
    }

    return result.secure_url
  } catch (error) {
    // Clean up the temporary file in case of error
    if (file && file.path) {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err)
      })
    }

    console.error("Cloudinary upload error:", error)
    throw new Error(error.message || "Image upload failed")
  }
}

export default cloudinary