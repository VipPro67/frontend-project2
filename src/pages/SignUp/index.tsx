import axios from 'axios';
import { useEffect, useState } from 'react';
import { checkJwt } from '../../../utils/auth';
const API_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFristName] = useState('');
  const [lastName, setLastName] = useState('');
  useEffect(() => {
    async function checkHadUser() {
      if (await checkJwt()) window.location.href = '/';
    }

    checkHadUser();
  }, []);
  const handleSignUp = async () => {
    // Check if information are not empty
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      const textHelper = document.getElementById('texthelper');
      textHelper?.classList.remove('hidden');
      // Show error message in text helper

      textHelper
        ? (textHelper.innerText = 'All fields must not be empty')
        : null;
      return;
    }
    // Check if password and confirm password are the same
    if (password !== confirmPassword) {
      const textHelper = document.getElementById('texthelper');
      textHelper?.classList.remove('hidden');
      // Show error message in text helper

      textHelper
        ? (textHelper.innerText =
            'Password and confirm password must be the same')
        : null;
      return;
    }

    await axios
      .post(
        `${API_URL}/auth/register`,
        {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          const { access_token, refresh_token } = response.data;

          // Handle successful sign-up, e.g., store tokens in state or local storage
          console.log('Sign-in successful');

          // Save access token and refresh token into local storage
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          window.location.href = '/';

          // Additional actions like redirect or updating user state can be done here
        }
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
        const textHelper = document.getElementById('texthelper');
        textHelper?.classList.remove('hidden');
        textHelper
          ? (textHelper.innerText = error.response.data.message)
          : null;
      });
  };
  return (
    <div className="flex items-center justify-center min-h-screen from-purple-900 via-indigo-800 to-indigo-500 bg-gradient-to-br">
      <div className="w-full max-w-lg p-2 xl:px-10 xl:py-8 mx-auto bg-white border rounded-lg shadow-2xl">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-lg font-semibold">Sign Up</h3>
          <p
            className="text-sm mt-2 px-2 hidden text-red-600"
            id="texthelper"
          ></p>{' '}
          <div>
            <label className="block py-1">
              First name
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFristName(e.target.value)}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              ></input>
            </label>
            <label className="block py-1">
              Last name
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              ></input>
            </label>
            <label className="block py-1">
              Your email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              ></input>
            </label>
          </div>
          <div>
            <label className="block py-1">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              ></input>
            </label>
            <label className="block py-1">
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              ></input>
            </label>
          </div>
          <div className="flex gap-3 pt-3 justify-between">
            <p className="text-left">
              I don't want to create an account yet.{' '}
              <a href="../" className="text-blue-500 underline">
                <p>Return to home page</p>
              </a>
            </p>
            <button
              onClick={handleSignUp}
              className="border hover:border-indigo-600 px-4 py-2 rounded-lg shadow ring-1 ring-inset ring-gray-300"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
