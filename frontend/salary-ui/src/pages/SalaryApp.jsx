import { useNavigate } from "react-router-dom";
import QuickFilters from "../components/QuickFilters";
import AddSalaryForm from "../components/AddSalaryForm";
import SalaryTable from "../components/SalaryTable";
import EditModal from "../components/EditModal";
import useSalary from "../hooks/useSalary";

export default function SalaryApp() {
  const s = useSalary();
  const navigate = useNavigate();

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with user info and logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold">
          Payroll Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-700">
              {user.name || "User"}
            </div>
            <div className="text-xs text-gray-500">
              {user.department || "Department"}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <aside className="space-y-6 lg:col-span-1">
          <QuickFilters {...s} />
          <AddSalaryForm {...s} />

          <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3 border">
            <div className="text-sm text-black-600">
              Selected Salary ID's:{" "}
              {s.bulkSelected.size > 0
                ? Array.from(s.bulkSelected).join(", ")
                : "None"}
            </div>

            <button
              onClick={s.bulkDisburse}
              className="w-full bg-orange-600 text-white py-2 rounded-xl"
            >
              Bulk Disburse
            </button>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-4">
          {s.error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {s.error}
              <button onClick={s.clearError} className="float-right underline">
                dismiss
              </button>
            </div>
          )}

          <SalaryTable {...s} />
        </main>
      </div>

      {s.editing && <EditModal {...s} />}
    </div>
  );
}
