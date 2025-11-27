import { useEffect, useState } from "react";
import { SalaryApi } from "../api/salaryApi";

export default function useSalary() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state owned by hook to avoid prop-drill problems
  const [employeeIdForAdd, setEmployeeIdForAdd] = useState("");
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState("");
  const [newSalary, setNewSalary] = useState({ amount: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [bulkSelected, setBulkSelected] = useState(new Set());

  const clearError = () => setError(null);

  const safeRun = async (fn) => {
    try {
      setLoading(true);
      clearError();
      await fn();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const loadAll = () => safeRun(async () => {
    const data = await SalaryApi.getAll();
    setSalaries(data);
  });

  const loadPending = () => safeRun(async () => {
    const data = await SalaryApi.getPending();
    setSalaries(data);
  });

  const loadByEmployee = (id) => safeRun(async () => {
    const data = await SalaryApi.getByEmployee(id);
    setSalaries(data);
  });

  const addSalary = () => safeRun(async () => {
    if (!employeeIdForAdd) throw new Error("Enter employee ID to add salary for.");
    if (!loggedInEmployeeId) throw new Error("Set loggedInEmployeeId before adding salary.");
    const payload = {
      amount: Number(newSalary.amount),
      description: newSalary.description || null,
    };
    const created = await SalaryApi.add(employeeIdForAdd, loggedInEmployeeId, payload);
    setSalaries((prev) => [created, ...prev]);
    setNewSalary({ amount: "", description: "" });
  });

  const updateSalary = (salaryId) => safeRun(async () => {
    if (!loggedInEmployeeId) throw new Error("Set updatedById (loggedInEmployeeId) before update.");
    if (!salaryId) throw new Error("Missing salary id to update.");
    const payload = {
      amount: Number(editing.amount),
      description: editing.description || null,
    };
    const updated = await SalaryApi.update(salaryId, loggedInEmployeeId, payload);
    setSalaries((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditing(null);
  });

  const disburse = (salaryId) => safeRun(async () => {
    if (!loggedInEmployeeId) throw new Error("Set loggedInEmployeeId before disbursement.");
    const updated = await SalaryApi.disburse(salaryId, loggedInEmployeeId);
    setSalaries((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  });

  const bulkDisburse = () => safeRun(async () => {
    if (!loggedInEmployeeId) throw new Error("Set loggedInEmployeeId before bulk disbursement.");
    if (bulkSelected.size === 0) throw new Error("Select at least one salary for bulk disbursement.");
    const ids = Array.from(bulkSelected).map((v) => Number(v));
    const updated = await SalaryApi.bulkDisburse(ids, loggedInEmployeeId);
    const updatedIds = new Set(updated.map((u) => u.id));
    setSalaries((prev) => prev.map((s) => (updatedIds.has(s.id) ? updated.find((u) => u.id === s.id) : s)));
    setBulkSelected(new Set());
  });

  const toggleSelect = (id) => {
    setBulkSelected((prev) => {
      const clone = new Set(prev);
      if (clone.has(id)) clone.delete(id);
      else clone.add(id);
      return clone;
    });
  };

  useEffect(() => {
    loadAll();
  }, []);

  return {
    // data + ui state
    salaries,
    loading,
    error,

    // form state
    employeeIdForAdd,
    setEmployeeIdForAdd,
    loggedInEmployeeId,
    setLoggedInEmployeeId,
    newSalary,
    setNewSalary,
    editing,
    setEditing,
    bulkSelected,
    setBulkSelected,

    // actions
    loadAll,
    loadPending,
    loadByEmployee,
    addSalary,
    updateSalary,
    disburse,
    bulkDisburse,
    toggleSelect,
    clearError,
  };
}
