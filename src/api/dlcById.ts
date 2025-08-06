import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token';
import { DlcDetailsProps } from '../types/dlcFace';

// This function fetches the details of a DLC by its ID from the API
// It uses the axios library to make the HTTP GET request
// It returns a promise that resolves to the DLC details
// It handles errors by checking the response status and throwing appropriate error messages
export const getDlcById = async (dlc_id: string): Promise<DlcDetailsProps> => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_URL}/app/dlcp/v0/user-dlc-by-id`, {
      params: { dlc_id },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    // console.log('API Response:', response.data); // Check the API response
    return response.data as DlcDetailsProps;
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