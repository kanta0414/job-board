"use client";

import { useRouter } from "next/navigation";

function buildListHref(
  page: number,
  selectedCategories: string[],
  minSalaryOption: number | null,
): string {
  const params = new URLSearchParams();
  if (selectedCategories.length > 0) {
    params.set("categories", selectedCategories.join(","));
  }
  if (minSalaryOption !== null && Number.isFinite(minSalaryOption)) {
    params.set("minSalary", String(minSalaryOption));
  }
  params.set("page", String(page));
  return `/?${params.toString()}`;
}

export default function Pagination(props: {
  page: number;
  totalPages: number;
  selectedCategories: string[];
  minSalaryOption: number | null;
}) {
  const { page, totalPages, selectedCategories, minSalaryOption } = props;
  const router = useRouter();

  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(page, 1), totalPages);
  const windowSize = 2;

  let start = Math.max(1, safePage - windowSize);
  let end = Math.min(totalPages, safePage + windowSize);

  if (safePage - windowSize <= 1) {
    end = Math.min(totalPages, 1 + windowSize * 2);
  }
  if (safePage + windowSize >= totalPages) {
    start = Math.max(1, totalPages - windowSize * 2);
  }

  const pages: Array<number | "ellipsis"> = [];
  if (start > 1) pages.push(1);
  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push("ellipsis");
  if (end < totalPages) pages.push(totalPages);

  const go = (p: number) => {
    router.replace(buildListHref(p, selectedCategories, minSalaryOption));
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-700">
      <button
        type="button"
        className="rounded border border-gray-300 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => go(safePage - 1)}
        disabled={safePage <= 1}
      >
        ◀
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span key={`e-${idx}`} className="px-2 text-gray-500">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              className={[
                "rounded border px-2 py-1",
                p === safePage
                  ? "border-gray-400 bg-gray-100"
                  : "border-gray-300 bg-white hover:bg-gray-50",
              ].join(" ")}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="rounded border border-gray-300 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => go(safePage + 1)}
        disabled={safePage >= totalPages}
      >
        ▶
      </button>
    </div>
  );
}
