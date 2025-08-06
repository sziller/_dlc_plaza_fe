import axios from 'axios';
import { ORACLE_API_URL } from '../config';

// const ORACLE_API_URL = process.env.REACT_APP_ORACLE_API_URL;

// This function sends a GET request to the server to get the current price of BTC in USD
// It returns the price if successful, otherwise throws an error
// The function logs the error to the console
export const getPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(
      `${ORACLE_API_URL}/api/v0/price/current/BTCUSD`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch price:', error);
    throw new Error('Failed to fetch price');
  }
};
