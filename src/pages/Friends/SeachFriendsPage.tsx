"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { IUser } from "../../../types"
import { checkJwt } from "../../../utils/auth"
import { fetchFriendsSearch } from "../../api"
import LeftSidebar from "../../components/LeftSidebar"
const API_URL = import.meta.env.VITE_API_URL

const SearchFriendsPage = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [view, setView] = useState("searchFriends")
  const [searchResult, setSearchResult] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: IUser | null = await checkJwt()
      setCurrentUser(response)
    }
    fetchCurrentUser()
  }, [])

  const handleSearch = async () => {
    const search = document.getElementById("search") as HTMLInputElement
    if (!search.value.trim()) return

    setIsLoading(true)
    try {
      const response: any = await fetchFriendsSearch(search.value)
      setSearchResult(response.data)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFriend = async (id: number) => {
    try {
      await axios
        .get(`${API_URL}/api/v1/relationships/add-friend/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            setSearchResult(searchResult.filter((item: any) => item.id !== id))
            alert("Friend request sent successfully")
          }
        })
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send friend request")
    }
  }

  const showListSearch = () => {
    if (searchResult) {
      return searchResult.map((user: any) => {
        if (user.id == currentUser?.id) {
          return null
        }
        return (
          <div key={user.id} className="facebook-card p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Link to={`/profile/${user.id}`}>
                  <img
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                    src={user.avatar || "/placeholder.svg?height=64&width=64"}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/profile/${user.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-base truncate">
                      {user.first_name} {user.last_name}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-500">Pet lover</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn-facebook px-4 py-2 text-sm w-full sm:w-auto"
                  onClick={() => handleAddFriend(user.id)}
                >
                  Add Friend
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Find Friends</h1>
              <p className="text-sm sm:text-base text-gray-600">Discover and connect with other pet enthusiasts</p>
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
                    >
                      All Friends
                    </button>
                  </Link>
                  <Link to="/friends/search" className="flex-shrink-0">
                    <button
                      className={`px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap ${
                        view == "searchFriends" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Find Friends
                    </button>
                  </Link>
                  <Link to="/friends/friends-request" className="flex-shrink-0">
                    <button
                      className={`px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap ${
                        view == "friendsRequest" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Friend Requests
                    </button>
                  </Link>
                  <Link to="/friends/friends-sent" className="flex-shrink-0">
                    <button
                      className={`px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap ${
                        view == "friendsSent" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Sent Requests
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="facebook-card p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      id="search"
                      type="search"
                      className="facebook-input pl-10 pr-4 py-3 text-base w-full"
                      placeholder="Search by name..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch()
                        }
                      }}
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="btn-facebook px-6 py-3 disabled:opacity-50 w-full sm:w-auto"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div>
              {searchResult && searchResult.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Search Results</h2>
                  <p className="text-sm sm:text-base text-gray-500">{searchResult.length} people found</p>
                </div>
              )}

              <div className="space-y-4">{showListSearch()}</div>

              {searchResult && searchResult.length === 0 && (
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-sm sm:text-base text-gray-500 px-4">Try searching with different keywords</p>
                </div>
              )}

              {!searchResult && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Find Your Pet Community</h3>
                  <p className="text-sm sm:text-base text-gray-500 px-4">
                    Search for friends who share your love for pets
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFriendsPage
