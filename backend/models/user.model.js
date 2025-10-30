import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bio: {
    type: String,
    default: "",
  },
  avatarColor: {
    type: String,
    default: function() {
      const colors = ['blue', 'purple', 'pink', 'indigo', 'teal']
      return colors[Math.floor(Math.random() * colors.length)]
    },
  },
})

const User = mongoose.model("User", userSchema)

export default User
