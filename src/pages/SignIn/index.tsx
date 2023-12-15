import { useState } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Assuming your API response includes access_token and refresh_token
        const { access_token, refresh_token } = data;

        // Handle successful sign-in, e.g., store tokens in state or local storage
        console.log('Sign-in successful');
        //save assess token, refreshtoken into localstorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        window.location.href = '/';

        // Additional actions like redirect or updating user state can be done here
      } else {
        // Handle authentication failure, show error message, etc.
        console.error('Sign-in failed');

        //show error message
        const textHelper = document.getElementById('texthelper');
        textHelper?.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
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
            >
              Email or password is incorrect
            </p>
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
