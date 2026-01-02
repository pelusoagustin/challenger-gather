import axios, { AxiosError } from "axios";
import Logger from "../../../config/Logger";

const REQUEST_TIMEOUT_MS = 5000;

export const getJson = async <T>(
  url: string,
  headers: Record<string, string> = {}
): Promise<T> => {
  Logger.info("HTTP GET", { url });
  try {
    const response = await axios.get<T>(url, {
      headers: {
        Accept: "application/json",
        ...headers,
      },
      timeout: REQUEST_TIMEOUT_MS,
      responseType: "json",
      validateStatus: (status) => status >= 200 && status < 300,
    });

    if (!response.data) {
      throw new Error("INVALID_RESPONSE");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const code = axiosError.code ?? "AXIOS_ERROR";
      Logger.error("HTTP GET failed", { url, status, code });
      throw new Error(status ? `HTTP_${status}` : code);
    }
    Logger.error("HTTP GET failed", { url, error });
    throw error;
  }
};
