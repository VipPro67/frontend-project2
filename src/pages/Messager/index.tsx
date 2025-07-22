"use client"

import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import io from "socket.io-client"
import type { IMessage } from "../../../types"
import { checkJwt } from "../../../utils/auth"
import { fetchAllMyConservation } from "../../api"
const API_URL = import.meta.env.VITE_API_URL

const MessagerPage = () => {
  const [listConversation, setListConversation] = useState<IMessage[]>()
  const [currentConversation, setCurrentConversation] = useState<IMessage[]>()
  const [currentUser, setCurrentUser] = useState<any>()
  const [currentGroup, setCurrentGroup] = useState<any>()
  const [currentFriend, setCurrentFriend] = useState<any>()
  const [newMessage, setNewMessage] = useState<IMessage>()
  const [search, setSearch] = useState<string>(window.location.search)
  const socket = useRef<any>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation])

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMyConservation()
      setListConversation(data)
      if (search) {
        const type = search.split("=")[0].replace("?", "")
        const id = search.split("=")[1]

        const response = await fetch(`${API_URL}/api/v1/messages/conversation/${type}/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })

        const conversationData = await response.json()
        setCurrentConversation(conversationData)
      }
    }

    fetchData()

    socket.current = io(`${API_URL}`)
    socket.current.on("newMessage", (data: IMessage) => {
      setNewMessage(data)
    })

    return () => {
      socket.current?.disconnect()
    }
  }, [search])

  useEffect(() => {
    const fetchAllConversation = async () => {
      const data = await fetchAllMyConservation()
      setListConversation(data)
    }
    fetchAllConversation()

    const fetchUser = async () => {
      const user = await checkJwt()
      setCurrentUser(user)
    }

    const fetchGroup = async () => {
      const response = await axios.get(`${API_URL}/api/v1/groups/${search.split("=")[1]}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setCurrentGroup(response.data)
    }

    const fetchFriend = async () => {
      const response = await axios.get(`${API_URL}/api/v1/users/${search.split("=")[1]}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setCurrentFriend(response.data)
    }

    if (search) {
      if (search.includes("group")) {
        fetchGroup()
      } else {
        fetchFriend()
      }
    }
    fetchUser()
  }, [newMessage, search])

  useEffect(() => {
    const fetchConversation = async () => {
      const type = search.split("=")[0].replace("?", "")
      const id = search.split("=")[1]

      await fetch(`${API_URL}/api/v1/messages/conversation/${type}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCurrentConversation(data)
        })
    }
    if (search) {
      fetchConversation()
    }
  }, [search, newMessage])

  const handleSend = async () => {
    const message = document.getElementById("message") as HTMLInputElement
    const search = window.location.search
    const type = search.split("=")[0].replace("?", "")
    const id = search.split("=")[1]

    if (message.value.trim()) {
      socket.current.emit("sendMessage", {
        sender_id: currentUser?.id,
        receiver_id: type == "user" ? id : null,
        group_id: type == "group" ? id : null,
        content: message.value,
      })
      message.value = ""
    }
  }

  return (
    <div className="flex h-full bg-white">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Chats</h1>
          <div className="relative">
            <input
              type="text"
              className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search Messenger"
            />
            <svg
              className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
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

        <div className="flex-1 overflow-y-auto">
          {listConversation?.map((conversation) => {
            const isActive =
              search ===
              (conversation.group
                ? `?group=${conversation.group.id}`
                : conversation.sender.id == currentUser?.id
                  ? `?user=${conversation.receiver?.id}`
                  : `?user=${conversation.sender.id}`)

            return (
              <Link
                to={
                  conversation.group
                    ? `/messager?group=${conversation.group.id}`
                    : conversation.sender.id == currentUser?.id
                      ? `/messager?user=${conversation.receiver?.id}`
                      : `/messager?user=${conversation.sender.id}`
                }
                className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  isActive ? "bg-blue-50 border-r-2 border-blue-500" : ""
                }`}
                key={conversation.id}
                onClick={() =>
                  setSearch(
                    conversation.group
                      ? `?group=${conversation.group.id}`
                      : conversation.sender.id == currentUser?.id
                        ? `?user=${conversation.receiver?.id}`
                        : `?user=${conversation.sender.id}`,
                  )
                }
              >
                <div className="relative">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={
                      conversation.group
                        ? conversation.group?.avatar || "/placeholder.svg?height=48&width=48&query=group"
                        : conversation.sender.id == currentUser?.id
                          ? conversation.receiver?.avatar || "/placeholder.svg?height=48&width=48&query=user"
                          : conversation.sender.avatar || "/placeholder.svg?height=48&width=48&query=user"
                    }
                    alt="Avatar"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {conversation.group
                        ? conversation.group.name
                        : conversation.sender.id == currentUser?.id
                          ? `${conversation.receiver?.first_name} ${conversation.receiver?.last_name}`
                          : `${conversation.sender.first_name} ${conversation.sender.last_name}`}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{conversation.content}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={
                      search.includes("group")
                        ? currentGroup?.avatar || "/placeholder.svg?height=40&width=40&query=group"
                        : currentFriend?.avatar || "/placeholder.svg?height=40&width=40&query=user"
                    }
                    alt="Avatar"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {search.includes("group")
                        ? currentGroup?.name
                        : `${currentFriend?.first_name} ${currentFriend?.last_name}`}
                    </h2>
                    <p className="text-sm text-green-500">Active now</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {currentConversation?.map((message) => {
                const isCurrentUser = message.sender.id == currentUser?.id
                return (
                  <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`} key={message.id}>
                    <div
                      className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      {!isCurrentUser && (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={message.sender.avatar || "/placeholder.svg?height=32&width=32&query=user"}
                          alt={`${message.sender.first_name} ${message.sender.last_name}`}
                        />
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isCurrentUser ? "bg-blue-600 text-white" : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-4 py-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <div className="flex-1 relative">
                  <input
                    className="w-full bg-gray-100 rounded-full px-4 py-2 pr-12 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Type a message..."
                    id="message"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your Messages</h3>
              <p className="text-gray-500">Send private messages to a friend or group.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagerPage
