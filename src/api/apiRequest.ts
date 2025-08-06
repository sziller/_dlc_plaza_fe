import axios from 'axios';
import { API_URL } from '../config';
import { getAuthToken, saveToken, getToken } from '../api/apiUtils';

// This function sends a GET request to the server with the given endpoint and token
// It returns the response message if successful, otherwise throws an error
// The function logs the error to the console
// The function is exported to be used in other components
// The function is used to handle API requests that do not require authentication
// It sends the API request and handles the response
export const handleApiRequest = async (
  endpoint: string,
  token?: string
): Promise<string> => {
  try {
    const apiUrl = `${API_URL}${endpoint}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(apiUrl, { headers });
    if (process.env.NODE_ENV === 'development') {
      console.log('API request successful:', response.status);
    }
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API request failed with status:', error.response.status);
        if (process.env.NODE_ENV === 'development') {
          console.error(
            'Error details:',
            error.response.data.message || 'No message available'
          );
        }
      } else if (error.request) {
        console.error('No response received during API request.');
      }
    } else {
      console.error(
        'Unexpected error:',
        error instanceof Error ? error.message : error
      );
    }
    throw new Error('Failed to process API request. Please try again.');
  }
};

// This function sends a GET request to the server with the given endpoint and token
// It returns the response message if successful, otherwise throws an error
// The function logs the error to the console
// The function is exported to be used in other components
//  The function is used to handle API requests that require authentication
// It first checks if a token is available, and if not, it retrieves a new token using the getAuthToken function
// It then saves the token using the saveToken function
// It sends the API request with the token and handles the response
// The function also logs the error to the console
export const handleApiRequestWithAuth = async (
  endpoint: string,
  email: string,
  password: string,
  setLoading: (loading: boolean) => void
) => {
  if (!email || !password) {
    alert('Email and password are required');
    return;
  }

  setLoading(true);
  try {
    let token = getToken();
    if (!token) {
      token = await getAuthToken(email, password);
      saveToken(token);
    }
    console.log('JWT token:', token);
    const message = await handleApiRequest(endpoint, token);
    alert(`API response message: ${message}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API request failed with status:', error.response.status);
        console.error(
          'Error details:',
          error.response.data.message || 'No message available'
        );
      } else if (error.request) {
        console.error('No response received during API request.');
      }
    } else {
      console.error(
        'Unexpected error:',
        error instanceof Error ? error.message : error
      );
    }
    alert('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
