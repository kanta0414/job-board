export function formatSalaryMan(salary?: number): string {
  if (typeof salary !== "number" || Number.isNaN(salary)) return "";
  const man = salary > 1_000_000 ? Math.floor(salary / 10_000) : salary;
  return `${man}万円`;
}
