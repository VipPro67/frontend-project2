import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IPet, IPost, IUser } from '../../../types';
import { checkJwt } from '../../../utils/auth';
import {
  fetchPetsByUserId,
  fetchPostsByUserId,
  fetchUsersById,
} from '../../api';
import LeftSidebar from '../../components/LeftSidebar';
import Pet from '../../components/Pet';
import Post from '../../components/Post';
const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const userId = window.location.pathname.split('/')[2];
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [pets, setPets] = useState<IPet[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [view, setView] = useState('post');
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [createFirstName, setCreateFirstName] = useState<string | null>(null);
  const [createLastName, setCreateLastName] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await checkJwt();
      setCurrentUser(currentUser);
      if (currentUser?.id === userId) {
        setShowEditProfile(true);
      }

      const userData = await fetchUsersById(userId);
      setUser(userData);

      const postsData = await fetchPostsByUserId(userId);
      setPosts(postsData);

      const petsData = await fetchPetsByUserId(userId);
      setPets(petsData);
    };

    fetchData();
  }, [userId]);

  const handlerSubmit = async () => {
    const formData = new FormData();
    if (selectedMedia) {
      formData.append('avatar', selectedMedia);
      await axios.post(`${API_URL}/api/v1/users/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    }

    const response = await axios.put(
      `${API_URL}/api/v1/users/${userId}`,
      {
        first_name: createFirstName || user?.first_name,
        last_name: createLastName || user?.last_name,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    if (response.status === 200) {
      alert('Edit profile success');
      window.location.reload();
    }

    setShowEditModal(false);
  };

  const handlerChangeSubmit = async () => {
    const newPassword = (
      document.getElementById('new-password') as HTMLInputElement
    ).value;
    const confirmPassword = (
      document.getElementById('confirm-password') as HTMLInputElement
    ).value;

    if (newPassword !== confirmPassword) {
      alert('Confirm password is not match');
      return;
    }

    const response = await axios.put(
      `${API_URL}/api/v1/users/${userId}`,
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    if (response.status === 200) {
      alert('Edit profile success');
      window.location.reload();
    }
  };

  const EditProfileModal = () => (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={() => setShowEditModal(false)}
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
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="grid">
            <img
              className="mx-auto border rounded-full w-24 h-24"
              height={96}
              width={96}
              src={user?.avatar || './default-avatar.png'}
              alt="Group Image"
            />
            <p className="text-center text-2xl font-bold">
              {createFirstName || user?.first_name}{' '}
              {createLastName || user?.last_name}
            </p>
          </div>
          <form className="w-full max-w-lg p-2">
            <div className="grid mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="first-name"
                >
                  First Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="first-name"
                  type="text"
                  placeholder={user?.first_name}
                  value={createFirstName || user?.first_name}
                  onChange={(e) => setCreateFirstName(e.target.value)}
                />
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="last-name"
                >
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="last-name"
                  type="text"
                  placeholder={user?.last_name}
                  value={createLastName || user?.last_name}
                  onChange={(e) => setCreateLastName(e.target.value)}
                />
              </div>
              <div className="w-full px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="pet-image"
                >
                  Image
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="pet-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedMedia(e.target.files?.[0] || null)
                  }
                />
              </div>
              <div className="flex justify-end p-2">
                <p
                  className="underline text-blue-500 cursor-pointer"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowEditPasswordModal(true);
                  }}
                >
                  Change password
                </p>
              </div>
            </div>
          </form>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"></div>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handlerSubmit}
          >
            Edit
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const EditPasswordModal = () => (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={() => setShowEditModal(false)}
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
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <p className="text-center text-2xl font-bold p-2">Change Password</p>
          <form className="w-full max-w-lg p-2">
            <div className="grid mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="new-password"
                >
                  New Password
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="new-password"
                  type="password"
                  placeholder="New Password"
                />
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </form>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handlerChangeSubmit}
            >
              Change Password
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setShowEditPasswordModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <div className="xl:col-span-10 xl:p-2 xl:rounded-xl bg-white xl:m-2">
        <div className="flex justify-end items-center">
          {showEditProfile && (
            <button
              className="rounded-md font-semibold text-white fl"
              onClick={() => setShowEditModal(true)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2040/2040504.png"
                alt="edit"
                className="w-8 h-8"
              />
            </button>
          )}
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="px-3 py-2">
            <div className="flex flex-col gap-1 text-center">
              <img
                src={user?.avatar || './default-avatar.png'}
                alt="avatar"
                className="mx-auto rounded-full border h-24 w-24"
              />
              <p className="font-semibold text-xl p-2 m-1">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
            <div className="flex justify-center items-center gap-2 my-3">
              <div className="font-semibold text-center mx-4">
                <p className="text-black">102</p>
                <span className="text-gray-400">Posts</span>
              </div>
              <div className="font-semibold text-center mx-4">
                <p className="text-black">102</p>
                <span className="text-gray-400">Followers</span>
              </div>
              <div className="font-semibold text-center mx-4">
                <p className="text-black">102</p>
                <span className="text-gray-400">Following</span>
              </div>
            </div>
            <div className="flex justify-center gap-2 my-5">
              <button
                className={`${
                  view === 'post' ? 'bg-blue-500' : 'bg-gray-200'
                } px-4 py-2 rounded-md font-semibold text-white`}
                onClick={() => setView('post')}
              >
                Post
              </button>
              <button
                className={`${
                  view === 'pet' ? 'bg-blue-500' : 'bg-gray-200'
                } px-4 py-2 rounded-md font-semibold text-white`}
                onClick={() => setView('pet')}
              >
                Pet
              </button>
              <Link to={`/messager?user=${user?.id}`}>
                <button className="bg-green-500 px-4 py-2 rounded-md font-semibold text-white">
                  Chat Now
                </button>
              </Link>
            </div>
          </div>
        </div>
        {view === 'post' &&
          (posts.length === 0 ? (
            <p>No post</p>
          ) : (
            posts.map((post: IPost) => <Post key={post.id} {...post} />)
          ))}
        {view === 'pet' &&
          (pets.length === 0 ? (
            <p>No pet</p>
          ) : (
            <div className="mx-3 mb-6 gap-1 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
              {pets.map((pet: IPet) => (
                <Pet key={pet.id} {...pet} />
              ))}
            </div>
          ))}
        {showEditModal && <EditProfileModal />}
        {showEditPasswordModal && <EditPasswordModal />}
      </div>
    </div>
  );
};

export default ProfilePage;
