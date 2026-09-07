import { calculateMetrics } from "./metrics";
import { records } from "./test-data";

test("calculates submitted jobs, unique companies, and inclusive search days", () => {
  expect(calculateMetrics(records, new Date("2026-09-07T12:00:00+08:00"))).toEqual({
    appliedJobs: 2,
    appliedCompanies: 1,
    searchDays: 7
  });
});

test("returns zero days when no job has been submitted", () => {
  expect(calculateMetrics(records.filter((record) => record.status === "待投递"), new Date("2026-09-07"))).toEqual({ appliedJobs: 0, appliedCompanies: 0, searchDays: 0 });
});
