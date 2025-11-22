import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// ⚠️ Astuce : on crée une fonction qui retourne une instance axios
export default function api() {
  const { getToken } = useAuth();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    headers: { "Content-Type": "application/json" }
  });

  // Intercepteur → ajoute le token JWT à chaque requête
  instance.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // Intercepteur → erreurs
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        window.location.href = "/sign-in";
      }
      return Promise.reject(err);
    }
  );

  return instance;
}
