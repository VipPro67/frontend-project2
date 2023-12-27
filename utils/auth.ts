import axios from 'axios';
import { IUser } from '../types';

const getJwtToken = () => localStorage.getItem('access_token');

let cachedUser: IUser | null = null;

export const checkJwt = async () => {
  // Check if user information is already cached
  if (cachedUser) {
    return cachedUser;
  }
  
  const token = getJwtToken();

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      // Check if the token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTimestamp) {
        console.error('JWT token has expired');
        localStorage.removeItem('access_token');
        return null;
      }

      //When the token is valid get new token using refresh token if it is expired
      if (decodedToken.exp < currentTimestamp + 300) {
        try {
          const response = await axios.post('http://localhost:3001/auth/refresh-token', {
            refreshToken: localStorage.getItem('refresh_token'),
          });
          const data = response.data;

          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
        } catch (error) {
          console.error('Error refreshing token:', error);
          return null;
        }
      }

      // Token is valid, fetch user data using Axios
      const response = await axios.get('http://localhost:3001/api/v1/users/my-profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      // Cache the user information
      cachedUser = data;

      return cachedUser;
    } catch (error) {
      console.error('Error decoding or fetching data from JWT:', error);
      return null;
    }
  }

  return null;
};
