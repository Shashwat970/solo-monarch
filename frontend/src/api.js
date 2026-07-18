const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function authHeaders() {
  const token = localStorage.getItem("sf_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export const api = {
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/user/me"),
  today: () => request("/workout/today"),
  logWorkout: (body) => request("/workout/log", { method: "POST", body: JSON.stringify(body) }),
  history: () => request("/workout/history"),
  adminUsers: () => request("/admin/users"),
  adminUserHistory: (id) => request(`/admin/users/${id}/history`),
  adminStats: () => request("/admin/stats"),
};