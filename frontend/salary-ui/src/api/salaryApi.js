const BASE_URL = "http://localhost:8080";

function getEmployeeIdHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.employeeId) return {};

  return {
    "X-Employee-Id": user.employeeId,
  };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getEmployeeIdHeader(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const SalaryApi = {
  getAll: () => apiFetch("/api/salary/all"),

  getPending: () => apiFetch("/api/salary/pending"),

  getByEmployee: (id) => apiFetch(`/api/salary/employee/${id}`),

  disburse: (id) =>
    apiFetch(`/api/salary/disburse/${id}`, {
      method: "PUT",
    }),

  bulkDisburse: (ids) =>
    apiFetch(`/api/salary/disburse/bulk`, {
      method: "PUT",
      body: JSON.stringify(ids),
    }),

  add: (employeeId, payload) =>
    apiFetch(`/api/salary/add/${employeeId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiFetch(`/api/salary/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
