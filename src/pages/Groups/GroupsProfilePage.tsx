"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import type { IGroup, IPost, IUser } from "../../../types"
import { checkJwt } from "../../../utils/auth"
import { fetchGroupsById, fetchPostsByGroupId } from "../../api"
import LeftSidebar from "../../components/LeftSidebar"
import Post from "../../components/Post"
const API_URL = import.meta.env.VITE_API_URL

const GroupsProfilePage = () => {
  const [listPost, setListPost] = useState<any | null>(null)
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPopupCreatePostOpen, setIsPopupCreatePostOpen] = useState(false)
  const [group, setGroup] = useState<IGroup | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const accessToken = localStorage.getItem("access_token")
  if (!accessToken) {
    window.location.href = "/sign-in"
  }

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    tagNames: [] as string[],
    media: null as File | null,
    group_id: "" as string,
  })
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)

  const { id } = useParams<{ id: string }>()
  const groupsId = id

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: IUser | null = await checkJwt()
      setCurrentUser(response)
    }
    fetchCurrentUser()

    const fetchData = async () => {
      const response: IPost = await fetchPostsByGroupId(groupsId || "")
      setListPost({
        response,
      })
    }

    const fetchGroup = async () => {
      const response: any = await fetchGroupsById(groupsId || "")
      setGroup(response)
    }

    if (!listPost) {
      fetchData()
    }
    if (!group) {
      fetchGroup()
    }
  }, [listPost, group, groupsId])

  const handleAddTag = () => {
    const tag = document.getElementById("tags") as HTMLInputElement
    if (tag.value) {
      if (postData.tagNames.includes(tag.value)) {
        alert("Tag already exists")
        return
      }
      setPostData({ ...postData, tagNames: [...postData.tagNames, tag.value] })
      tag.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!postData.title.trim() && !postData.description.trim()) {
      alert("Please add some content to your post")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("title", postData.title)
    formData.append("description", postData.description)
    formData.append("group_id", group?.id || "")
    if (selectedMedia) {
      formData.append("media", selectedMedia)
    }
    postData.tagNames.forEach((tag, index) => {
      formData.append(`tagNames[${index}]`, tag)
    })

    try {
      await axios.post(`${API_URL}/api/v1/posts`, formData, {
        headers: {
          "Content-Type": "form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      alert("Post created successfully")
      setIsPopupCreatePostOpen(false)
      setPostData({ title: "", description: "", tagNames: [], media: null, group_id: "" })
      setSelectedMedia(null)
      window.location.reload()
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Failed to create post")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinGroup = async () => {
    try {
      await axios.post(
        `${API_URL}/api/v1/groups/${group?.id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      alert("Joined group successfully")
      window.location.reload()
    } catch (error) {
      console.error("Error joining group:", error)
      alert("Failed to join group")
    }
  }

  const handleLeaveGroup = async () => {
    if (confirm("Are you sure you want to leave this group?")) {
      try {
        await axios.post(
          `${API_URL}/api/v1/groups/${group?.id}/leave`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        alert("Left group successfully")
        window.location.href = "/groups"
      } catch (error) {
        console.error("Error leaving group:", error)
        alert("Failed to leave group")
      }
    }
  }

  const showGroupMembers = () => {
    return (
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          />
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
            <div className="bg-white px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Group Members</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {group?.users?.map((user) => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.id}`}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={user.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={`${user.first_name} ${user.last_name}`}
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <button onClick={() => setIsModalOpen(false)} className="btn-facebook-secondary w-full">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const showPopupCreatePost = () => {
    return (
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
            aria-hidden="true"
            onClick={() => setIsPopupCreatePostOpen(false)}
          />
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Post in {group?.name}</h3>
                <button
                  onClick={() => setIsPopupCreatePostOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    className="facebook-input"
                    type="text"
                    placeholder="What's your post about?"
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    className="facebook-input h-32 resize-none"
                    placeholder="Share your thoughts with the group..."
                    value={postData.description}
                    onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex space-x-2">
                    <input id="tags" className="facebook-input flex-1" type="text" placeholder="Add a tag" />
                    <button type="button" onClick={handleAddTag} className="btn-facebook-secondary px-4 py-2 text-sm">
                      Add
                    </button>
                  </div>
                  {postData.tagNames.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {postData.tagNames.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => {
                              setPostData({
                                ...postData,
                                tagNames: postData.tagNames.filter((t) => t !== tag),
                              })
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
                  <input
                    className="facebook-input"
                    type="file"
                    accept=".jpg,.png,.jpeg,.mp4,.avi,.mkv,video/*"
                    onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
                  />
                </div>
              </form>
            </div>

            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="btn-facebook w-full sm:w-auto sm:ml-3 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Create Post"}
              </button>
              <button
                type="button"
                className="btn-facebook-secondary w-full sm:w-auto mt-3 sm:mt-0"
                onClick={() => setIsPopupCreatePostOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isMember = group?.users?.find((user) => user.id == currentUser?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <LeftSidebar />
        <div className="flex-1 ">
          <div className="max-w-4xl mx-auto">
            {/* Group Cover & Info */}
            <div className="facebook-card mb-6 overflow-hidden">
              {/* Cover Photo */}
              <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                {group?.avatar && group.avatar !== "null" ? (
                  <img
                    src={group.avatar || "/placeholder.svg"}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-white opacity-80"
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

              {/* Group Info */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{group?.name}</h1>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>{group?.users?.length || 0} members</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isMember ? (
                      <>
                        <button
                          className="btn-facebook flex items-center space-x-2"
                          onClick={() => setIsPopupCreatePostOpen(true)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <span>Create Post</span>
                        </button>
                        <Link to={`/messager?group=${group?.id}`}>
                          <button className="btn-facebook-secondary px-4 py-2">Chat</button>
                        </Link>
                        <button
                          onClick={handleLeaveGroup}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Leave Group
                        </button>
                      </>
                    ) : (
                      <button onClick={handleJoinGroup} className="btn-facebook px-6 py-2">
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="space-y-4">
              {listPost?.response?.length > 0 ? (
                listPost.response.map((post: any) => <Post key={post.id} {...post} />)
              ) : (
                <div className="facebook-card p-12 text-center">
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
                  <p className="text-gray-500 mb-4">Be the first to share something with this group!</p>
                  {isMember && (
                    <button className="btn-facebook" onClick={() => setIsPopupCreatePostOpen(true)}>
                      Create First Post
                    </button>
                  )}
                </div>
              )}
            </div>

            {isModalOpen && showGroupMembers()}
            {isPopupCreatePostOpen && showPopupCreatePost()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupsProfilePage
