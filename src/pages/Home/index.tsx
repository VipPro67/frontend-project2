import { Link } from 'react-router-dom';
const HomePage = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-screen-lg mx-auto flex flex-col items-center">
        <Link to="/" className="text-white text-2xl font-bold mb-4">
          Your Social Network
        </Link>

        <div className="flex flex-col space-y-4">
          <Link to="/articles" className="text-white">
            Articles
          </Link>
          <Link to="/friends" className="text-white">
            Friends
          </Link>
          <Link to="/groups" className="text-white">
            Groups
          </Link>
          {/* Add more links for other features as needed */}
        </div>
      </div>
    </nav>
  );
};

export default HomePage;
