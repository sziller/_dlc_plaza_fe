import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token';
import {
  QRCodeUserResponse,
  QRCodeAddressResponse,
} from '../types/common/qrFace';

// This function sends a GET request to the server to get the user's QR code
// It returns the response data if successful, otherwise throws an error
// The token is retrieved from the AuthContext using the getToken function
// If the token is not available, an error is thrown
// The function handles different error status codes and throws appropriate errors
// The function also logs the error to the console
export const getUserQR = async (): Promise<QRCodeUserResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.get(`${API_URL}/app/dlcp/v0/user-s-qr`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data as QRCodeUserResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Unauthorized');
        } else if (error.response.status === 422) {
          throw new Error(
            `Unprocessable Entity: ${error.response.data.message}`
          );
        } else {
          throw new Error(
            `Failed to fetch QR code: ${error.response.data.message}`
          );
        }
      } else {
        throw new Error('Failed to fetch QR code');
      }
    } else {
      throw new Error('Unexpected error occurred');
    }
  }
};

// This function sends a GET request to the server to get the topup address QR code
// It returns the response data if successful, otherwise throws an error
// The token is retrieved from the AuthContext using the getToken function
// If the token is not available, an error is thrown
// The function handles different error status codes and throws appropriate errors
// The function also logs the error to the console
export const getTopupAddressQR = async (
  SeqNr: number
): Promise<QRCodeAddressResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.get(`${API_URL}/app/dlcp/v0/topup-address`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        SeqNr: SeqNr,
      },
    });
    return response.data as QRCodeAddressResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Unauthorized');
        } else if (error.response.status === 422) {
          throw new Error(
            `Unprocessable Entity: ${error.response.data.message}`
          );
        } else {
          throw new Error(
            `Failed to fetch QR code: ${error.response.data.message}`
          );
        }
      } else {
        throw new Error('Failed to fetch QR code');
      }
    } else {
      throw new Error('Unexpected error occurred');
    }
  }
};
