"use client"

import type React from "react"

import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LeftSidebar from "../../components/LeftSidebar"
import { checkJwt } from "../../../utils/auth"
import type { IUser, IGroup } from "../../../types"
import { fetchMyGroups } from "../../api"
import Notification from "../../components/Notification"
const API_URL = import.meta.env.VITE_API_URL

const CreatePostPage = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [myGroups, setMyGroups] = useState<IGroup[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [tags, setTags] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await checkJwt()
        setCurrentUser(user)

        const groups = await fetchMyGroups()
        setMyGroups(groups.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedMedia(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      setNotification({ message: "Please fill in all required fields", type: "error" })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)

      if (selectedMedia) {
        formData.append("media", selectedMedia)
      }

      if (selectedGroup) {
        formData.append("group_id", selectedGroup)
      }

      if (tags.trim()) {
        // Split tags by comma and clean them
        const tagArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
        formData.append("tags", JSON.stringify(tagArray))
      }

      const response = await axios.post(`${API_URL}/api/v1/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      if (response.status === 201) {
        setNotification({ message: "Post created successfully!", type: "success" })
        setTimeout(() => {
          navigate("/")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Error creating post:", error)
      setNotification({
        message: error.response?.data?.message || "Failed to create post",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeMedia = () => {
    setSelectedMedia(null)
    setMediaPreview(null)
    // Reset file input
    const fileInput = document.getElementById("media") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <LeftSidebar />
        <div className="flex-1">
          <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Post</h1>
              <p className="text-gray-600">Share your thoughts with the pet community</p>
            </div>

            {/* Create Post Form */}
            <div className="facebook-card p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={currentUser?.avatar || "/placeholder.svg?height=48&width=48"}
                    alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {currentUser?.first_name} {currentUser?.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">Creating a new post</p>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="facebook-input"
                    placeholder="What's your post about?"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="facebook-input resize-none"
                    placeholder="Share your thoughts, experiences, or ask questions..."
                    required
                  />
                </div>

                {/* Group Selection */}
                {myGroups.length > 0 && (
                  <div>
                    <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-2">
                      Post to Group (Optional)
                    </label>
                    <select
                      id="group"
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="facebook-input"
                    >
                      <option value="">Post to your timeline</option>
                      {myGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="facebook-input"
                    placeholder="dog, training, tips (separate with commas)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Add tags to help others discover your post</p>
                </div>

                {/* Media Upload */}
                <div>
                  <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
                    Add Photo or Video (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    {mediaPreview ? (
                      <div className="relative">
                        {selectedMedia?.type.startsWith("image/") ? (
                          <img
                            src={mediaPreview || "/placeholder.svg"}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-lg"
                          />
                        ) : (
                          <video src={mediaPreview} controls className="max-h-64 mx-auto rounded-lg" />
                        )}
                        <button
                          type="button"
                          onClick={removeMedia}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF, MP4 up to 10MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="media"
                      onChange={handleMediaChange}
                      accept="image/*,video/*"
                      className="hidden"
                    />
                    {!mediaPreview && (
                      <label
                        htmlFor="media"
                        className="cursor-pointer inline-block mt-2 btn-facebook-secondary px-4 py-2"
                      >
                        Choose File
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !title.trim() || !description.trim()}
                    className="btn-facebook px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating..." : "Create Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
    </div>
  )
}

export default CreatePostPage
