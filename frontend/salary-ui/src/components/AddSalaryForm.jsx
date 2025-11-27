import React from "react";

export default function AddSalaryForm({
  employeeIdForAdd,
  setEmployeeIdForAdd,
  newSalary,
  setNewSalary,
  addSalary,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3 border">
      <h3 className="font-medium">Add Salary</h3>

      {/* Employee ID */}
      <input
        type="number"
        value={employeeIdForAdd}
        onChange={(e) => setEmployeeIdForAdd(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Employee ID"
      />

      {/* Amount */}
      <input
        type="number"
        value={newSalary.amount}
        onChange={(e) =>
          setNewSalary((s) => ({ ...s, amount: e.target.value }))
        }
        className="w-full border p-2 rounded"
        placeholder="Amount"
      />

      {/* Description */}
      <input
        type="text"
        value={newSalary.description}
        onChange={(e) =>
          setNewSalary((s) => ({ ...s, description: e.target.value }))
        }
        className="w-full border p-2 rounded"
        placeholder="Description"
      />

      {/* Submit button */}
      <button
        onClick={addSalary}
        className="w-full bg-green-600 text-white py-2 rounded-xl
                   hover:bg-green-700 active:scale-95 transition duration-150"
      >
        Add Salary
      </button>
    </div>
  );
}
