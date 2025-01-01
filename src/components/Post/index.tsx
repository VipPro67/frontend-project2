import { useEffect, useState } from 'react';
import { IComment, IMedia, IPost, ITag } from '../../../types';
import Comment from '../Comment';
import { fetchCommentsByPostId } from '../../api';
import { Link } from 'react-router-dom';
import { checkJwt } from '../../../utils/auth';
import axios from 'axios';
const ListComment = (post: IPost) => {
  const [listComment, setListComment] = useState<IComment[] | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [replied_comment_id, setRepliedCommentId] = useState<number | null>(
    null
  );
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    window.location.href = '/sign-in';
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchCommentsByPostId(post.id);
      setListComment(response);
    };

    fetchData();
  }, [post.id]);

  const submitComment = async () => {
    try {
      if (newComment === '' && !commentImage) {
        alert('Please enter your comment or select an image');
        return;
      }

      const formData = new FormData();
      formData.append('post_id', post.id);
      formData.append('comment', newComment);
      if (replied_comment_id) {
        formData.append('replied_comment_id', replied_comment_id.toString());
      }
      if (commentImage) {
        formData.append('file', commentImage);
      }

      const response = await axios.post(
        'http://localhost:3001/api/v1/comments',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      // Handle the response as needed (e.g., update state, show notifications)
      const result = response.data;

      // After submitting, you might want to refetch the comments
      const updatedComments = await fetchCommentsByPostId(post.id);
      setListComment(updatedComments);

      // Clear the input fields after submitting
      setNewComment('');
      setCommentImage(null);
      setRepliedCommentId(null);
    } catch (error) {
      // Handle any errors here
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <section className="bg-white py-8 lg:py-16 antialiased">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
            Discussion ({listComment?.length})
          </h2>
        </div>
        <form
          className="mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            submitComment();
          }}
        >
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows={2}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <label htmlFor="comment-image" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 hover:text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </label>
              <input
                type="file"
                id="comment-image"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCommentImage(e.target.files?.[0] || null)}
              />
              {commentImage && (
                <div className="ml-2">
                  <img
                    className="object-cover h-12 w-12 rounded-lg"
                    src={URL.createObjectURL(commentImage)}
                    alt="comment-image"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-600"
            >
              Post comment
            </button>
          </div>
        </form>
        {listComment?.map((comment: IComment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    </section>
  );
};
const Post = (post: IPost) => {
  const [showComments, setShowComments] = useState(false);
  const [isOnwer, setIsOnwer] = useState(false);
  const [liked, setLiked] = useState(false);
  const [totalLike, setTotalLike] = useState(post.likes?.length ?? 0);
  const postCreatedAt = new Date(post.created_at);
  const [isEditPost, setIsEditPost] = useState(false);
  const currentTime = new Date();
  // const timeDifference = () => {
  //   var days = currentTime.getDate() - postCreatedAt.getDate();
  //   var hours = currentTime.getHours() - postCreatedAt.getHours();
  //   var minutes = currentTime.getMinutes() - postCreatedAt.getMinutes();
  //   var seconds = currentTime.getSeconds() - postCreatedAt.getSeconds();

  //   // Adjust for negative values
  //   if (seconds < 0) {
  //     minutes -= 1;
  //     seconds += 60;
  //   }

  //   if (minutes < 0) {
  //     hours -= 1;
  //     minutes += 60;
  //   }
  //   if (hours < 0) {
  //     days -= 1;
  //     hours += 24;
  //   }

  //   if (days > 0) {
  //     return `${days} day${days > 1 ? 's' : ''} ago`;
  //   } else if (hours > 0) {
  //     return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  //   } else if (minutes > 0) {
  //     return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  //   } else {
  //     return 'Just a moment ago';
  //   }
  // };
  const getMediaHtml = (media: IMedia) => {
    if (media.type === 'image') {
      return (
        <img
          id={`${media.id}`}
          src={`${media.link}`}
          alt="Image"
          loading="lazy"
          className="w-full h-full object-cover rounded-lg max-h-screen"
        />
      );
    } else if (media.type === 'video') {
      return (
        <video
          className="w-full h-full object-cover rounded-lg max-h-screen"
          id={`${media.id}`}
          src={`${media.link}`}
          controls
        ></video>
      );
    } else {
      return ''; // Handle other media types as needed
    }
  };

  const getTagHtml = (tag: ITag) => {
    return (
      <div
        key={tag.id}
        className="bg-gray-200 text-gray-700 text-sm font-semibold rounded-full py-1 px-2 m-1 flex items-center"
      >
        <span className="mx-2">#{tag.name}</span>
      </div>
    );
  };
  useEffect(() => {
    isLiked();
    const checkOwner = async () => {
      const currentUser = await checkJwt();
      if (currentUser) {
        if (currentUser.id === post.user.id) {
          setIsOnwer(true);
        }
      }
    };
    checkOwner();
    return () => {
      setShowComments(false);
    };
  }, [liked]);

  const likePost = async () => {
    try {
      // You need to implement the endpoint and handle the response accordingly
      await axios.post(
        `http://localhost:3001/api/v1/posts/${post.id}/like`,
        {
          post_id: post.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      setLiked(!liked);

      // Update total likes based on the current state
      setTotalLike(liked ? totalLike - 1 : totalLike + 1);
    } catch (error) {
      // Handle any errors here
      console.error('Error liking post:', error);
    }
  };

  const isLiked = async () => {
    const currentUser = await checkJwt();
    if (currentUser) {
      const likedPost = post.likes?.find((like) => {
        return like.id === currentUser.id;
      });
      if (likedPost) {
        setLiked(true);
      }
    }
  };

  const [postData, setPostData] = useState({
    title: post.title,
    description: post.description,
    tagNames: post.tags ? post.tags.map((tag) => tag.name) : [],
    media: post.media,
  });
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const handleAddTag = () => {
    const tag = document.getElementById('tags') as HTMLInputElement;
    if (tag.value) {
      if (postData.tagNames.includes(tag.value)) {
        alert('Tag already exist');
        return;
      }
      setPostData({ ...postData, tagNames: [...postData.tagNames, tag.value] });
      tag.value = '';
    }
  };
  const handlerSubmitEdit = () => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('media', selectedMedia as File);
    postData.tagNames.forEach((tag, index) => {
      formData.append(`tagNames[${index}]`, tag);
    });
    try {
      const res = axios
        .put('http://localhost:3001/api/v1/posts/' + post.id, formData, {
          headers: {
            'Content-Type': 'form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .then((res) => {
          res.status === 200 && alert('Post created successfully');
          window.location.href = '/';
        });
    } catch (error) {
      console.log(error);
    }
  };
  const deletePost = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this post?')) return;
      const res = await axios.delete(
        'http://localhost:3001/api/v1/posts/' + id,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      res.status === 200 && alert('Post deleted successfully');
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  };
  const editPost = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay, show/hide based on modal state. */}
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsEditPost(false)}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          {/* Modal panel, show/hide based on modal state. */}
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form className="xl:w-full xl:max-w-lg xl:p-4 m-2">
              <div className="flex justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                <button
                  className="text-red-500"
                  onClick={() => deletePost(post.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-flow-row">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="border border-gray-400 rounded-md p-2"
                  value={postData.title}
                  onChange={(e) =>
                    setPostData({ ...postData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-flow-row">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  className="border border-gray-400 rounded-md p-2"
                  value={postData.description}
                  onChange={(e) =>
                    setPostData({ ...postData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-flow-row">
                <label htmlFor="tags">
                  <span className=" ml-2 text-sm text-gray-800 sm:text-base ">
                    Tag
                  </span>{' '}
                </label>
                <div className="md:grid md:grid-cols-12 items-center ">
                  <input
                    id="tags"
                    className="mt-1 py-3 px-5 border-2 rounded-md outline-none w-full md:col-span-10 gap-2 "
                    type="text"
                    placeholder="Type something"
                  />
                  <div
                    className="text-center py-3 px-7  h-fit w-fit text-sm font-medium bg-purple-500 text-gray-100 rounded-md cursor-pointer sm:w-min hover:bg-purple-700 hover:text-gray-50  mb-4 sm:mb-0"
                    onClick={() => {
                      handleAddTag();
                    }}
                  >
                    <span>Add</span>
                  </div>
                </div>
                <div className="flex flex-wrap">
                  {postData.tagNames.map((tag) => (
                    <div
                      key={tag}
                      className="bg-gray-200 text-gray-700 text-sm font-semibold rounded-full py-1 px-2 m-1 flex items-center"
                    >
                      {tag}
                      <button title="Delete post">
                        <svg
                          className="w-3 h-3 ml-2 cursor-pointer"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => {
                            setPostData({
                              ...postData,
                              tagNames: postData.tagNames.filter(
                                (t) => t !== tag
                              ),
                            });
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex flex-wrap"></div>
                </div>
              </div>
              <div className="grid grid-flow-row">
                <label htmlFor="image">Media</label>
                <input
                  type="file"
                  id="image"
                  accept=".jpg,.png,.jpeg,.mp4,.avi,.mkv,video/*"
                  className="border border-gray-400 rounded-md p-2"
                  onChange={(e) =>
                    setSelectedMedia(e.target.files?.[0] || null)
                  }
                />
              </div>
            </form>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none  sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => handlerSubmitEdit()}
              >
                Add
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setIsEditPost(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex  bg-white shadow-lg rounded-lg m-1">
      <div className="flex-row w-full items-start px-4 py-6">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-end justify-between">
              {post.group ? (
                <div className="flex items-end justify-between ">
                  <div className="relative w-16 h-16">
                    <Link to={`/groups/${post.group.id}`}>
                      <img
                        className="w-16 h-16 rounded-xl object-cover mr-4 shadow absolute top-0 left-0"
                        src={
                          post.group?.avatar
                            ? post.group?.avatar
                            : './default-avatar.png'
                        }
                        alt="avatar"
                      ></img>
                    </Link>
                    <Link to={`/profile/${post.user.id}`}>
                      <img
                        className="w-10 h-10 rounded-full object-cover shadow absolute bottom-0 right-0"
                        src={
                          post.user?.avatar
                            ? post.user?.avatar
                            : './default-avatar.png'
                        }
                        alt="avatar"
                      ></img>
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={`/groups/${post.user.id}`}
                      className=" flex flex-col ml-2"
                    >
                      <h2 className="text-lg font-semibold text-gray-900 ">
                        {post.group.name}
                      </h2>
                      <h2 className=" text-gray-900 -mt-1 font-semibold">
                        {post.user.first_name} {post.user.last_name}{' '}
                      </h2>
                      <p className="text-sm text-gray-700">
                        {/* {timeDifference()} */}
                        {
                          <span className="text-sm text-gray-700">
                            {postCreatedAt.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        }
                      </p>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-end justify-between">
                  <Link to={`/profile/${post.user.id}`}>
                    <img
                      className="w-16 h-16 rounded-xl object-cover mr-4 shadow"
                      src={
                        post.user.avatar
                          ? post.user.avatar
                          : './default-avatar.png'
                      }
                      alt="avatar"
                    ></img>
                  </Link>
                  <div>
                    <Link to={`/profile/${post.user.id}`}>
                      <h2 className="text-lg font-semibold text-gray-900 -mt-1">
                        {post.user.first_name} {post.user.last_name}{' '}
                      </h2>
                    </Link>
                    <small className="text-sm text-gray-700">
                      {/* {timeDifference()} */}
                      {
                        <span className="text-sm text-gray-700">
                          {postCreatedAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      }
                    </small>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              {isOnwer && (
                <button onClick={() => setIsEditPost(true)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="mt-3 text-gray-700 text-md font-bold">{post.title}</p>
          <p className="mt-3 text-gray-700 text-sm">{post.description}</p>
          {post.media ? getMediaHtml(post.media) : ''}
          <div className="flex">
            {post.tags ? post.tags.map((tag) => getTagHtml(tag)) : ''}
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex mr-2 text-gray-700 text-lg">
              <button className=" bg-red" onClick={likePost}>
                {!liked ? (
                  <svg
                    fill="#000000"
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3,21a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H6V21ZM19.949,10H14.178V5c0-2-3.076-2-3.076-2s0,4-1.026,5C9.52,8.543,8.669,10.348,8,11V21H18.644a2.036,2.036,0,0,0,2.017-1.642l1.3-7A2.015,2.015,0,0,0,19.949,10Z" />
                  </svg>
                ) : (
                  <svg
                    fill="#FF0000"
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3,21a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H6V21ZM19.949,10H14.178V5c0-2-3.076-2-3.076-2s0,4-1.026,5C9.52,8.543,8.669,10.348,8,11V21H18.644a2.036,2.036,0,0,0,2.017-1.642l1.3-7A2.015,2.015,0,0,0,19.949,10Z" />
                  </svg>
                )}
              </button>
              <span className={'ml-2 mr-8'}>{totalLike}</span>
            </div>
            <div className="flex mr-2 text-gray-700 text-md">
              <button onClick={() => setShowComments(!showComments)}>
                <svg
                  className="w-8 h-8"
                  version="1.0"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  enable-background="new 0 0 64 64"
                >
                  <path
                    fill="#231F20"
                    d="M60,0H4C1.789,0,0,1.789,0,4v40c0,2.211,1.789,4,4,4h8v15c0,0.404,0.243,0.77,0.617,0.924
	C12.741,63.976,12.871,64,13,64c0.26,0,0.516-0.102,0.707-0.293L29.414,48H60c2.211,0,4-1.789,4-4V4C64,1.789,62.211,0,60,0z M15,14
	h16c0.553,0,1,0.447,1,1s-0.447,1-1,1H15c-0.553,0-1-0.447-1-1S14.447,14,15,14z M45,34H15c-0.553,0-1-0.447-1-1s0.447-1,1-1h30
	c0.553,0,1,0.447,1,1S45.553,34,45,34z M14,27c0-0.553,0.447-1,1-1h24c0.553,0,1,0.447,1,1s-0.447,1-1,1H15
	C14.447,28,14,27.553,14,27z M49,22H15c-0.553,0-1-0.447-1-1s0.447-1,1-1h34c0.553,0,1,0.447,1,1S49.553,22,49,22z"
                  />
                </svg>
              </button>

              <span className="ml-2 mr-8">{post.comments?.length ?? 0}</span>
            </div>
          </div>
        </div>
        {showComments && <ListComment {...post}></ListComment>}
        {isEditPost ? editPost() : ''}
      </div>
    </div>
  );
};

export default Post;
