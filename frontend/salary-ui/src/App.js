import React, { useEffect, useState } from "react";

// SalaryApp - single-file React component
// - Tailwind-ready markup (no Tailwind import here; assume your project has Tailwind configured)
// - Default export a React component
// - Uses fetch to call the Spring Boot endpoints described by the user

const BASE_URL = "http://localhost:8080"; // set this to your backend base URL if different, e.g. "http://localhost:8080"

function isoDateForInput(dateString) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    // Convert to yyyy-mm-dd
    return d.toISOString().split("T")[0];
  } catch (e) {
    return dateString;
  }
}

export default function SalaryApp() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [employeeIdQuery, setEmployeeIdQuery] = useState("");
  const [employeeIdForAdd, setEmployeeIdForAdd] = useState("");
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState("");

  const [bulkSelected, setBulkSelected] = useState(new Set());

  // Add salary form
  const [newSalary, setNewSalary] = useState({ amount: "", date: "", description: "" });

  // Update modal state
  const [editing, setEditing] = useState(null); // salary object being edited

  // Generic helpers
  const handleError = (e) => {
    console.error(e);
    setError(e.message || "Something went wrong");
  };

  // API calls
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/salary/all`);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setSalaries(data);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/salary/pending`);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setSalaries(data);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchByEmployee = async (employeeId) => {
    if (!employeeId) return setError("Provide an employee ID");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/salary/employee/${employeeId}`);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setSalaries(data);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const disburseSingle = async (salaryId) => {
    if (!loggedInEmployeeId) return setError("Set loggedInEmployeeId above before disbursement.");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${BASE_URL}/api/salary/disburse/${salaryId}?loggedInEmployeeId=${encodeURIComponent(
          loggedInEmployeeId
        )}`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const updated = await res.json();
      // Update local list
      setSalaries((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const bulkDisburse = async () => {
    if (!loggedInEmployeeId) return setError("Set loggedInEmployeeId above before bulk disbursement.");
    if (bulkSelected.size === 0) return setError("Select at least one salary for bulk disbursement.");

    const ids = Array.from(bulkSelected).map((v) => Number(v));

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${BASE_URL}/api/salary/disburse/bulk?loggedInEmployeeId=${encodeURIComponent(loggedInEmployeeId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ids),
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const updated = await res.json();
      // Replace any updated salaries returned by server
      const updatedIds = new Set(updated.map((s) => s.id));
      setSalaries((prev) => prev.map((s) => (updatedIds.has(s.id) ? updated.find((u) => u.id === s.id) : s)));
      setBulkSelected(new Set());
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const addSalary = async () => {
    if (!employeeIdForAdd) return setError("Enter employee ID to add salary for.");
    if (!loggedInEmployeeId) return setError("Set loggedInEmployeeId above before adding salary.");
    setLoading(true);
    setError(null);
    try {
      // Prepare payload - ensure numeric amount & ISO date
      const payload = {
        ...newSalary,
        amount: Number(newSalary.amount),
        date: newSalary.date ? new Date(newSalary.date).toISOString() : null,
      };

      const res = await fetch(
        `${BASE_URL}/api/salary/add/${employeeIdForAdd}?loggedInEmployeeId=${encodeURIComponent(
          loggedInEmployeeId
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Add failed: ${res.status} ${res.statusText} ${text}`);
      }

      const created = await res.json();
      setSalaries((prev) => [created, ...prev]);
      setNewSalary({ amount: "", date: "", description: "" });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const updateSalary = async (salaryId, updatedData) => {
    if (!loggedInEmployeeId) return setError("Set updatedById (loggedInEmployeeId) above before update.");
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...updatedData,
        amount: Number(updatedData.amount),
        date: updatedData.date ? new Date(updatedData.date).toISOString() : null,
      };
      const res = await fetch(
        `${BASE_URL}/api/salary/update/${salaryId}?updatedById=${encodeURIComponent(loggedInEmployeeId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${res.status} ${res.statusText} ${text}`);
      }
      const updated = await res.json();
      setSalaries((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setEditing(null);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  // Init: fetch all
  useEffect(() => {
    fetchAll();
  }, []);

  // UI helpers
  const toggleSelect = (id) => {
    setBulkSelected((prev) => {
      const clone = new Set(prev);
      if (clone.has(id)) clone.delete(id);
      else clone.add(id);
      return clone;
    });
  };

  const clearError = () => setError(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Salary Management</h1>
          <div className="text-sm text-gray-600">Backend base: <code>{BASE_URL || 'same origin'}</code></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls column */}
          <aside className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Logged-in Employee ID (for audits)</label>
                <input
                  type="number"
                  value={loggedInEmployeeId}
                  onChange={(e) => setLoggedInEmployeeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                  placeholder="e.g. 5"
                />
              </div>

              <div className="space-y-2">
                <button onClick={fetchAll} className="w-full py-2 rounded-xl bg-slate-800 text-white">Load all salaries</button>
                <button onClick={fetchPending} className="w-full py-2 rounded-xl border">Load pending</button>
              </div>

              <div className="pt-2 border-t"></div>

              <div>
                <label className="text-sm font-medium">Get by Employee ID</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    value={employeeIdQuery}
                    onChange={(e) => setEmployeeIdQuery(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 p-2"
                    placeholder="Employee ID"
                  />
                  <button
                    onClick={() => fetchByEmployee(employeeIdQuery)}
                    className="px-3 rounded-xl bg-indigo-600 text-white"
                  >
                    Go
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t"></div>

              <div>
                <h3 className="font-medium">Add Salary</h3>
                <label className="text-xs text-gray-600">Employee ID</label>
                <input
                  type="number"
                  value={employeeIdForAdd}
                  onChange={(e) => setEmployeeIdForAdd(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                  placeholder="employee id"
                />

                <label className="text-xs text-gray-600 mt-2">Amount</label>
                <input
                  type="number"
                  value={newSalary.amount}
                  onChange={(e) => setNewSalary((s) => ({ ...s, amount: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                />

                <label className="text-xs text-gray-600 mt-2">Description</label>
                <input
                  type="text"
                  value={newSalary.description}
                  onChange={(e) => setNewSalary((s) => ({ ...s, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                />

                <button onClick={addSalary} className="mt-3 w-full rounded-xl bg-green-600 text-white py-2">Add Salary</button>
              </div>

              <div className="pt-2 border-t"></div>

              <div>
                <h3 className="font-medium">Bulk actions</h3>
                <button onClick={bulkDisburse} className="mt-2 w-full rounded-xl bg-amber-600 text-white py-2">Bulk Disburse</button>
                <div className="text-xs text-gray-500 mt-2">Select rows in the table to include in bulk actions.</div>
              </div>

            </div>
          </aside>

          {/* Table column */}
          <main className="lg:col-span-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Salaries</h2>
                <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${salaries.length} records`}</div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                  <div className="flex justify-between items-center">
                    <div>{error}</div>
                    <button onClick={clearError} className="text-sm underline">dismiss</button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs">Sel</th>
                      <th className="px-3 py-2 text-left text-xs">ID</th>
                      <th className="px-3 py-2 text-left text-xs">Employee ID</th>
                      <th className="px-3 py-2 text-left text-xs">Amount</th>
                      <th className="px-3 py-2 text-left text-xs">Date</th>
                      <th className="px-3 py-2 text-left text-xs">Status</th>
                      <th className="px-3 py-2 text-left text-xs">Description</th>
                      <th className="px-3 py-2 text-left text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {salaries.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={bulkSelected.has(s.id)}
                            onChange={() => toggleSelect(s.id)}
                            className="h-4 w-4"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm">{s.id}</td>
                        <td className="px-3 py-2 text-sm">{s.employee?.employeeId}</td>
                        <td className="px-3 py-2 text-sm">{s.amount}</td>
                        <td className="px-3 py-2 text-sm">{s.paymentDate ? new Date(s.paymentDate).toLocaleDateString() : "-"}</td>
                        <td className="px-3 py-2 text-sm">{s.status ?? (s.disbursed ? 'DISBURSED' : 'PENDING')}</td>
                        <td className="px-3 py-2 text-sm">{s.description ?? '-'}</td>
                        <td className="px-3 py-2 text-sm space-x-2">
                          <button
                            onClick={() => setEditing(s)}
                            className="px-2 py-1 rounded bg-indigo-600 text-white text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => disburseSingle(s.id)}
                            className="px-2 py-1 rounded bg-emerald-600 text-white text-xs"
                          >
                            Disburse
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div>Tip: click a row's Edit to modify amount/date/description.</div>
                <div>
                  <button onClick={() => { setSalaries([]); fetchAll(); }} className="underline">Refresh</button>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Edit modal (simple inline panel) */}
        {editing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl p-6">
              <h3 className="text-lg font-medium mb-4">Edit Salary #{editing.id}</h3>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm">Amount</label>
                <input
                  type="number"
                  value={editing.amount}
                  onChange={(e) => setEditing((s) => ({ ...s, amount: e.target.value }))}
                  className="rounded-md border-gray-300 p-2"
                />

                <label className="text-sm">Description</label>
                <input
                  type="text"
                  value={editing.description || ""}
                  onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))}
                  className="rounded-md border-gray-300 p-2"
                />

                <div className="flex gap-2 justify-end pt-4">
                  <button onClick={() => setEditing(null)} className="px-4 py-2 rounded border">Cancel</button>
                  <button
                    onClick={() => updateSalary(editing.id, editing)}
                    className="px-4 py-2 rounded bg-indigo-600 text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
