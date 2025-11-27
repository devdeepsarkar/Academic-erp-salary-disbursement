export default function LoggedInUser({ loggedInEmployeeId, setLoggedInEmployeeId }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border">
      <h3 className="font-medium mb-2">Logged-in Employee</h3>
      <input
        type="number"
        value={loggedInEmployeeId}
        onChange={(e) => setLoggedInEmployeeId(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Your employee ID (for audit)"
      />
    </div>
  );
}
