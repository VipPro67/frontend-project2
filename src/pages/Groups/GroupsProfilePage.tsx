import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { useParams } from 'react-router-dom';
import { IGroup, IPost, IUser } from '../../../types';
import { fetchGroupsById, fetchPostsByGroupId } from '../../api';
import Post from '../../components/Post';
import { checkJwt } from '../../../utils/auth';
import axios from 'axios';

const GroupsProfilePage = () => {
  const [listPost, setListPost] = useState<any | null>(null);
  const [currentUser, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupCreatePostOpen, setIsPopupCreatePostOpen] = useState(false);
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    window.location.href = '/sign-in';
  }

  const [postData, setPostData] = useState({
    title: '',
    description: '',
    tagNames: [] as string[],
    media: null as File | null,
    group_id: '' as string,
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

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('media', selectedMedia as File);
    formData.append('group_id', group?.id || '');
    postData.tagNames.forEach((tag, index) => {
      formData.append(`tagNames[${index}]`, tag);
    });
    try {
      const res = axios
        .post('http://localhost:3001/api/v1/posts', formData, {
          headers: {
            'Content-Type': 'form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          res.status === 200 && alert('Post created successfully');
          window.location.href = '/groups/' + group?.id;
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinGroup = () => {
    try {
      const res = axios
        .post(
          `http://localhost:3001/api/v1/groups/${group?.id}/join`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          res.status === 200 && alert('Leave group successfully');
          window.location.href = '/groups/' + group?.id;
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveGroup = () => {
    if (confirm('Are you sure you want to leave this group?') == false) {
      return;
    }

    try {
      const res = axios
        .post(
          `http://localhost:3001/api/v1/groups/${group?.id}/leave`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          res.status === 200 && alert('Leave group successfully');
          window.location.href = '/groups';
        });
    } catch (error) {
      console.log(error);
    }
  };

  const { id } = useParams<{ id: string }>();
  const groupsId = id;
  const [group, setGroup] = useState<IGroup | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await checkJwt();
      setUser(userData);
    };
    checkAuth();
    const fetchData = async () => {
      const response: IPost = await fetchPostsByGroupId(groupsId || '');
      setListPost({
        response,
      });
    };
    if (!listPost) {
      fetchData();
    }
    const fetchGroup = async () => {
      const response: any = await fetchGroupsById(groupsId || '');
      setGroup(response);
    };
    if (!group) {
      fetchGroup();
    }
  }, [listPost]);

  const showGroupMembers = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="  xl:p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between">
              <h1 className="text-lg font-medium text-gray-900">
                {group?.name} members
              </h1>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Close
              </button>
            </div>
            {group?.users?.map((user) => (
              <div className="flex justify-between border rounded m-2 p-2 max ">
                <div className="flex items-center">
                  <img
                    className="w-20 h-20 rounded-full"
                    src={
                      user.avatar
                        ? user.avatar
                        : 'https://via.placeholder.com/100'
                    }
                    alt=""
                  />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const showGroupInfo = () => {
    const isMember = group?.users?.find((user) => user.id == currentUser?.id);

    if (group) {
      return (
        <div className="flex flex-col">
          <img
            className=" w-32 h-32 rounded-full mx-auto"
            src={
              group.avatar && group.avatar != 'null'
                ? group.avatar
                : 'https://via.placeholder.com/100'
            }
            alt=""
          />
          <p className="text-lg font-medium text-gray-900 mx-auto">
            {group.name}
          </p>
          <button onClick={() => setIsModalOpen(true)}>
            <p className="text-md font-medium text-gray-900 m-2">
              {group.users?.length || 0} members
            </p>
          </button>

          <div className="">
            {isMember ? (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full float-right"
                onClick={handleLeaveGroup}
              >
                Leave
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full float-right"
                onClick={handleJoinGroup}
              >
                Join
              </button>
            )}
          </div>
        </div>
      );
    }
  };

  const showPopupCreatePost = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsPopupCreatePostOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="  xl:p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="grid grid-flow-row justify-center items-center">
              <h1 className="text-2xl font-bold">
                Create Post in {group?.name}
              </h1>
              <div className=" w-full mx-auto">
                <form className="grid grid-flow-row mx-2">
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
                        setPostData({
                          ...postData,
                          description: e.target.value,
                        })
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
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white rounded-md p-2 mt-2"
                    onClick={handleSubmit}
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <div className=" xl:col-span-10  xl:p-2 xl:rounded-xl  bg-white xl:m-2 ">
        <div className=" gird">
          {showGroupInfo()}
          {isModalOpen ? showGroupMembers() : null}
          {
            group?.users?.find((user) => user.id == currentUser?.id) ? (
              <div className="flex justify-start">
                <button
                  className="bg-blue-500 text-white rounded-md p-2 mt-2 "
                  onClick={() => setIsPopupCreatePostOpen(true)}
                >
                  Create Post
                </button>
              </div>
            ) : null 
          }
          {isPopupCreatePostOpen ? showPopupCreatePost() : null}
          <div className="grid ">
            {listPost
              ? listPost.response.map((post: any) => (
                  <Post key={post.id} {...post} />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsProfilePage;
