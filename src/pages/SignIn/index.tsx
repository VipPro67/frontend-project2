import axios from 'axios';
import { useEffect, useState } from 'react';
import { checkJwt } from '../../../utils/auth';
const API_URL = import.meta.env.VITE_API_URL;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    async function checkHadUser() {
      if (await checkJwt()) window.location.href = '/';
    }

    checkHadUser();
  }, []);

  const handleSignIn = async () => {
    // Check if email and password are not empty
    if (!email || !password) {
      const textHelper = document.getElementById('texthelper');
      textHelper?.classList.remove('hidden');
      // Show error message in text helper

      textHelper
        ? (textHelper.innerText = 'Email or password must not be empty')
        : null;
      return;
    }

    await axios
      .post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
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
          <h3 className="text-lg font-semibold">Sign In</h3>
          <div>
            <label className="block py-1">
              Your email
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const passwordInput = document.getElementById(
                      'password'
                    ) as HTMLInputElement;
                    passwordInput.focus();
                  }
                }}
              ></input>
            </label>
            <p
              className="text-sm mt-2 px-2 hidden text-red-600"
              id="texthelper"
            ></p>
          </div>
          <div>
            <label className="block py-1">
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSignIn();
                  }
                }}
              ></input>
            </label>
          </div>
          <div className="xl:flex gap-3 pt-3 justify-between">
            <button
              onClick={handleSignIn}
              className="border hover:border-indigo-600 px-4 py-2 rounded-lg shadow ring-1 ring-inset ring-gray-300"
            >
              Sign in
            </button>
            <p>
              Don't have an account?{' '}
              <a href="../sign-up" className="text-blue-500 underline">
                Sign up
              </a>
            </p>
          </div>
          <p className="text-center">
            I don't want to create an account yet.{' '}
            <a href="../" className="text-blue-500 underline">
              Return to home page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
