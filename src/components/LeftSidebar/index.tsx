"use client"

import { Link, useLocation } from "react-router-dom"
import { checkJwt } from "../../../utils/auth"
import { useEffect, useState } from "react"

const LeftSidebar = () => {
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState<any>()

  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkJwt()
      setCurrentUser(user)
    }
    fetchUser()
  }, [])

  const navigationItems = [
    {
      name: "News Feed",
      href: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14-7H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
          />
        </svg>
      ),
    },
    {
      name: "Friends",
      href: "/friends",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      name: "Pets",
      href: "/pets",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      name: "Groups",
      href: "/groups",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ]

  const shortcuts = [
    {
      name: "My Pets",
      href: "/pets/my-pets",
      emoji: "🐕",
    },
    {
      name: "Pet Groups",
      href: "/groups/my-groups",
      emoji: "👥",
    },
  ]

  return (
    <div className="fixed left-0 top-14 md:top-16 h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-80 bg-white border-r border-gray-200 z-10 hidden lg:block overflow-y-auto">
      <div className="p-3 sm:p-4">
        {/* User Profile Section */}
        <Link to="/profile" className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors mb-4">
          <img
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
            src={currentUser?.avatar || "/placeholder.svg?height=40&width=40&query=user"}
            alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
          />
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-900">
              {currentUser?.first_name} {currentUser?.last_name}
            </p>
          </div>
        </Link>

        {/* Create Post Button */}
        <Link to="/create-post" className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors mb-6">
          <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">Create Post</span>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1 mb-8">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className={`${isActive ? "text-blue-700" : "text-gray-400"}`}>{item.icon}</span>
                <span className="ml-3">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Shortcuts Section */}
        <div className="mb-8">
          <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shortcuts</h3>
          <div className="space-y-1">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.name}
                to={shortcut.href}
                className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">{shortcut.emoji}</span>
                <span className="ml-3">{shortcut.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("access_token")
            window.location.href = "/sign-in"
          }}
          className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default LeftSidebar
