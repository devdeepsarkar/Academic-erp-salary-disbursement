import LoggedInUser from "../components/LoggedInUser";
import QuickFilters from "../components/QuickFilters";
import AddSalaryForm from "../components/AddSalaryForm";
import SalaryTable from "../components/SalaryTable";
import EditModal from "../components/EditModal";
import useSalary from "../hooks/useSalary";

export default function SalaryApp() {
  const s = useSalary();

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Heading */}
      <h1
        className="
          text-2xl font-extrabold mb-6
          bg-clip-text text-transparent
          bg-gradient-to-r from-gray-900 via-gray-600 to-black
          animate-gradient-black
        "
      >
        Payroll Dashboard
      </h1>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

        {/* LEFT PANEL */}
        <aside className="space-y-6 lg:col-span-1">

          <LoggedInUser {...s} />
          <QuickFilters {...s} />
          <AddSalaryForm {...s} />

          {/* Bulk Disburse Box */}
          <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3 border">
            <div className="text-sm text-black-600">
              Selected Employee ID's:{" "}
              {s.bulkSelected.size > 0
                ? Array.from(s.bulkSelected).join(", ")
                : "None"}
            </div>

            <button
              onClick={s.bulkDisburse}
              className="
                w-full bg-orange-600 text-white py-2 rounded-xl
                hover:bg-orange-700 active:scale-95 transition duration-150
              "
            >
              Bulk Disburse
            </button>
          </div>
        </aside>

        {/* RIGHT PANEL */}
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
  