import axios from 'axios';
import { ORACLE_API_URL } from '../config';

// const ORACLE_API_URL = process.env.REACT_APP_ORACLE_API_URL;

// This function sends a GET request to the server to get the current price list
// It returns the response data if successful, otherwise throws an error
export const getPriceList = async () => {
  try {
    const response = await axios.get(
      `${ORACLE_API_URL}/api/v0/price/current_all`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch price list:', error);
    throw new Error('Failed to fetch price list');
  }
};
