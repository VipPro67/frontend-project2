"use client"

import { useEffect, useState } from "react"
import LeftSidebar from "../../components/LeftSidebar"
import type { IPost } from "../../../types"
import { fetchPosts } from "../../api"
import Post from "../../components/Post"
import { Link } from "react-router-dom"

type IResponse = {
  data: IPost[]
  total: number
  currentPage: number
  items_per_page: number
  totalPage: number
  nextPage: number | null
  prePage: number | null
}

const CreatePostCard = () => {
  return (
    <div className="facebook-card mb-4">
      <div className="p-3 sm:p-4">
        <Link to="/create-post" className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div className="facebook-input flex-1 cursor-pointer text-gray-500 text-sm sm:text-base">
            What's on your mind?
          </div>
        </Link>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <Link
            to="/create-post"
            className="flex items-center space-x-2 px-2 sm:px-4 py-2 hover:bg-gray-100 rounded-facebook transition-colors flex-1 justify-center"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-600 font-medium text-sm sm:text-base">Photo/Video</span>
          </Link>
          <Link
            to="/create-post"
            className="flex items-center space-x-2 px-2 sm:px-4 py-2 hover:bg-gray-100 rounded-facebook transition-colors flex-1 justify-center"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-gray-600 font-medium text-sm sm:text-base">Feeling</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

const ListPost = () => {
  const [listPost, setListPost] = useState<IResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response: IResponse = await fetchPosts()
      setListPost({
        data: response.data,
        total: response.total,
        currentPage: response.currentPage,
        items_per_page: response.items_per_page,
        totalPage: response.totalPage,
        nextPage: response.nextPage,
        prePage: response.prePage,
      })
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePostCard />
      <div className="space-y-4">
        {listPost?.data.map((post: IPost) => (
          <Post key={post.id} {...post} />
        ))}
      </div>

      {/* Loading state */}
      {!listPost && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="facebook-card p-4 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const HomePage = () => {
  return (
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1 p-2 sm:p-4">
        <ListPost />
      </div>
    </div>
  )
}

export default HomePage
