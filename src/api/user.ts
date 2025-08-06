import axios from 'axios';
import API_URL  from '../config';
import { UserFace } from '../types/userFace';

// This function sends a POST request to the server to register a new user
// It returns void if successful, otherwise throws an error
// The function is exported to be used in other components
// The function is used to register a new user
// The function handles different error status codes and throws appropriate errors
// The function also logs the error to the console
export const registerUser = async (user: UserFace): Promise<void> => {
  try {
    await axios.post(`${API_URL}/app/auth/new-user`, user);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorDetail = error.response.data.detail;
        if (Array.isArray(errorDetail)) {
          throw new Error(errorDetail[0].msg);
        } else {
          throw new Error(errorDetail);
        }
      } else {
        throw new Error('An unexpected error occurred.');
      }
    } else {
      throw new Error('Unexpected error occurred.');
    }
  }
};