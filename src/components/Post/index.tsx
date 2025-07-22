"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { IComment, IMedia, IPost, ITag } from "../../../types"
import { checkJwt } from "../../../utils/auth"
import { fetchCommentsByPostId } from "../../api"
import Comment from "../Comment"

const API_URL = import.meta.env.VITE_API_URL

const ListComment = (post: IPost) => {
  const [listComment, setListComment] = useState<IComment[] | null>(null)
  const [newComment, setNewComment] = useState<string>("")
  const [commentImage, setCommentImage] = useState<File | null>(null)
  const [replied_comment_id, setRepliedCommentId] = useState<number | null>(null)

  const accessToken = localStorage.getItem("access_token")
  if (!accessToken) {
    window.location.href = "/sign-in"
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchCommentsByPostId(post.id)
      setListComment(response)
    }
    fetchData()
  }, [post.id])

  const submitComment = async () => {
    try {
      if (newComment === "" && !commentImage) {
        alert("Please enter your comment or select an image")
        return
      }

      const formData = new FormData()
      formData.append("post_id", post.id)
      formData.append("comment", newComment)
      if (replied_comment_id) {
        formData.append("replied_comment_id", replied_comment_id.toString())
      }
      if (commentImage) {
        formData.append("file", commentImage)
      }

      await axios.post(`${API_URL}/api/v1/comments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      const updatedComments = await fetchCommentsByPostId(post.id)
      setListComment(updatedComments)
      setNewComment("")
      setCommentImage(null)
      setRepliedCommentId(null)
    } catch (error) {
      console.error("Error submitting comment:", error)
    }
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">{listComment?.length || 0} Comments</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submitComment()
          }}
          className="space-y-3"
        >
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="avatar avatar-md bg-gray-300"></div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="facebook-input resize-none"
                rows={2}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="comment-image" className="cursor-pointer p-2 hover:bg-gray-100 rounded-facebook">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                type="file"
                id="comment-image"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCommentImage(e.target.files?.[0] || null)}
              />
            </label>

            <button type="submit" className="btn-facebook text-sm">
              Post
            </button>
          </div>

          {commentImage && (
            <div className="mt-2">
              <img
                className="h-20 w-20 object-cover rounded-facebook"
                src={URL.createObjectURL(commentImage) || "/placeholder.svg"}
                alt="comment preview"
              />
            </div>
          )}
        </form>
      </div>

      <div className="space-y-3">
        {listComment?.map((comment: IComment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    </div>
  )
}

const Post = (post: IPost) => {
  const [showComments, setShowComments] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [liked, setLiked] = useState(false)
  const [totalLike, setTotalLike] = useState(post.likes?.length ?? 0)
  const postCreatedAt = new Date(post.created_at)
  const [, setIsEditPost] = useState(false)

  const getMediaHtml = (media: IMedia) => {
    if (media.type === "image") {
      return (
        <img
          src={media.link || "/placeholder.svg"}
          alt="Post media"
          loading="lazy"
          className="w-full rounded-facebook object-cover max-h-96"
        />
      )
    } else if (media.type === "video") {
      return <video className="w-full rounded-facebook object-cover max-h-96" src={media.link} controls />
    }
    return null
  }

  useEffect(() => {
    const checkOwner = async () => {
      const currentUser = await checkJwt()
      if (currentUser) {
        setIsOwner(currentUser.id === post.user.id)
        const likedPost = post.likes?.find((like) => like.id === currentUser.id)
        setLiked(!!likedPost)
      }
    }
    checkOwner()
  }, [post.user.id, post.likes])

  const likePost = async () => {
    try {
      await axios.post(
        `${API_URL}/api/v1/posts/${post.id}/like`,
        { post_id: post.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )

      setLiked(!liked)
      setTotalLike(liked ? totalLike - 1 : totalLike + 1)
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  return (
    <div className="facebook-card">
      {/* Post Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {post.group ? (
              <div className="relative">
                <Link to={`/groups/${post.group.id}`}>
                  <img
                    className="avatar avatar-xl"
                    src={post.group?.avatar || "/placeholder.svg?height=48&width=48"}
                    alt="Group avatar"
                  />
                </Link>
                <Link to={`/profile/${post.user.id}`} className="absolute -bottom-1 -right-1">
                  <img
                    className="avatar avatar-md border-2 border-white"
                    src={post.user?.avatar || "/placeholder.svg?height=32&width=32"}
                    alt="User avatar"
                  />
                </Link>
              </div>
            ) : (
              <Link to={`/profile/${post.user.id}`}>
                <img
                  className="avatar avatar-xl"
                  src={post.user.avatar || "/placeholder.svg?height=48&width=48"}
                  alt="User avatar"
                />
              </Link>
            )}

            <div>
              <div className="flex items-center space-x-1">
                {post.group && (
                  <Link to={`/groups/${post.group.id}`} className="font-semibold text-gray-900 hover:underline">
                    {post.group.name}
                  </Link>
                )}
                <Link to={`/profile/${post.user.id}`} className="font-semibold text-gray-900 hover:underline">
                  {post.user.first_name} {post.user.last_name}
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                {postCreatedAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                · 🌍
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => setIsEditPost(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        {post.title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>}
        {post.description && <p className="text-gray-800 leading-relaxed mb-3">{post.description}</p>}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag: ITag) => (
              <span key={tag.id} className="text-facebook-600 hover:underline cursor-pointer text-sm">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Media */}
      {post.media && <div className="px-4 pb-3">{getMediaHtml(post.media)}</div>}

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            {totalLike > 0 && (
              <>
                <div className="w-5 h-5 bg-facebook-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                  </svg>
                </div>
                <span>{totalLike}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>{post.comments?.length || 0} comments</span>
            <span>0 shares</span>
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button className={`post-action-btn flex-1 ${liked ? "liked" : ""}`} onClick={likePost}>
            <svg
              className="w-5 h-5 mr-2"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            Like
          </button>

          <button className="post-action-btn flex-1" onClick={() => setShowComments(!showComments)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Comment
          </button>

          <button className="post-action-btn flex-1">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Share
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4">
          <ListComment {...post} />
        </div>
      )}
    </div>
  )
}

export default Post
