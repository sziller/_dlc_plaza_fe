import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token';
import { UserProfileResponse } from '../types/userFace';

// This function sends a GET request to the server to get the user's profile
// It returns the response data if successful, otherwise throws an error
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_URL}/app/auth/users-own-profile`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data as UserProfileResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        throw new Error(`400 Bad Request: ${error.response.data.detail}`);
      } else if (error.response && error.response.status === 401) {
        throw new Error('401 Unauthorized Error: Invalid or expired token.');
      } else {
        throw new Error(
          '500 Internal Server Error: Operation failed due to unforeseen circumstances.'
        );
      }
    } else {
      throw new Error('Unexpected error occurred.');
    }
  }
};
