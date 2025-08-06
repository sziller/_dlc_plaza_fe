import axios from "axios";
import { API_URL } from "../config";
import { getToken } from "./token";

export const deleteDlc = async (dlc_id: string): Promise<void> => {
  const token = getToken();

  try {
    await axios.delete(`${API_URL}/app/dlcp/v0/user-offer`, {
      params: { dlc_id },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (process.env.NODE_ENV === "development") {
      console.log(`DLC with ID ${dlc_id} has been successfully deleted.`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        throw new Error(`400 Bad Request: ${error.response.data.message}`);
      } else if (error.response && error.response.status === 401) {
        throw new Error("401 Unauthorized Error: Invalid or expired token.");
      } else if (error.response) {
        throw new Error(
          `${error.response.status} Error: ${error.response.data.message || "Unknown error occurred."}`
        );
      } else {
        throw new Error(
          "500 Internal Server Error: Operation failed due to unforeseen circumstances."
        );
      }
    } else {
      throw new Error("Unexpected error occurred.");
    }
  }
};