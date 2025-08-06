import axios from 'axios';
import { API_URL } from '../config';
// import { CadenaProdResponse } from './../types/cadenaDefaultsFace';

export const getCadenaProdDetails = async (
  topic: string,
): Promise<string> => {
  const response = await axios.get(`${API_URL}/app/dlcp/v0/cadena-defaults`, {
    params: { topic },
    headers: {
      Accept: 'application/json',
    },
  });

  // Ellenőrizd, hogy a válasz formátuma megfelelő-e
  if (response.data && response.data.payload && typeof response.data.payload.text === 'string') {
    return response.data.payload.text; // Visszaadjuk a text mezőt
  } else {
    throw new Error('Invalid response format');
  }
};