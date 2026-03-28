import FiltersSidebar from "@/components/FiltersSidebar";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import TopNav from "@/components/TopNav";
import { JOB_CATEGORY_ORDER } from "@/constants/jobCategories";
import { fetchJobsPage } from "@/lib/jobs/fetch-jobs-page";
import { createServerComponentClient } from "@/lib/supabase/server";
import type { JobCategory } from "@/types/job";

const SALARY_OPTIONS: Array<{ value: number | null; label: string }> = [
  { value: null, label: "指定なし" },
  { value: 300, label: "300万円以上" },
  { value: 350, label: "350万円以上" },
  { value: 400, label: "400万円以上" },
  { value: 450, label: "450万円以上" },
  { value: 500, label: "500万円以上" },
  { value: 550, label: "550万円以上" },
  { value: 600, label: "600万円以上" },
  { value: 650, label: "650万円以上" },
  { value: 700, label: "700万円以上" },
];

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function parseCategoriesParam(sp: Record<string, string | string[] | undefined>) {
  const raw =
    firstString(sp.categories) ?? firstString(sp.category) ?? "";
  if (!raw) return [] as JobCategory[];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseMinSalaryParam(
  sp: Record<string, string | string[] | undefined>,
): number | null {
  const raw =
    firstString(sp.minSalary) ??
    firstString(sp.min_salary) ??
    firstString(sp.salaryMin) ??
    "";
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parsePageParam(
  sp: Record<string, string | string[] | undefined>,
): number {
  const raw = firstString(sp.page);
  const n = raw ? Number(raw) : 1;
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const selectedCategories = parseCategoriesParam(sp);
  const minSalaryOption = parseMinSalaryParam(sp);
  const page = parsePageParam(sp);
  const categories: JobCategory[] = JOB_CATEGORY_ORDER;

  let jobs: Awaited<ReturnType<typeof fetchJobsPage>>["jobs"] = [];
  let totalPages = 1;
  let errorMessage: string | null = null;

  try {
    const supabase = await createServerComponentClient();
    const result = await fetchJobsPage(supabase, {
      categories: selectedCategories,
      minSalaryMan: minSalaryOption,
      page,
      perPage: 10,
    });
    jobs = result.jobs;
    totalPages = result.totalPages;
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <main className="px-0 py-0">
        <div className="flex items-stretch gap-0">
          <FiltersSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            minSalaryOption={minSalaryOption}
            salaryOptions={SALARY_OPTIONS}
          />

          <section className="min-w-0 flex-1 bg-white px-6 py-5">
            <div className="mb-4">
              <h1 className="text-lg font-semibold text-gray-900">求人一覧</h1>
              <div className="mt-1 text-xs text-gray-600">
                総件数: {jobs.length}件
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            {!errorMessage && jobs.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
                条件に一致する求人がありません。
              </div>
            ) : !errorMessage ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={String(job.id)} job={job} />
                ))}
              </div>
            ) : null}

            <Pagination
              page={page}
              totalPages={totalPages}
              selectedCategories={selectedCategories}
              minSalaryOption={minSalaryOption}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
