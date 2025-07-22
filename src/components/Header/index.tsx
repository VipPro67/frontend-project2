"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { IUser } from "../../../types"
import { checkJwt } from "../../../utils/auth"

const Header = () => {
  const [user, setUser] = useState<IUser | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkJwt()
      setUser(userData)
    }
    fetchUser()
  }, [])

  return (
    <header className="bg-white shadow-facebook sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left section - Logo and Search */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-facebook-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-facebook-600 hidden sm:block">PetMD</span>
            </Link>

            <div className="hidden md:block flex-1 max-w-md">
              <div className="relative">
                <input type="text" placeholder="Search PetMD" className="facebook-input pl-10 text-sm" />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
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
          </div>

          {/* Center section - Navigation (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/" className="p-2 sm:p-3 rounded-facebook hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            <Link to="/friends" className="p-2 sm:p-3 rounded-facebook hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </Link>
            <Link to="/groups" className="p-2 sm:p-3 rounded-facebook hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91z" />
              </svg>
            </Link>
          </div>

          {/* Right section - User actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-end">
            {user ? (
              <>
                <Link
                  to="/messager"
                  className="p-1.5 sm:p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
                </Link>

                <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>

                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center space-x-1 sm:space-x-2 p-1 hover:bg-gray-100 rounded-facebook transition-colors"
                >
                  <img
                    src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                    alt="Profile"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                  <span className="hidden md:block text-xs sm:text-sm font-medium text-gray-700 max-w-20 truncate">
                    {user.first_name}
                  </span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-facebook transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            ) : (
              <Link to="/sign-in">
                <button className="btn-facebook text-sm px-3 py-1.5 sm:px-4 sm:py-2">Sign In</button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input type="text" placeholder="Search PetMD" className="facebook-input pl-10 text-sm w-full" />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span className="font-medium text-gray-700">Home</span>
              </Link>
              <Link
                to="/friends"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <span className="font-medium text-gray-700">Friends</span>
              </Link>
              <Link
                to="/pets"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="font-medium text-gray-700">Pets</span>
              </Link>
              <Link
                to="/groups"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91z" />
                </svg>
                <span className="font-medium text-gray-700">Groups</span>
              </Link>
              <Link
                to="/create-post"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium text-gray-700">Create Post</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
