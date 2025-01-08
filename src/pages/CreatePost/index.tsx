import axios from 'axios';
import LeftSidebar from '../../components/LeftSidebar';
import { useState } from 'react';
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
        alert('Tag already exists');
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
      axios
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
    <div className="xl:col-span-10 xl:p-6 xl:rounded-xl bg-white xl:m-2 shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create Post
      </h1>
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={postData.description}
              onChange={(e) =>
                setPostData({ ...postData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="tags"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap mt-2">
              {postData.tagNames.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 text-sm font-semibold rounded-full py-1 px-3 m-1 flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    title="Remove tag"
                    className="ml-2 focus:outline-none"
                    onClick={() => {
                      setPostData({
                        ...postData,
                        tagNames: postData.tagNames.filter((t) => t !== tag),
                      });
                    }}
                  >
                    <svg
                      className="w-4 h-4 text-gray-500 hover:text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Media
            </label>
            <input
              type="file"
              id="image"
              accept=".jpg,.png,.jpeg,.mp4,.avi,.mkv,video/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
            />
          </div>
        </form>
        <div className="mt-6">
          <button
            className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSubmit}
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

const CreatePostPage = () => {
  return (
    <div className="xl:grid xl:grid-cols-12 bg-gray-100 min-h-screen">
      <LeftSidebar />
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;
