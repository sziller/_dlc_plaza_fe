import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token';
import { UserOwnDerivedBalance } from '../types/userFace';

// This function fetches the user's derived balance from the API
export const getOwnDerivedBalance = async (): Promise<UserOwnDerivedBalance> => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_URL}/app/auth/balance-own-derived`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    // console.log('API Response:', response.data); // Debugging: Log the API response
    return response.data as UserOwnDerivedBalance;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        throw new Error(`400 Bad Request: ${error.response.data.message}`);
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