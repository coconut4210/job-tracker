import type { Application, ApplicationFilters } from "./model";

export function filterApplications(records: Application[], filters: ApplicationFilters) {
  const query = filters.query.trim().toLocaleLowerCase("zh-CN");
  return records.filter((record) => {
    const textMatches = !query || `${record.companyName} ${record.jobTitle}`.toLocaleLowerCase("zh-CN").includes(query);
    return textMatches
      && (!filters.city || record.city === filters.city)
      && (!filters.companyCategory || record.companyCategory === filters.companyCategory)
      && (!filters.industry || record.industry === filters.industry)
      && (!filters.jobCategory || record.jobCategory === filters.jobCategory)
      && (!filters.status || record.status === filters.status);
  });
}
