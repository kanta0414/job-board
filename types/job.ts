export type JobCategory = string;

export type Job = {
  id: string | number;
  title: string;
  category: string;
  salary?: number;
};

export type JobsPageResult = {
  jobs: Job[];
  page: number;
  perPage: number;
  totalPages: number;
};
