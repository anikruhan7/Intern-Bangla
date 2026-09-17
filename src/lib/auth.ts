import { api } from "./api";

export type AuthUser = {
  id: number;
  email: string;
  role: "STUDENT" | "ALUMNI" | "HR" | "ADMIN";
  firstName: string;
  lastName: string;
};

type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

const TOKEN_KEY = "ib_access_token";
const USER_KEY = "ib_user";

export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>("/auth/login", { email, password });
  try {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  } catch {
    // ignore storage errors
  }
  return res.user;
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore storage errors
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function isStaffRole(role: AuthUser["role"]) {
  return role === "HR" || role === "ADMIN";
}
