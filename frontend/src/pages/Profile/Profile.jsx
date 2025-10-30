import React, { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import axios from "axios"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { signInSuccess } from "../../redux/user/userSlice"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true })
    }
  }, [currentUser, navigate])

  const [userInfo, setUserInfo] = useState(currentUser?.rest || null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePhoto(file)
      handleUpdate(e, file)
    }
  }

  useEffect(() => {
    if (!userInfo) {
      fetchProfile()
    } else {
      setUsername(userInfo.username || "")
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/auth/profile", {
        withCredentials: true,
      })

      if (res.data.success === false) {
        toast.error(res.data.message)
        return
      }

      setUserInfo(res.data.rest)
      setUsername(res.data.rest.username || "")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleUpdate = async (e, photoFile) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      if (username) formData.append("username", username)
      if (password) formData.append("password", password)
      if (photoFile) formData.append("profilePhoto", photoFile)

      const res = await axios.put(
        import.meta.env.VITE_API_URL + "/auth/profile",
        formData,
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      if (res.data.success === false) {
        toast.error(res.data.message)
        setLoading(false)
        return
      }

      toast.success(res.data.message)

      // Update redux with new user data to keep UI in sync
      // Update Redux state
      const updatedUser = { ...currentUser, rest: res.data.rest }
      dispatch(signInSuccess(updatedUser))

      // Update local state
      setUserInfo(res.data.rest)
      setUsername(res.data.rest.username) // Keep form in sync
      setPassword("")
      
      // Show success message
      toast.success("Profile updated successfully!")
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto mt-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-10 text-white">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {userInfo?.profilePhoto ? (
                    <img
                      src={userInfo.profilePhoto}
                      alt={userInfo.username}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold">
                      {userInfo?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePhotoChange}
                    />
                  </label>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{userInfo?.username || ""}</h2>
                  <p className="text-blue-100 mt-1">{userInfo?.email || ""}</p>
                  <p className="text-xs text-blue-100 mt-2">Member since {new Date(userInfo?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Edit Profile</h3>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    value={userInfo?.email || ""}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter new password (optional)"
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating Profile...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
