"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { JobCategory } from "@/types/job";
import { JOB_CATEGORY_ORDER } from "@/constants/jobCategories";

const DEFAULT_CATEGORIES: JobCategory[] = JOB_CATEGORY_ORDER;

export default function PostJobForm() {
  const router = useRouter();
  const [categories] = useState<JobCategory[]>(DEFAULT_CATEGORIES);
  const [category, setCategory] = useState<JobCategory>(DEFAULT_CATEGORIES[0]);
  const [salaryMan, setSalaryMan] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setError("タイトルを入力してください。");
      return;
    }

    const n = salaryMan.trim() ? Number(salaryMan) : undefined;
    if (
      salaryMan.trim() &&
      (!Number.isFinite(n) || (n as number) <= 0)
    ) {
      setError("年収（万円）は正の数で入力してください。");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title: normalizedTitle,
          salary: n,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message =
          typeof body?.message === "string"
            ? body.message
            : res.statusText || `Request failed (${res.status})`;
        throw new Error(message);
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">
            求人カテゴリ選択
          </label>
          <select
            className="w-[420px] max-w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">
            年収（万円）
          </label>
          <input
            type="number"
            inputMode="numeric"
            step={1}
            min={0}
            value={salaryMan}
            onChange={(e) => setSalaryMan(e.target.value)}
            className="w-[420px] max-w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">
            求人タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-[220px] rounded bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "投稿中..." : "投稿"}
        </button>
      </form>
    </>
  );
}
