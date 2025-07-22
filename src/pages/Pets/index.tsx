"use client"

import { useEffect, useState } from "react"
import { fetchPetsSearch } from "../../api"
import LeftSidebar from "../../components/LeftSidebar"
import type { IPet } from "../../../types"
import { Link } from "react-router-dom"

type IResponse = {
  data: IPet[]
  total: number
  currentPage: number
  items_per_page: number
  totalPage: number
  nextPage: number | null
  prePage: number | null
}

const PetsPage = () => {
  const [listFindPets, setListFindPets] = useState<any | null>(null)
  const [view, setView] = useState("searchPets")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchCurrentUser() { }
    fetchCurrentUser()
  }, [])

  const handleSearch = async () => {
    const search = document.getElementById("search") as HTMLInputElement
    if (!search.value.trim()) return

    setIsLoading(true)
    try {
      const res: IResponse = await fetchPetsSearch(search.value)
      setListFindPets(res.data)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const showFindResults = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listFindPets?.map((pet: IPet) => (
          <div key={pet.id} className="facebook-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square overflow-hidden">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                src={pet.avatar || "/placeholder.svg?height=300&width=300&query=cute pet"}
                alt={pet.name}
              />
            </div>
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{pet.name}</h3>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>{pet.species}</span>
                  <span>•</span>
                  <span>{pet.sex}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Breed:</span>
                  <span>{pet.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Born:</span>
                  <span>{new Date(pet.date_of_birth).toLocaleDateString()}</span>
                </div>
              </div>

              {pet.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pet.description}</p>}

              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/profile/${pet.owner.id}`}
                      className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                    >
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={pet.owner.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={`${pet.owner.first_name} ${pet.owner.last_name}`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {pet.owner.first_name} {pet.owner.last_name}
                      </span>
                    </Link>
                  </div>
                  <Link to={`/messager?user=${pet.owner.id}`}>
                    <button className="btn-facebook-secondary px-3 py-1 text-xs">Contact</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <LeftSidebar />
        <div className="flex-1 ">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Pets</h1>
              <p className="text-gray-600">Find adorable pets and connect with their owners</p>
            </div>

            {/* Navigation Tabs */}
            <div className="facebook-card p-1 mb-6">
              <div className="flex space-x-1">
                <Link to="/pets/my-pets">
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${view == "myPets" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    onClick={() => setView("myPets")}
                  >
                    My Pets
                  </button>
                </Link>
                <Link to="/pets">
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${view == "searchPets" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    onClick={() => setView("searchPets")}
                  >
                    Discover Pets
                  </button>
                </Link>
              </div>
            </div>

            {view == "searchPets" && (
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
                          placeholder="Search by name, species, breed, or description..."
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

                {/* Results */}
                <div>
                  {listFindPets && listFindPets.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                      <p className="text-gray-500">{listFindPets.length} pets found</p>
                    </div>
                  )}

                  {showFindResults()}

                  {listFindPets && listFindPets.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
                      <p className="text-gray-500">Try searching with different keywords</p>
                    </div>
                  )}

                  {!listFindPets && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Discover Amazing Pets</h3>
                      <p className="text-gray-500">Search for pets by name, breed, or species to find your favorites</p>
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

export default PetsPage
