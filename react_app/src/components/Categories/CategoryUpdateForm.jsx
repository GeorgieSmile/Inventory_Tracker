import { useState } from "react";

export default function CategoryUpdateForm({initial, onUpdate, pending = false, onCancel }) {
  const [name, setName] = useState(initial.name || "");

  const submit = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return;
    onUpdate({ name: v });
    setName("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={pending}
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-lime-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "กำลังอัปเดต..." : "อัปเดต"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        disabled={pending}
      >
        ยกเลิก
      </button>
    </form>
  );
}
