"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import type { IPet, IUser } from "../../../types"
import { checkJwt } from "../../../utils/auth"
const API_URL = import.meta.env.VITE_API_URL

const Pet = (pet: IPet) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [currentUser, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkJwt()
      setUser(userData)
    }
    fetchUser()
  }, [])

  const [formData, setFormData] = useState({
    name: pet.name,
    date_of_birth: pet.date_of_birth,
    species: pet.species,
    sex: pet.sex,
    breed: pet.breed,
    description: pet.description,
    avatar: null as File | null,
  })

  const handlerSubmit = () => {
    if (confirm("Are you sure you want to edit this pet?")) {
      const formDataS = new FormData()
      formDataS.append("name", formData.name)
      formDataS.append("date_of_birth", formData.date_of_birth)
      formDataS.append("species", formData.species)
      formDataS.append("sex", formData.sex)
      formDataS.append("breed", formData.breed)
      formDataS.append("description", formData.description)
      if (selectedMedia) {
        formDataS.append("avatar", selectedMedia)
      }
      axios
        .put(`${API_URL}/api/v1/pets/${pet.id}`, formDataS, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            alert("Pet edited successfully")
            window.location.href = "/my-pets"
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const handlerDelete = () => {
    if (confirm("Are you sure you want to delete this pet?")) {
      axios
        .delete(`${API_URL}/api/v1/pets/${pet.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            alert("Pet deleted successfully")
            window.location.href = "/my-pets"
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const editPet = () => {
    return (
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
            aria-hidden="true"
            onClick={() => setIsEditModalOpen(false)}
          />
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit {pet.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlerDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete pet"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    className="facebook-input"
                    type="text"
                    placeholder="Pet name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    className="facebook-input"
                    type="date"
                    value={new Date(formData.date_of_birth).toISOString().split("T")[0]}
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
                    placeholder="Tell us about your pet..."
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
                Save Changes
              </button>
              <button
                type="button"
                className="btn-facebook-secondary w-full sm:w-auto mt-3 sm:mt-0"
                onClick={() => setIsEditModalOpen(false)}
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
    <div className="facebook-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square overflow-hidden relative group">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={pet.avatar || "/placeholder.svg?height=300&width=300&query=cute pet"}
          alt={pet.name}
        />
        {currentUser?.id == pet.owner.id && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex space-x-1">
              <button
                className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm transition-all duration-200"
                onClick={() => {
                  if (window.confirm("Are you sure you want to pair this pet?")) {
                    window.location.href = `/pets/pair/${pet.id}`
                  }
                }}
                title="Find a mate"
              >
                <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
              <button
                className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm transition-all duration-200"
                onClick={() => setIsEditModalOpen(true)}
                title="Edit pet"
              >
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
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
      </div>

      {isEditModalOpen && editPet()}
    </div>
  )
}

export default Pet
