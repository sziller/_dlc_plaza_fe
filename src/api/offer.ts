import axios from 'axios';
import  {API_URL}  from '../config';
import { getToken } from './token';
import { OfferResponse } from '../types/offerFace';

// This function sends a GET request to the server to get an offer by ID
// It returns the response data if successful, otherwise throws an error
// The token is retrieved from the token context using the getToken function
// If the token is not available, an error is thrown
// The function handles different error status codes and throws appropriate errors
// The function also logs the error to the console
export const getOfferById = async (dlc_id: string): Promise<OfferResponse> => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_URL}/app/dlcp/v0/offer-by-id`, {
      params: { dlc_id },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    // console.log('API Response:', response.data); // Check the API response
    return response.data as OfferResponse;
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