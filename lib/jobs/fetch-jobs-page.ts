import type { SupabaseClient } from "@supabase/supabase-js";
import type { Job, JobsPageResult } from "@/types/job";

type Row = {
  id: string;
  title: string;
  category: string;
  salary_man: number | null;
};

export async function fetchJobsPage(
  supabase: SupabaseClient,
  opts: {
    categories: string[];
    minSalaryMan: number | null;
    page: number;
    perPage: number;
  },
): Promise<JobsPageResult> {
  const { categories, minSalaryMan, page, perPage } = opts;
  const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  const from = (safePage - 1) * perPage;
  const to = from + perPage - 1;

  let q = supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (categories.length > 0) {
    q = q.in("category", categories);
  }
  if (minSalaryMan !== null && Number.isFinite(minSalaryMan)) {
    q = q.gte("salary_man", minSalaryMan);
  }

  const { data, error, count } = await q.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as Row[];
  const jobs: Job[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    salary:
      typeof r.salary_man === "number" && Number.isFinite(r.salary_man)
        ? r.salary_man
        : undefined,
  }));

  const total = typeof count === "number" && count >= 0 ? count : jobs.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return {
    jobs,
    page: safePage,
    perPage,
    totalPages,
  };
}
