import LeftSidebar from '../../components/LeftSidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IUser } from '../../../types';
import { checkJwt } from '../../../utils/auth';
const API_URL = import.meta.env.VITE_API_URL;

const CreatePost = () => {
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    tagNames: [] as string[],
    media: null as File | null,
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

    postData.tagNames.forEach((tag, index) => {
      formData.append(`tagNames[${index}]`, tag);
    });
    try {
      const res = axios
        .post(`${API_URL}/api/v1/posts`, formData, {
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

  return (
    <div className="xl:col-span-10 xl:p-2 xl:rounded-xl bg-white xl:m-2 h-{full-2rem}">
      <div className="grid grid-flow-row justify-center items-center">
        <h1 className="text-2xl font-bold">Create Post</h1>
        <div className="lg:w-1/2 mx-auto">
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
                onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
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
  );
};

const CreatePostPage = () => {
  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <CreatePost />
      <div></div>
    </div>
  );
};

export default CreatePostPage;
