"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { IUser } from "../../../types"
import { checkJwt } from "../../../utils/auth"
import { fetchFriendsRequest } from "../../api"
import LeftSidebar from "../../components/LeftSidebar"
const API_URL = import.meta.env.VITE_API_URL

const FriendsPage = () => {
  const [listRelationships, setListRelationships] = useState<any | null>(null)
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [view, setView] = useState("listFriends")

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

  const handleUnfriend = async (id: number) => {
    if (confirm("Are you sure you want to unfriend this person?")) {
      await axios
        .get(`${API_URL}/api/v1/relationships/unfriend/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            alert("Unfriended successfully")
            window.location.reload()
          }
        })
    }
  }

  const showlistFriends = () => {
    if (listRelationships) {
      return listRelationships.response.map((relationship: any) => {
        if (
          relationship.user.id != currentUser?.id ||
          relationship.isFriend == false ||
          relationship.status != "confirmed"
        ) {
          return
        } else
          return (
            <div key={relationship.id} className="facebook-card p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Link to={`/profile/${relationship.friend.id}`}>
                    <img
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                      src={relationship.friend.avatar || "/placeholder.svg?height=64&width=64"}
                      alt={`${relationship.friend.first_name} ${relationship.friend.last_name}`}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/profile/${relationship.friend.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-base truncate">
                        {relationship.friend.first_name} {relationship.friend.last_name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-500">Friend</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 justify-end sm:justify-start">
                  <Link to={`/messager?user=${relationship.friend.id}`}>
                    <button className="btn-facebook-secondary px-3 py-2 text-xs sm:text-sm flex-1 sm:flex-none">
                      Message
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 flex-1 sm:flex-none"
                    onClick={() => handleUnfriend(relationship.friend.id)}
                  >
                    Unfriend
                  </button>
                </div>
              </div>
            </div>
          )
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <LeftSidebar />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Friends</h1>
              <p className="text-sm sm:text-base text-gray-600">Connect with your pet-loving community</p>
            </div>

            {/* Navigation Tabs - Mobile Optimized */}
            <div className="facebook-card mb-6">
              <div className="p-2">
                <div className="flex overflow-x-auto scrollbar-hide space-x-1">
                  <Link to="/friends" className="flex-shrink-0">
                    <button
                      className={`px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap ${
                        view == "listFriends" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setView("listFriends")}
                    >
                      All Friends
                    </button>
                  </Link>
                  <Link to="/friends/search" className="flex-shrink-0">
                    <button
                      className={`px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap ${
                        view == "searchFriends" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setView("searchFriends")}
                    >
                      Find Friends
                    </button>
                  </Link>
                  <Link to="/friends/friends-request" className="flex-shrink-0">
                    <button
                      className={`px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap ${
                        view == "friendsRequest" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setView("friendsRequest")}
                    >
                      Friend Requests
                    </button>
                  </Link>
                  <Link to="/friends/friends-sent" className="flex-shrink-0">
                    <button
                      className={`px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap ${
                        view == "friendsSent" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setView("friendsSent")}
                    >
                      Sent Requests
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Friends List */}
            {view == "listFriends" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Friends</h2>
                  <span className="text-sm text-gray-500">
                    {listRelationships?.response?.filter(
                      (r: any) => r.user.id == currentUser?.id && r.isFriend && r.status == "confirmed",
                    ).length || 0}{" "}
                    friends
                  </span>
                </div>
                <div className="space-y-4">{showlistFriends()}</div>
                {(!listRelationships?.response ||
                  listRelationships.response.filter(
                    (r: any) => r.user.id == currentUser?.id && r.isFriend && r.status == "confirmed",
                  ).length === 0) && (
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
                      Start connecting with other pet lovers!
                    </p>
                    <Link to="/friends/search">
                      <button className="btn-facebook">Find Friends</button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendsPage
