const BASE_URL = "http://localhost:8080";

async function apiFetch(path, options = {}) {
  const res = await fetch(BASE_URL + path, options);
  if (!res.ok) {
    // read the backend message and throw it so frontend shows the exact message
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  // some endpoints return [] or objects - safe to parse json
  // but if body is empty, res.json() will fail — backend returns JSON so ok.
  return res.json();
}

export const SalaryApi = {
  getAll: () => apiFetch("/api/salary/all"),
  getPending: () => apiFetch("/api/salary/pending"),
  getByEmployee: (id) => apiFetch(`/api/salary/employee/${id}`),
  disburse: (id, loggedIn) =>
    apiFetch(`/api/salary/disburse/${id}?loggedInEmployeeId=${encodeURIComponent(loggedIn)}`, {
      method: "PUT",
    }),
  bulkDisburse: (ids, loggedIn) =>
    apiFetch(`/api/salary/disburse/bulk?loggedInEmployeeId=${encodeURIComponent(loggedIn)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    }),
  add: (employeeId, loggedIn, payload) =>
    apiFetch(`/api/salary/add/${employeeId}?loggedInEmployeeId=${encodeURIComponent(loggedIn)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  update: (id, loggedIn, payload) =>
    apiFetch(`/api/salary/update/${id}?updatedById=${encodeURIComponent(loggedIn)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};
