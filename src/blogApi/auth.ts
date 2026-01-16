// src/api/auth.ts
import api, { setAuthToken } from "./client";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(email: string, password: string): Promise<void> {
  const formData = new URLSearchParams()
  formData.set("username", email) // backend expects "username"
  formData.set("password", password)

  try {
    const res = await api.post<LoginResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })

    const accessToken = res.data?.access_token
    if (!accessToken) {
      const keys = Object.keys(res.data || {})
      throw new Error(`Login response missing access_token (received keys: ${keys.join(",") || "none"})`)
    }

    setAuthToken(accessToken)
    localStorage.setItem("blog_token", accessToken)
  } catch (err: any) {
    const detail = err?.response?.data?.detail || err?.response?.data?.message
    const status = err?.response?.status
    const message = detail
      ? `Login failed (${status || "no status"}): ${detail}`
      : err?.message || "Login failed"
    throw new Error(message)
  }
}

export function loadSavedToken() {
  const token = localStorage.getItem("blog_token");
  if (token) {
    setAuthToken(token);
  }
}

export function logout() {
  localStorage.removeItem("blog_token");
  setAuthToken(null);
}
