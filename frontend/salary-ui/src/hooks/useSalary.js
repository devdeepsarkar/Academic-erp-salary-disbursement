import { useEffect, useState } from "react";
import { SalaryApi } from "../api/salaryApi";

export default function useSalary() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [employeeIdForAdd, setEmployeeIdForAdd] = useState("");
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

  const loadAll = () =>
    safeRun(async () => {
      setSalaries(await SalaryApi.getAll());
    });

  const loadPending = () =>
    safeRun(async () => {
      setSalaries(await SalaryApi.getPending());
    });

  const loadByEmployee = (id) =>
    safeRun(async () => {
      setSalaries(await SalaryApi.getByEmployee(id));
    });

  const addSalary = () =>
    safeRun(async () => {
      const payload = {
        amount: Number(newSalary.amount),
        description: newSalary.description || null,
      };

      const created = await SalaryApi.add(employeeIdForAdd, payload);
      setSalaries((prev) => [created, ...prev]);
      setNewSalary({ amount: "", description: "" });
    });

  const updateSalary = (salaryId) =>
    safeRun(async () => {
      const payload = {
        amount: Number(editing.amount),
        description: editing.description || null,
      };

      const updated = await SalaryApi.update(salaryId, payload);

      setSalaries((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );

      setEditing(null);
    });

  const disburse = (salaryId) =>
    safeRun(async () => {
      const updated = await SalaryApi.disburse(salaryId);

      setSalaries((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    });

  const bulkDisburse = () =>
    safeRun(async () => {
      const ids = [...bulkSelected];
      const updated = await SalaryApi.bulkDisburse(ids);

      const updatedIds = new Set(updated.map((u) => u.id));

      setSalaries((prev) =>
        prev.map((s) =>
          updatedIds.has(s.id) ? updated.find((u) => u.id === s.id) : s
        )
      );

      setBulkSelected(new Set());
    });

  const toggleSelect = (id) =>
    setBulkSelected((prev) => {
      const c = new Set(prev);
      c.has(id) ? c.delete(id) : c.add(id);
      return c;
    });

  useEffect(() => {
    loadAll();
  }, []);

  return {
    salaries,
    loading,
    error,
    employeeIdForAdd,
    setEmployeeIdForAdd,
    newSalary,
    setNewSalary,
    editing,
    setEditing,
    bulkSelected,
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
