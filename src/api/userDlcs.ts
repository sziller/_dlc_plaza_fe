import axios from 'axios';
import { getToken } from './token';
import { API_URL } from '../config';
import { UserDlcsResponse } from '../types/dlcFace';
// const API_URL = process.env.REACT_APP_ORACLE_API_URL;

// This function sends a GET request to the server to get the user's DLCs
// It returns the response data if successful, otherwise throws an error
export const getUserDlcs = async (
  status_list: string[] = ['offer', 'accepted', 'signed']
): Promise<UserDlcsResponse> => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/app/dlcp/v0/user-dlcs`, {
    params: { status_list },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.data && Array.isArray(response.data.payload)) {
    return response.data;
  } else {
    throw new Error('Invalid response from server');
  }
};
