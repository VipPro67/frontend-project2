import { useEffect, useState } from 'react';
import { IComment, IMedia, IPost, ITag } from '../../../types';
import Comment from '../Comment';
import { fetchCommentsByPostId } from '../../api';
import { Link } from 'react-router-dom';
import { checkJwt } from '../../../utils/auth';

const ListComment = (post: IPost) => {
  const [listComment, setListComment] = useState<IComment[] | null>(null);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchCommentsByPostId(post.id);
      setListComment(response);
    };

    fetchData();
  }, [post.id]);

  const submitComment = async () => {
    // You need to implement the endpoint and handle the response accordingly
    const response = await fetch('http://localhost:3001/api/v1/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: post.id,
        comment: newComment,
      }),
    });

    // Handle the response as needed (e.g., update state, show notifications)
    const result = await response.json();
    console.log(result);

    // After submitting, you might want to refetch the comments
    const updatedComments = await fetchCommentsByPostId(post.id);
    setListComment(updatedComments);

    // Clear the input field after submitting
    setNewComment('');
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
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 ">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows={2}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400"
              placeholder="Write a comment..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center dark:text-white bg-blue-400 dark:bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Post comment
          </button>
        </form>
        {listComment?.map((commnet: IComment) => (
          <Comment key={commnet.id} {...commnet} />
        ))}
      </div>
    </section>
  );
};

const Post = (post: IPost) => {
  const [showComments, setShowComments] = useState(false);
  const [isOnwer, setIsOnwer] = useState(false);
  const [liked, setLiked] = useState(false);

  const postCreatedAt = new Date(post.created_at);
  const currentTime = new Date();
  const timeDifference = () => {
    var days = currentTime.getDate() - postCreatedAt.getDate();
    var hours = currentTime.getHours() - postCreatedAt.getHours();
    var minutes = currentTime.getMinutes() - postCreatedAt.getMinutes();
    var seconds = currentTime.getSeconds() - postCreatedAt.getSeconds();

    // Adjust for negative values
    if (seconds < 0) {
      minutes -= 1;
      seconds += 60;
    }

    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    if (hours < 0) {
      days -= 1;
      hours += 24;
    }

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just a moment ago';
    }
  };
  const getMediaHtml = (media: IMedia) => {
    if (media.type === 'image') {
      return (
        <img
          id={`${media.id}`}
          src={`${media.link}`}
          alt="Image"
          loading="lazy"
        />
      );
    } else if (media.type === 'video') {
      return <video id={`${media.id}`} src={`${media.link}`} controls></video>;
    } else {
      return ''; // Handle other media types as needed
    }
  };

  const getTagHtml = (tag: ITag) => {
    return (
      <div className="bg-gray-200 text-gray-700 text-sm font-semibold rounded-full py-1 px-2 m-1 flex items-center">
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
    // You need to implement the endpoint and handle the response accordingly
    await fetch('http://localhost:3001/api/v1/posts/' + post.id + '/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
      body: JSON.stringify({
        post_id: post.id,
      }),
    });
  };

  //check if user liked this post
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
  return (
    <div
      className="flex  bg-white shadow-lg rounded-lg m-1"
      onMouseLeave={() => setShowComments(false)}
    >
      <div className="flex-row w-full items-start px-4 py-6">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <Link to={`/profile/${post.user.id}`}>
                <img
                  className="w-12 h-12 rounded-full object-cover mr-4 shadow"
                  src={
                    post.user.avatar ? post.user.avatar : './default-avatar.png'
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
                  {
                    //convert date to string format hh:mm:ss dd/mm/yyyy
                    timeDifference()
                  }
                </small>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {isOnwer ? (
                <div className="flex items-center justify-between">
                  <button className="bg-red">
                    <img
                      src="./assets/icons/edit.svg"
                      height={24}
                      width={24}
                      title="Edit"
                      alt="Edit"
                    ></img>
                  </button>
                  <button className="bg-red">
                    <img
                      src="./assets/icons/delete.svg"
                      height={24}
                      width={24}
                      title="Delete"
                      alt="Delete"
                    ></img>
                  </button>
                </div>
              ) : (
                ''
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
                  <img
                    src="./assets/icons/like.svg"
                    height={24}
                    width={24}
                    title="Like"
                    alt="Like"
                  ></img>
                ) : (
                  <img
                    src="./assets/icons/liked.svg"
                    height={24}
                    width={24}
                    title="Like"
                    alt="Like"
                  ></img>
                )}
              </button>

              <span className={'ml-2 mr-8'}>{post.likes?.length ?? 0}</span>
            </div>
            <div className="flex mr-2 text-gray-700 text-md">
              <button onClick={() => setShowComments(!showComments)}>
                <img
                  src="./assets/icons/comment.svg"
                  height={24}
                  width={24}
                  title="Comment"
                  alt="Comment"
                ></img>
              </button>

              <span className="ml-2 mr-8">{post.comments?.length ?? 0}</span>
            </div>
          </div>
        </div>
        {showComments && <ListComment {...post}></ListComment>}
      </div>
    </div>
  );
};

export default Post;
