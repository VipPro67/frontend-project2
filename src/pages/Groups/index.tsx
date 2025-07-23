"use client"

import { useEffect, useState } from "react"
import LeftSidebar from "../../components/LeftSidebar"
import { fetchGroupsSearch } from "../../api"
import axios from "axios"
import { Link } from "react-router-dom"
import type { IGroup, IUser } from "../../../types"
import { checkJwt } from "../../../utils/auth"
const API_URL = import.meta.env.VITE_API_URL

type IResponse = {
  data: IGroup[]
  total: number
  currentPage: number
  items_per_page: number
  totalPage: number
  nextPage: number | null
  prePage: number | null
}

const GroupsPage = () => {
  const [searchResult, setSearchResult] = useState<IGroup[] | null>(null)
  const [view, setView] = useState("searchGroups")
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
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
      const response: IResponse = await fetchGroupsSearch(search.value)
      setSearchResult(response.data)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinGroup = async (id: string) => {
    try {
      await axios
        .post(
          `${API_URL}/api/v1/groups/${id}/join`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        )
        .then((res) => {
          if (res.status == 201) {
            alert("Joined group successfully")
            window.location.href = `/groups/${id}`
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  const showListSearch = () => {
    if (searchResult) {
      return searchResult.map((group: IGroup) => {
        const isMember = group?.users?.find((g) => g.id == currentUser?.id)

        return (
          <div key={group.id} className="facebook-card p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start space-x-4">
              <Link to={`/groups/${group.id}`}>
                <img
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  src={
                    group.avatar && group.avatar != "null"
                      ? group.avatar
                      : "/placeholder.svg?height=64&width=64&query=group"
                  }
                  alt={group.name}
                />
              </Link>
              <div className="flex-1">
                <Link to={`/groups/${group.id}`}>
                  <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors mb-1">
                    {group.name}
                  </h3>
                </Link>
                <div className="flex items-center text-sm text-gray-500 mb-3">
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
                <div className="flex items-center space-x-3">
                  {isMember ? (
                    <div className="flex items-center space-x-2">
                      <Link to={`/groups/${group.id}`}>
                        <button className="btn-facebook px-4 py-2 text-sm">View Group</button>
                      </Link>
                      <span className="text-sm text-green-600 font-medium">✓ Member</span>
                    </div>
                  ) : (
                    <button className="btn-facebook px-4 py-2 text-sm" onClick={() => handleJoinGroup(group.id)}>
                      Join Group
                    </button>
                  )}
                </div>
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
        <div className="flex-1 ">
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Groups</h1>
              <p className="text-gray-600">Join communities of pet lovers and share experiences</p>
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
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${view == "searchGroups" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    onClick={() => setView("searchGroups")}
                  >
                    Discover Groups
                  </button>
                </Link>
              </div>
            </div>

            {view == "searchGroups" && (
              <div>
                {/* Search Section */}
                <div className="facebook-card p-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          id="search"
                          type="search"
                          className="facebook-input pl-12 pr-4 py-3 text-lg"
                          placeholder="Search for pet groups..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearch()
                            }
                          }}
                        />
                        <svg
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                      className="btn-facebook px-8 py-3 disabled:opacity-50"
                    >
                      {isLoading ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                <div>
                  {searchResult && searchResult.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                      <p className="text-gray-500">{searchResult.length} groups found</p>
                    </div>
                  )}

                  <div className="space-y-4">{showListSearch()}</div>

                  {searchResult && searchResult.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
                      <p className="text-gray-500">Try searching with different keywords</p>
                    </div>
                  )}

                  {!searchResult && (
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Find Your Pet Community</h3>
                      <p className="text-gray-500">Search for groups based on pet types, breeds, or interests</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupsPage
