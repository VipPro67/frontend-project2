import { useEffect, useState } from 'react';
import { IPost, IUser } from '../../../types';
import LeftSidebar from '../../components/LeftSidebar';
import Post from '../../components/Post';
import { fetchPostsByUserId, fetchUsersById } from '../../api';
import { checkJwt } from '../../../utils/auth';

const ProfilePage = () => {
  const userId = window.location.pathname.split('/')[2];
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const handleEditProfile = async () => {
    try {
      await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(user),
      });
      setShowEditProfile(false);
    } catch (error) {
      console.log(error);
    }
  };

  //get user data
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchUsersById(userId);
      setUser(userData);
    };
    fetchUser();

    //get user posts
    const fetchPosts = async () => {
      const postsData = await fetchPostsByUserId(userId);
      setPosts(postsData);
      console.log(postsData);
    };
    fetchPosts();

    //check user auth to show edit profile
    const checkAuth = async () => {
      const userData = await checkJwt();
      if (userData?.id === userId) {
        setShowEditProfile(true);
      }
    };
    checkAuth();
  }, [userId]);

  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <div className=" xl:col-span-7 xl:p-2 xl:rounded-xl bg-white xl:m-2">
        <div className="max-w-2xl mx-auto">
          <div className="px-3 py-2">
            <div className="flex flex-col gap-1 text-center">
              <a
                className="block mx-auto bg-center bg-no-repeat bg-cover w-20 h-20 rounded-full border border-gray-400 shadow-lg"
                href=""
              >
                <img
                  src={user?.avatar || './default-avatar.png'}
                  alt="avatar"
                  className="w-full h-full rounded-full"
                />
              </a>
              <p className="font-semibold text-xl">
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
                <span className="text-gray-400">Folowing</span>
              </div>
            </div>
            {showEditProfile ? (
              <div className="flex flex-col gap-2">
                <input 
                  type="text"
                  className="border border-gray-300 rounded-md p-2"
                  value={user?.first_name}
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2"
                  value={user?.last_name}
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2"
                  value={user?.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <button
                  className="bg-pink-500 px-10 py-2 rounded-full text-white shadow-lg"
                  onClick={handleEditProfile}
                >
                  Save
                </button>
              </div>
            ) : (
              ''
            )}

            <div className="flex justify-center gap-2 my-5">
              <button className="bg-pink-500 px-10 py-2 rounded-full text-white shadow-lg">
                Follow
              </button>
              <button className="bg-white border border-gray-500 px-10 py-2 rounded-full shadow-lg">
                Message
              </button>
            </div>
          </div>
        </div>
        {
          //show user posts
          posts.map((post: IPost) => (
            <Post {...post} />
          ))
        }
      </div>
      <div></div>
    </div>
  );
};

export default ProfilePage;
