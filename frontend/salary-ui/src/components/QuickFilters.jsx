import { useState } from "react";

export default function QuickFilters({ loadAll, loadPending, loadByEmployee }) {
  const [searchEmployeeId, setSearchEmployeeId] = useState("");

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3 border">
      <h3 className="font-medium mb-2">Quick Filters</h3>

      <div className="flex gap-2 mb-3">
        <button
          onClick={loadAll}
          className="flex-1 bg-slate-800 text-white py-2 rounded-xl hover:bg-slate-700 active:scale-95 transition duration-150"
        >
          All salaries
        </button>

        <button
          onClick={loadPending}
          className="flex-1 bg-slate-800 text-white py-2 rounded-xl hover:bg-slate-700 active:scale-95 transition duration-150"
        >
          Pending only
        </button>
      </div>

      <h3 className="font-medium mb-2">Find by Employee ID</h3>
      <div className="flex gap-2">
        <input
          type="number"
          value={searchEmployeeId}
          onChange={(e) => setSearchEmployeeId(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Employee ID"
        />
        <button
          onClick={() => searchEmployeeId && loadByEmployee(searchEmployeeId)}
          className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700 active:scale-95 transition duration-150"
        >
          Go
        </button>
      </div>
    </div>
  );
}
