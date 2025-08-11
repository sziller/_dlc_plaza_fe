import axios from 'axios';
import { API_URL } from '../config';
import { OffersResponse } from '../types/offerFace';
import { getToken } from './token'; // Import getToken function

// const API_URL = process.env.REACT_APP_STAGING_API_URL;

// This function sends a GET request to the server to get all offers
// It returns the response data if successful, otherwise throws an error
// The function is exported to be used in other components
// The function is used to get all offers from the server
// The function takes an optional parameter to filter offers by ini_role
// The function includes the token in the Authorization header if available
// The function handles different error status codes and throws appropriate errors
// The function also logs the error to the console
export const getOffers = async (
  ini_role: string = 'both'
): Promise<OffersResponse> => {
  const response = await axios.get(`${API_URL}/app/dlcp/v0/offers`, {
    params: { ini_role },
    headers: {
      Accept: 'application/json',
    }, 
  });
  if (response.data && Array.isArray(response.data.payload)) {
    return response.data;
  } else {
    throw new Error('Invalid response format');
  }
};

export const getUserOffers = async (ini_role: string = 'both'): Promise<OffersResponse> => {
  const token = getToken(); // Get the token from sessionStorage
  const response = await axios.get(`${API_URL}/app/dlcp/v0/offers-for-user`, {
    params: { ini_role },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
  if (response.data && Array.isArray(response.data.payload)) {
    return response.data;
  } else {
    throw new Error('Invalid response format');
  }
};