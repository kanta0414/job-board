"use client";

import { useRouter } from "next/navigation";
import type { JobCategory } from "@/types/job";

type SalaryOption = { value: number | null; label: string };

function buildHref(
  selectedCategories: string[],
  minSalary: number | null,
  page: string,
): string {
  const params = new URLSearchParams();
  if (selectedCategories.length > 0) {
    params.set("categories", selectedCategories.join(","));
  }
  if (minSalary !== null && Number.isFinite(minSalary)) {
    params.set("minSalary", String(minSalary));
  }
  params.set("page", page);
  return `/?${params.toString()}`;
}

export default function FiltersSidebar(props: {
  categories: JobCategory[];
  selectedCategories: JobCategory[];
  minSalaryOption: number | null;
  salaryOptions: SalaryOption[];
}) {
  const {
    categories,
    selectedCategories,
    minSalaryOption,
    salaryOptions,
  } = props;
  const router = useRouter();

  const onToggleCategory = (cat: JobCategory) => {
    const exists = selectedCategories.includes(cat);
    const updated = exists
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    router.replace(buildHref(updated, minSalaryOption, "1"));
  };

  const onMinSalaryChange = (value: number | null) => {
    router.replace(buildHref(selectedCategories, value, "1"));
  };

  return (
    <aside className="w-[260px] shrink-0 self-stretch border-r border-gray-200 bg-slate-100">
      <div className="p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">求人カテゴリ</h2>

        <div className="mb-5">
          <div className="max-h-[52vh] space-y-1 overflow-auto pr-1">
            {categories.map((cat) => {
              const checked = selectedCategories.includes(cat);
              const id = `cat-${cat}`;
              return (
                <label
                  key={cat}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-gray-800"
                >
                  <input
                    id={id}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-slate-700 focus:ring-slate-500"
                    checked={checked}
                    onChange={() => onToggleCategory(cat)}
                  />
                  <span className="truncate">{cat}</span>
                </label>
              );
            })}
            {categories.length === 0 && (
              <div className="text-xs text-gray-500">カテゴリを取得中...</div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-gray-900">年収</div>
          <select
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            value={minSalaryOption === null ? "" : String(minSalaryOption)}
            onChange={(e) => {
              const raw = e.target.value;
              onMinSalaryChange(raw === "" ? null : Number(raw));
            }}
          >
            {salaryOptions.map((opt) => (
              <option
                key={opt.label}
                value={opt.value === null ? "" : String(opt.value)}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
