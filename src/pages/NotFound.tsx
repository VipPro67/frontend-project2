import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full p-8 text-center h-[95vh]">
      <h1 className="text-2xl mb-4">
        Sorry, the page you were looking for was not found.
      </h1>
      <div className='flex justify-between'>
        <Link
          to="/"
          className="border-none text-center px-3 py-2 inline-block rounded-sm bg-green-800 text-white"
        >
          Return to Home
        </Link>

        <Link
          to="/sign-in"
          className="border-none text-center px-3 py-2 inline-block rounded-sm bg-[#6366f1] text-white"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
