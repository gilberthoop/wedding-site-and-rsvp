export interface AdminUser {
  id: string;
  username: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  admin?: AdminUser;
}

const TOKEN_KEY = "wedding_admin_token";

export const getAdminToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAdminToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Returns Authorization header with the Bearer token for protected requests
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Log in admin
 */
export const loginAdmin = async (credentials: {
  username: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data: AuthResponse = await res.json().catch(() => ({
    success: false,
    message: "Failed to parse response from server",
  }));

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to log in");
  }

  if (data.token) {
    setAdminToken(data.token);
  }

  return data;
};

/**
 * Sign up admin
 */
export const signupAdmin = async (data: {
  username: string;
  password: string;
  email?: string;
}): Promise<AuthResponse> => {
  const res = await fetch("/api/admin/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json: AuthResponse = await res.json().catch(() => ({
    success: false,
    message: "Failed to parse response from server",
  }));

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to register admin");
  }

  if (json.token) {
    setAdminToken(json.token);
  }

  return json;
};

/**
 * Fetch current authenticated admin user
 */
export const fetchCurrentAdmin = async (): Promise<AdminUser | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch("/api/admin/me", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (res.status === 401) {
      removeAdminToken();
      return null;
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      removeAdminToken();
      return null;
    }

    return data.admin ?? null;
  } catch {
    return null;
  }
};

/**
 * Log out admin
 */
export const logoutAdmin = async (): Promise<void> => {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore server error on logout
  } finally {
    removeAdminToken();
  }
};
