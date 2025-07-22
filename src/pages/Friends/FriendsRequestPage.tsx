"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { IUser } from "../../../types"
import { checkJwt } from "../../../utils/auth"
import { fetchFriendsRequest } from "../../api"
import LeftSidebar from "../../components/LeftSidebar"
import Notification from "../../components/Notification"
const API_URL = import.meta.env.VITE_API_URL

const FriendsRequestPage = () => {
  const [listRelationships, setListRelationships] = useState<any | null>(null)
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await fetchFriendsRequest()
      setListRelationships({
        response,
      })
    }

    async function fetchCurrentUser() {
      const response: IUser | null = await checkJwt()
      setCurrentUser(response)
    }

    fetchCurrentUser()
    if (!listRelationships) {
      fetchData()
    }
  }, [listRelationships])

  const handleAcceptRequest = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/relationships/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )

      if (response.status === 200) {
        setNotification({ message: "Friend request accepted!", type: "success" })
        // Refresh the data
        const updatedData = await fetchFriendsRequest()
        setListRelationships({ response: updatedData })
      }
    } catch (error) {
      setNotification({ message: "Failed to accept friend request", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeclineRequest = async (id: string) => {
    if (!confirm("Are you sure you want to decline this friend request?")) return

    setIsLoading(true)
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/relationships/decline/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )

      if (response.status === 200) {
        setNotification({ message: "Friend request declined", type: "success" })
        // Refresh the data
        const updatedData = await fetchFriendsRequest()
        setListRelationships({ response: updatedData })
      }
    } catch (error) {
      setNotification({ message: "Failed to decline friend request", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const showFriendRequests = () => {
    if (!listRelationships?.response) return null

    const pendingRequests = listRelationships.response.filter(
      (relationship: any) =>
        relationship.friend.id === currentUser?.id && relationship.status === "pending" && !relationship.isFriend,
    )

    return pendingRequests.map((relationship: any) => (
      <div key={relationship.id} className="facebook-card p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Link to={`/profile/${relationship.user.id}`}>
              <img
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                src={relationship.user.avatar || "/placeholder.svg?height=64&width=64"}
                alt={`${relationship.user.first_name} ${relationship.user.last_name}`}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/profile/${relationship.user.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-base truncate">
                  {relationship.user.first_name} {relationship.user.last_name}
                </h3>
              </Link>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Wants to be your friend</p>
              <div className="flex items-center text-xs text-gray-400">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{new Date(relationship.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 justify-end sm:justify-start">
            <button
              onClick={() => handleAcceptRequest(relationship.user.id)}
              disabled={isLoading}
              className="btn-facebook px-4 py-2 text-sm disabled:opacity-50 flex-1 sm:flex-none"
            >
              {isLoading ? "..." : "Accept"}
            </button>
            <button
              onClick={() => handleDeclineRequest(relationship.user.id)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 flex-1 sm:flex-none"
            >
              {isLoading ? "..." : "Decline"}
            </button>
          </div>
        </div>
      </div>
    ))
  }

  const getPendingRequestsCount = () => {
    if (!listRelationships?.response) return 0
    return listRelationships.response.filter(
      (r: any) => r.friend.id === currentUser?.id && r.status === "pending" && !r.isFriend,
    ).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <LeftSidebar />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Friend Requests</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your incoming friend requests</p>
            </div>

            {/* Navigation Tabs - Mobile Optimized */}
            <div className="facebook-card mb-6">
              <div className="p-2">
                <div className="flex overflow-x-auto scrollbar-hide space-x-1">
                  <Link to="/friends" className="flex-shrink-0">
                    <button className="px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap text-gray-600 hover:bg-gray-100">
                      All Friends
                    </button>
                  </Link>
                  <Link to="/friends/search" className="flex-shrink-0">
                    <button className="px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap text-gray-600 hover:bg-gray-100">
                      Find Friends
                    </button>
                  </Link>
                  <Link to="/friends/friends-request" className="flex-shrink-0">
                    <button className="px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap bg-blue-600 text-white">
                      Friend Requests
                      {getPendingRequestsCount() > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {getPendingRequestsCount()}
                        </span>
                      )}
                    </button>
                  </Link>
                  <Link to="/friends/friends-sent" className="flex-shrink-0">
                    <button className="px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap text-gray-600 hover:bg-gray-100">
                      Sent Requests
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Friend Requests List */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Pending Requests</h2>
                <span className="text-sm text-gray-500">{getPendingRequestsCount()} pending requests</span>
              </div>

              <div className="space-y-4">{showFriendRequests()}</div>

              {getPendingRequestsCount() === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No friend requests</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
                    You don't have any pending friend requests at the moment
                  </p>
                  <Link to="/friends/search">
                    <button className="btn-facebook">Find Friends</button>
                  </Link>
                </div>
              )}
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

export default FriendsRequestPage
