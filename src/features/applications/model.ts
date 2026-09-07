export const APPLICATION_STATUSES = ["待投递", "筛选中", "测评", "笔试", "面试", "Offer", "拒绝"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface Application {
  id: string;
  companyName: string;
  city: string;
  companyCategory: string;
  industry: string;
  jobTitle: string;
  jobCategory: string;
  appliedDate: string;
  status: ApplicationStatus;
  jobUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationDraft = Omit<Application, "id" | "createdAt" | "updatedAt">;

export interface ApplicationFilters {
  query: string;
  city: string;
  companyCategory: string;
  industry: string;
  jobCategory: string;
  status: ApplicationStatus | "";
}

export const EMPTY_FILTERS: ApplicationFilters = { query: "", city: "", companyCategory: "", industry: "", jobCategory: "", status: "" };
