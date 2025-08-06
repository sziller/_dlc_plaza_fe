import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token'; // Import the getToken function from AuthContext
import { AcceptOfferParams } from '../types/offerFace';

// This function sends a POST request to the server to accept an offer with the given parameters
// It returns the response data if successful, otherwise throws an error
// The token is retrieved from the AuthContext using the getToken function
// If the token is not available, an error is thrown
// The function handles different error status codes and throws appropriate errors
// The function also logs the error to the console
// The function is exported to be used in other components
export const acceptOffer = async (params: AcceptOfferParams) => {
  const token = getToken(); // Get the token from AuthContext
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.post(`${API_URL}/app/dlcp/v0/accept-offer`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error(`Bad Request: ${error.response.data.detail}`);
      } else if (error.response?.status === 422) {
        const errorDetail = error.response.data.detail;
        if (Array.isArray(errorDetail)) {
          throw new Error(errorDetail[0].msg);
        } else {
          throw new Error('Validation error: Check your input.');
        }
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response?.status === 500) {
        throw new Error('Internal Server Error');
      }
    }
    console.error('Error:', error);
    throw error;
  }
};