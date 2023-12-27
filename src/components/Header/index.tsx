import { useState, useEffect } from 'react'; // Import React and useEffect
import { Link } from 'react-router-dom';
import { IUser } from '../../../types';
import { checkJwt } from '../../../utils/auth';

const Header = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [showAllChat, setShowAllChat] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [listConversation, setListConversation] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkJwt();
      setUser(userData);
    };

    fetchUser();

    const fetchConversation = async () => {
      const response = await fetch(
        'http://localhost:3001/api/v1/messages/conversations',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      const data = await response.json();
      setListConversation(data);
    };
  }, []); // Run once when the component mounts

  return (
    <header className=" xl:sticky xl:top-0 z-10 flex items-center px-4 text-xl w-full bg-clip-border rounded-xl bg-gray-100 flex-wrap justify-between md:justify-between mx-auto p-1">
      <Link to="/" className="text-2xl font-bold text-green-900/70">
        #PETMD
      </Link>

      <div className="block gap-2">
        {user ? (
          <Link to="/messager">
            <button className="justify-center md:inline-flex mr-8">
              <img
                src="https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/chat.svg"
                alt="Chat"
                width={30}
                height={30}
              />
            </button>
          </Link>
        ) : null}
        {user ? (
          <Link to={`/profile/${user.id}`}>
            <button className="justify-center md:inline-flex h-12 w-12">
              <img
                src={user?.avatar || './default-avatar.png'}
                alt="Profile"
                height={45}
                width={45}
                className="rounded-full border h-[45px] w-[45px]"
              />
            </button>
          </Link>
        ) : (
          <Link to="/sign-in">
            <button className="border hover:border-indigo-600 bg-indigo-500 text-white px-2 py-1 rounded-lg shadow ring-1 ring-inset ring-gray-300">
              Sign in
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
