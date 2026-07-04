import axios from "axios";

import { frontendEnv } from "../config/env.js";

export const apiClient = axios.create({
  baseURL: frontendEnv.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});
