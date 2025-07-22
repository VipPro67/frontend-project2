"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchMyPets } from "../../api"
import LeftSidebar from "../../components/LeftSidebar"
import Pet from "../../components/Pet"
import type { IPet } from "../../../types"
const API_URL = import.meta.env.VITE_API_URL

const MyPetsPage = () => {
  const [listPets, setListPets] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState("myPets")
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    species: "",
    sex: "Male",
    breed: "",
    description: "",
    avatar: null as File | null,
  })
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await fetchMyPets()
      setListPets({
        response,
      })
    }
    fetchData()
  }, [])

  const handlerSubmit = () => {
    const formDataP = new FormData()
    formDataP.append("name", formData.name)
    formDataP.append("date_of_birth", formData.date_of_birth)
    formDataP.append("species", formData.species)
    formDataP.append("sex", formData.sex)
    formDataP.append("breed", formData.breed)
    formDataP.append("description", formData.description)
    if (selectedMedia) {
      formDataP.append("avatar", selectedMedia)
    }
    axios
      .post(`${API_URL}/api/v1/pets`, formDataP, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        console.log(res)
        setIsModalOpen(false)
        window.location.reload()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const addNewPet = () => {
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
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Pet</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                  <input
                    className="facebook-input"
                    type="text"
                    placeholder="Enter your pet's name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    className="facebook-input"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                    <input
                      className="facebook-input"
                      type="text"
                      placeholder="Dog, Cat, etc."
                      value={formData.species}
                      onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                    <select
                      className="facebook-input"
                      value={formData.sex}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input
                    className="facebook-input"
                    type="text"
                    placeholder="Golden Retriever, Persian, etc."
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="facebook-input h-24 resize-none"
                    placeholder="Tell us about your pet's personality..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Photo</label>
                  <input
                    className="facebook-input"
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
                  />
                </div>
              </form>
            </div>

            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
              <button type="button" className="btn-facebook w-full sm:w-auto sm:ml-3" onClick={handlerSubmit}>
                Add Pet
              </button>
              <button
                type="button"
                className="btn-facebook-secondary w-full sm:w-auto mt-3 sm:mt-0"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Pets</h1>
              <p className="text-gray-600">Manage and showcase your beloved companions</p>
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

            {view == "myPets" && (
              <div>
                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Pets</h2>
                    <p className="text-gray-500">
                      {listPets?.response?.length || 0} pet{listPets?.response?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button className="btn-facebook flex items-center space-x-2" onClick={() => setIsModalOpen(true)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Add New Pet</span>
                  </button>
                </div>

                {/* Pets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listPets?.response?.map((pet: IPet) => (
                    <Pet key={pet.id} {...pet} />
                  ))}
                </div>

                {(!listPets?.response || listPets.response.length === 0) && (
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pets yet</h3>
                    <p className="text-gray-500 mb-4">Add your first pet to get started!</p>
                    <button className="btn-facebook" onClick={() => setIsModalOpen(true)}>
                      Add Your First Pet
                    </button>
                  </div>
                )}
              </div>
            )}

            {isModalOpen && addNewPet()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPetsPage
