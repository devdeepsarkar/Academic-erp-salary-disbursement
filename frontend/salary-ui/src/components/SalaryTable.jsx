import React from "react";
import formatDate from "../utils/formatDate";

export default function SalaryTable({
  salaries = [],
  loading,
  disburse,
  setEditing,
  bulkSelected,
  toggleSelect,
  loadAll, 
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Salaries</h2>

        {/* record count + refresh */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{loading ? "Loading..." : `${salaries.length} records`}</span>

          <button
            onClick={loadAll}
            className="px-2 py-1 text-xs bg-slate-800 text-white rounded-lg
                       hover:bg-slate-700 active:scale-95 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-y-auto overflow-x-auto h-full max-h-screen">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs">Sel</th>
              <th className="px-3 py-2 text-left text-xs">Salary ID</th>
              <th className="px-3 py-2 text-left text-xs">Emp ID</th>
              <th className="px-3 py-2 text-left text-xs">First Name</th>
              <th className="px-3 py-2 text-left text-xs">Last Name</th>
              <th className="px-3 py-2 text-left text-xs">Department</th>
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
                    checked={bulkSelected?.has(s.id)}
                    onChange={() => toggleSelect(s.id)}
                    className="h-4 w-4"
                  />
                </td>

                <td className="px-3 py-2 text-sm">{s.id}</td>
                <td className="px-3 py-2 text-sm">{s.employee?.employeeId}</td>

                {/* New Added Columns */}
                <td className="px-3 py-2 text-sm">{s.employee?.firstName}</td>
                <td className="px-3 py-2 text-sm">{s.employee?.lastName}</td>
                <td className="px-3 py-2 text-sm">{s.employee?.department?.name}</td>

                <td className="px-3 py-2 text-sm">{s.amount}</td>
                <td className="px-3 py-2 text-sm">
                  {s.paymentDate ? formatDate(s.paymentDate) : "-"}
                </td>

                <td className="px-3 py-2 text-sm">{s.status}</td>
                <td className="px-3 py-2 text-sm">{s.description ?? "-"}</td>

                <td className="px-3 py-2 text-sm space-y-1 flex flex-col">
                  <button
                    onClick={() => setEditing(s)}
                    className="px-2 py-1 rounded bg-indigo-600 text-white text-xs w-full hover:bg-indigo-700 active:scale-95 transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => disburse(s.id)}
                    className="px-2 py-1 rounded bg-emerald-600 text-white text-xs w-full hover:bg-emerald-700 active:scale-95 transition duration-150"
                  >
                    Disburse
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
