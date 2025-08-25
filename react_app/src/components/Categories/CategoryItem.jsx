export default function CategoryItem({ category, onDelete, onEdit }) {
  return (
    <div className="flex items-center justify-between rounded-xl border px-3 py-2">
      <span className="flex-1 text-sm truncate">{category.name} #{category.category_id}</span>
      <div className="flex gap-2 ml-2">
          <button
            onClick={() => onEdit(category.category_id)}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-lime-600 hover:bg-green-50"
          >
            แก้ไข
          </button>
          <button
            onClick={() => onDelete(category.category_id)}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            ลบ
          </button>
      </div> 
    </div>
  );
}
