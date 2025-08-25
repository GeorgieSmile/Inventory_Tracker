import { useState } from "react";

export default function CategoryForm({ onCreate, pending = false }) {
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return;
    onCreate({ name: v });
    setName("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
        placeholder="ขื่อหมวดหมู่ใหม่"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={pending}
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "กำลังเพิ่ม..." : "เพิ่มหมวดหมู่"}
      </button>
    </form>
  );
}
