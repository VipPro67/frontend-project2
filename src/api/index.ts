import axios from 'axios';

export async function fetchPosts() {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function fetchPostsRecomendation() {
  try {
    if (localStorage.getItem('access_token') !== null) {
      const response = await axios.get(
        `http://localhost:3001/api/v1/posts/recommended`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      return response.data;
    } else {
      const response = await axios.get(`http://localhost:3001/api/v1/posts`);
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching post:`, error);
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

export async function fetchFriendsSearch(name: string) {
  try {
    if (name === '') {
      return [];
    }
    const response = await axios.get(
      `http://localhost:3001/api/v1/users?search=${name}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching friends for user:`, error);
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

export async function fetchPetsByUserId(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/pets/user/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching pets for user ${id}:`, error);
    throw error;
  }
}

export async function fetchPetsById(id: string) {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/pets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pets ${id}:`, error);
    throw error;
  }
}

export async function fetchPetsSearch(search: string) {
  try {
    if (search === '') {
      return [];
    }

    const response = await axios.get(
      `http://localhost:3001/api/v1/pets?search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching pets `);
    throw error;
  }
}

export async function fetchPetsPair(id: string) {
  try {
    if (id === '') {
      return [];
    }

    const response = await axios.get(
      `http://localhost:3001/api/v1/pets/pairing/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching pets `);
    throw error;
  }
}

export async function fetchGroupsSearch(search: string) {
  try {
    if (search === '') {
      return [];
    }
    const response = await axios.get(
      `http://localhost:3001/api/v1/groups?search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching groups `);
    throw error;
  }
}

export async function fetchGroupsByUserId(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/groups/user/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching groups for user ${id}:`, error);
    throw error;
  }
}

export async function fetchGroupsById(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/groups/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching groups ${id}:`, error);
    throw error;
  }
}

export async function fetchMyGroups() {
  try {
    const response = await axios.get(
      'http://localhost:3001/api/v1/groups/my-groups',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
}

export async function fetchPostsByUserGroups() {
  try {
    const response = await axios.get(
      'http://localhost:3001/api/v1/posts/user/group',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
}

export async function fetchPostsByGroupId(id: string) {
  try {
    if (!id) {
      return [];
    }
    const response = await axios.get(
      `http://localhost:3001/api/v1/posts/group/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for group ${id}:`, error);
    throw error;
  }
}

export async function fetchAllMyConservation() {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/messages/conversations/all`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching conversation:`, error);
    throw error;
  }
}
