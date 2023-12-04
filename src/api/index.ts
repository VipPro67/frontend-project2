import axios from 'axios';
import { checkJwt } from '../../utils/auth';
import { IUser } from '../../types';

export async function fetchPosts() {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/posts');
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function fetchPostsRecomendation(id: string) {
  try {
    const user: IUser | null = await checkJwt();
    if (user) {
      const response = await axios.get(
        `http://localhost:3001/api/v1/posts/recommended`
      );
      console.log(response);
      return response.data;
    }
    const response = await axios.get(
      `http://localhost:3001/api/v1/posts/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
}

export async function fetchCommentsByPostId(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/comments/post/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${id}:`, error);
    throw error;
  }
}

export async function fetchPostsByUserId(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/posts/user/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for user ${id}:`, error);
    throw error;
  }
}

export async function fetchUsersById(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/users/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function fetchCommentsByUserId(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/comments/user/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for user ${id}:`, error);
    throw error;
  }
}

export async function fetchFriendsRequest() {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/relationships/my-friends`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching friends request for user:`, error);
    throw error;
  }
}

export async function fetchMyPets() {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/pets/my-pets`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching my pet:`, error);
    throw error;
  }
}
