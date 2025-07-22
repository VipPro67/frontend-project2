"use client"

import { useEffect, useState } from "react"
import LeftSidebar from "../../components/LeftSidebar"
import axios from "axios"
import { Link } from "react-router-dom"
import type { IGroup, IPost } from "../../../types"
import { fetchMyGroups, fetchPostsByUserGroups } from "../../api"
import Post from "../../components/Post"

const API_URL = import.meta.env.VITE_API_URL

const MyGroupsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createGroupName, setCreateGroupName] = useState("")
  const [createGroupDescription, setCreateGroupDescription] = useState("")
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [listGroups, setListGroups] = useState<IGroup[] | null>(null)
  const [listPostsInMyGroups, setListPostsInMyGroups] = useState<IPost[] | null>(null)
  const [view, setView] = useState("listGroups")
  const [isLoading, setIsLoading] = useState(false)

  const accessToken = localStorage.getItem("access_token")
  if (!accessToken) {
    window.location.href = "/sign-in"
  }

  useEffect(() => {
    const fetchMyGroup = async () => {
      try {
        const response = await fetchMyGroups()
        setListGroups(response)
      } catch (error) {
        console.error("Failed to fetch groups:", error)
      }
    }

    const fetchPostsInMyGroups = async () => {
      try {
        const response = await fetchPostsByUserGroups()
        setListPostsInMyGroups(response)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      }
    }

    fetchMyGroup()
    fetchPostsInMyGroups()
  }, [])

  const handlerSubmit = async () => {
    if (!createGroupName.trim()) {
      alert("Please enter group name")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("name", createGroupName)
    formData.append("description", createGroupDescription)
    if (selectedMedia) {
      formData.append("avatar", selectedMedia)
    }

    try {
      await axios.post(`${API_URL}/api/v1/groups`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      setIsCreateModalOpen(false)
      setCreateGroupName("")
      setCreateGroupDescription("")
      setSelectedMedia(null)
      window.location.reload()
    } catch (err) {
      console.error("Error creating group:", err)
      alert("Failed to create group")
    } finally {
      setIsLoading(false)
    }
  }

  const createGroupModal = () => {
    return (
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
            aria-hidden="true"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Group</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full overflow-hidden">
                  {selectedMedia ? (
                    <img
                      src={URL.createObjectURL(selectedMedia) || "/placeholder.svg"}
                      alt="Group preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-center text-lg font-semibold text-gray-900">{createGroupName || "Group Name"}</p>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Name *</label>
                  <input
                    className="facebook-input"
                    type="text"
                    placeholder="Enter group name"
                    value={createGroupName}
                    onChange={(e) => setCreateGroupName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="facebook-input h-24 resize-none"
                    placeholder="What's this group about?"
                    value={createGroupDescription}
                    onChange={(e) => setCreateGroupDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Photo</label>
                  <input
                    className="facebook-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
                  />
                </div>
              </form>
            </div>

            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="btn-facebook w-full sm:w-auto sm:ml-3 disabled:opacity-50"
                onClick={handlerSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Group"}
              </button>
              <button
                type="button"
                className="btn-facebook-secondary w-full sm:w-auto mt-3 sm:mt-0"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const showListMyGroups = () => {
    if (!listGroups || listGroups.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
          <p className="text-gray-500 mb-4">Create your first group to connect with other pet lovers!</p>
          <button className="btn-facebook" onClick={() => setIsCreateModalOpen(true)}>
            Create Your First Group
          </button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listGroups.map((group: IGroup) => (
          <div key={group.id} className="facebook-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 relative">
              {group.avatar && group.avatar !== "null" ? (
                <img src={group.avatar || "/placeholder.svg"} alt={group.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white opacity-80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <Link to={`/groups/${group.id}`}>
                <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors mb-2">
                  {group.name}
                </h3>
              </Link>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{group.users?.length || 0} members</span>
              </div>
              <div className="flex space-x-2">
                <Link to={`/groups/${group.id}`} className="flex-1">
                  <button className="btn-facebook w-full text-sm py-2">View Group</button>
                </Link>
                <Link to={`/messager?group=${group.id}`}>
                  <button className="btn-facebook-secondary px-4 py-2 text-sm">Chat</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const showListPostsInMyGroups = () => {
    if (!listPostsInMyGroups || listPostsInMyGroups.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14-7H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500">Posts from your groups will appear here</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {listPostsInMyGroups.map((post: IPost) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <LeftSidebar />
        <div className="flex-1 ">
          <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Groups</h1>
              <p className="text-gray-600">Manage your pet communities and stay connected</p>
            </div>

            {/* Navigation Tabs */}
            <div className="facebook-card p-1 mb-6">
              <div className="flex space-x-1">
                <Link to="/groups">
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${view == "listGroups" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    onClick={() => setView("listGroups")}
                  >
                    My Groups
                  </button>
                </Link>
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${view == "groupFeed" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  onClick={() => setView("groupFeed")}
                >
                  Group Feed
                </button>
                <Link to="/groups/search">
                  <button className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                    Discover Groups
                  </button>
                </Link>
              </div>
            </div>

            {/* My Groups View */}
            {view == "listGroups" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Groups</h2>
                    <p className="text-gray-500">{listGroups?.length || 0} groups</p>
                  </div>
                  <button
                    className="btn-facebook flex items-center space-x-2"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Create Group</span>
                  </button>
                </div>
                {showListMyGroups()}
              </div>
            )}

            {/* Group Feed View */}
            {view == "groupFeed" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Posts from Your Groups</h2>
                  <p className="text-gray-500">Stay updated with your pet communities</p>
                </div>
                {showListPostsInMyGroups()}
              </div>
            )}

            {isCreateModalOpen && createGroupModal()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyGroupsPage
