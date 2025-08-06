import axios from 'axios';
import { API_URL, CLIENT_ID, CLIENT_SECRET } from '../config'; // Import API_URL, CLIENT_ID, and CLIENT_SECRET from config
import { saveToken, getToken, removeToken } from './token'; // Import token functions


// this function is used to get the authentication token from the server
// it takes the user email and password as input and returns the token
// it also saves the token to memory using the saveToken function
// it throws an error if the request fails or the response is invalid
// it also logs the error to the console
export const getAuthToken = async (
  email: string,
  password: string,
  timeout: number = 300000
): Promise<string> => {
  try {
    console.log('API_URL:', API_URL); // Konzolra írja az API_URL értékét
    const data = new URLSearchParams({
      grant_type: 'password',
      username: email,
      password,
      scope: '',
      client_id: CLIENT_ID || '',
      client_secret: CLIENT_SECRET || '',
    });

    const response = await axios.post(`${API_URL}/app/auth/token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      timeout,
    });

    const token = response.data.access_token;
    saveToken(token);

    if (process.env.NODE_ENV === 'development') {
      console.log('Token successfully retrieved and saved to memory');
    }
    return token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('The request took too long - please try again later.');
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error(`${error.response.data.detail}`);
          case 422:
            const errorDetail = error.response.data.detail;
            if (Array.isArray(errorDetail)) {
              throw new Error(errorDetail[0].msg);
            } else {
              throw new Error('Validation error: Check your input.');
            }
          default:
            throw new Error('An error occurred. Please try again.');
        }
      } else {
        throw new Error('No response received. Please try again.');
      }
    } else {
      throw new Error(
        error instanceof Error ? error.message : 'Unexpected error occurred.'
      );
    }
  }
};

// this function is used to log out the user by removing the token from memory
// and removing the user email from local storage
export const logout = () => {
  removeToken();
  sessionStorage.clear();
  console.log('Token and user email removed');
};

// this function is used to check if the user is logged in
// it returns true if the user is logged in and false if not
export const isLoggedIn = () => {
  const token = getToken();
  return !!token;
};

// this function is used to confirm the registration
// it takes a token as input and returns the email and password
// it throws an error if the request fails or the response is invalid
// it also logs the error to the console
export const confirmRegistration = async (
  token: string
): Promise<{ email: string; password: string }> => {
  try {
    const response = await axios.get(
      `${API_URL}/app/auth/confirm-registration`,
      {
        params: { token },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorDetail = error.response.data.detail;
        if (Array.isArray(errorDetail)) {
          throw new Error(errorDetail[0].msg);
        } else {
          throw new Error(
            `${errorDetail}` ||
              'An error occurred during registration confirmation.'
          );
        }
      } else {
        throw new Error('No response received. Please try again.');
      }
    } else {
      throw new Error(
        error instanceof Error ? error.message : 'Unexpected error occurred.'
      );
    }
  }
};