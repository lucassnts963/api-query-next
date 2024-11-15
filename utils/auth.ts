import { verifyJWT } from "@/lib/auth";

// utils/auth.ts
export async function refreshToken() {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  return response.ok;
}

export async function getUser(token: string) {
  if (!token) {
    return {
      error: "Não autorizado",
      status: 401,
    };
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return {
      error: "Token inválido",
      status: 401,
    };
  }

  return {
    user: payload,
    valid: true,
  };
}
