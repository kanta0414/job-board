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

  // range 付き select では count がページ内件数になることがあるため、件数は head のみクエリで取得
  let countQ = supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });
  if (categories.length > 0) {
    countQ = countQ.in("category", categories);
  }
  if (minSalaryMan !== null && Number.isFinite(minSalaryMan)) {
    countQ = countQ.gte("salary_man", minSalaryMan);
  }

  const { count, error: countError } = await countQ;
  if (countError) {
    throw new Error(countError.message);
  }

  const totalCount =
    typeof count === "number" && count >= 0 ? count : 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  let dataQ = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (categories.length > 0) {
    dataQ = dataQ.in("category", categories);
  }
  if (minSalaryMan !== null && Number.isFinite(minSalaryMan)) {
    dataQ = dataQ.gte("salary_man", minSalaryMan);
  }

  const { data, error } = await dataQ.range(from, to);

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

  return {
    jobs,
    page: safePage,
    perPage,
    totalPages,
    totalCount,
  };
}
