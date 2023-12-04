import { IUser } from '../types';

const getJwtToken = () => localStorage.getItem('access_token');

// Function to check JWT and decode it
export const checkJwt = async () => {
  let user: IUser = {
    id: '',
    first_name: '',
    last_name: '',
    avatar: '',
  };
  const token = getJwtToken();

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      // Check if the token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTimestamp) {
        console.error('JWT token has expired');
        return null;
      }

      // Token is valid, fetch user data
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const response = await fetch(
        `http://localhost:3001/api/v1/users/my-profile`,
        {
          method: 'GET',
          headers: myHeaders,
        }
      );
      const data = await response.json();
      user = data;
      return user;
    } catch (error) {
      console.error('Error decoding or fetching data from JWT:', error);
      return null;
    }
  }
  return null;
};
