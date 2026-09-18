import { api, setAccessToken, clearAccessToken } from "./api";

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

const USER_KEY = "ib_user";

/** identifier can be an email address or a phone number. */
export async function login(identifier: string, password: string) {
  const res = await api.post<LoginResponse>("/auth/login", { identifier, password });
  setAccessToken(res.accessToken);
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  } catch {
    // ignore storage errors
  }
  return res.user;
}

export function logout() {
  clearAccessToken();
  try {
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

/** Patch the cached user (e.g. after editing your own profile) so the UI reflects it immediately. */
export function updateStoredUser(patch: Partial<AuthUser>) {
  const current = getStoredUser();
  if (!current) return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    // ignore storage errors
  }
}

export function isAdminRole(role: AuthUser["role"]) {
  return role === "ADMIN";
}

export function isCompanyRole(role: AuthUser["role"]) {
  return role === "HR";
}

export function isStudentRole(role: AuthUser["role"]) {
  return role === "STUDENT" || role === "ALUMNI";
}

/** Where to send a user right after login, based on their role. */
export function dashboardPathFor(role: AuthUser["role"]) {
  if (isAdminRole(role)) return "/staff/dashboard";
  if (isCompanyRole(role)) return "/company/dashboard";
  return "/student/dashboard";
}
