import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "";
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, "");
const API_BASE = normalizedBaseUrl.endsWith("/api")
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});
