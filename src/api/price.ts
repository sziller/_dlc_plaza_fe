import axios from 'axios';
import { API_URL, DEFAULT_ORACLE } from '../config';

export const getPrice = async (
  oracle: string = DEFAULT_ORACLE,
  symbol: string = 'BTCUSD'
): Promise<number> => {
  try {
    const response = await axios.get(
      `${API_URL}/app/dlcp/v1/oracle-price`,
      { params: { oracle, symbol } }
    );
    return response.data.payload.price;
  } catch (error) {
    console.error('Failed to fetch price:', error);
    throw new Error('Failed to fetch price');
  }
};
