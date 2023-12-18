import { useEffect, useState } from 'react';
import { IPet, IPost, IUser } from '../../../types';
import LeftSidebar from '../../components/LeftSidebar';
import Post from '../../components/Post';
import {
  fetchPetsByUserId,
  fetchPostsByUserId,
  fetchUsersById,
} from '../../api';
import { checkJwt } from '../../../utils/auth';
import Pet from '../../components/Pet';

const ProfilePage = () => {
  const userId = window.location.pathname.split('/')[2];
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState([]);
  const [pets, setPets] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [view, setView] = useState('post');
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
    };
    fetchPosts();

    //get user pets
    const fetchPets = async () => {
      const petsData = await fetchPetsByUserId(userId);
      setPets(petsData);
    };

    fetchPets();
    //check user auth to show edit profile
    const checkAuth = async () => {
      const userData = await checkJwt();
      if (userData?.id === userId) {
        setShowEditProfile(true);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <div className=" xl:col-span-10 xl:p-2 xl:rounded-xl bg-white xl:m-2">
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
                <Pet {...pet} />
              ))}
            </div>
          ))}
      </div>
      <div></div>
    </div>
  );
};

export default ProfilePage;
