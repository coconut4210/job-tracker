import type { Application } from "./model";

export function calculateMetrics(records: Application[], today = new Date()) {
  const submitted = records.filter((record) => record.status !== "待投递");
  const companies = new Set(submitted.map((record) => record.companyName.trim().toLocaleLowerCase("zh-CN")));
  const dates = submitted.map((record) => record.appliedDate).filter(Boolean).sort();
  let searchDays = 0;
  if (dates[0]) {
    const start = new Date(`${dates[0]}T00:00:00`);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    searchDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1);
  }
  return { appliedJobs: submitted.length, appliedCompanies: companies.size, searchDays };
}
