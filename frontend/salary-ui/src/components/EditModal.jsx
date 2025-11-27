import React from "react";

export default function EditModal({ editing, setEditing, updateSalary }) {
  if (!editing) return null;

  return (
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
            <button onClick={() => updateSalary(editing.id)} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
