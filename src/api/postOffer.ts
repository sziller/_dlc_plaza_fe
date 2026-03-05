import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token'; // Import the getToken function from AuthContext
import { PostOfferParams } from '../types/offerFace';

// This function sends a POST request to the server to post an offer with the given parameters
// It returns the response data if successful, otherwise throws an error
// The token is retrieved from the AuthContext using the getToken function
// If the token is not available, an error is thrown
// The function handles different error status codes and throws appropriate errors
// The function also logs the error to the console
export const postOffer = async (params: PostOfferParams) => {
  const token = getToken(); // Get the token from AuthContext
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.post(`${API_URL}/app/dlcp/v0/offer`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        const errorDetail = error.response.data.detail;
        if (Array.isArray(errorDetail)) {
          throw new Error(errorDetail[0].msg);
        } else if (errorDetail === 'NON_UNIQUE') {
          throw new Error('400 - NON_UNIQUE: The tmp_cntr_id is already in use.');
        } else {
          throw new Error(`Bad Request: ${errorDetail}`);
        }
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response?.status === 500) {
        throw error;
      }
    }
    console.error('Error:', error);
    throw error;
  }
};