import { filterApplications } from "./filter";
import { records } from "./test-data";

test("combines text search and field filters", () => {
  const result = filterApplications(records, { query: "产品", city: "深圳", status: "待投递", companyCategory: "", industry: "", jobCategory: "" });
  expect(result.map((record) => record.id)).toEqual(["3"]);
});

test("search is case insensitive and trims whitespace", () => {
  const result = filterApplications(records, { query: " ai ", city: "", status: "", companyCategory: "", industry: "", jobCategory: "" });
  expect(result.map((record) => record.id)).toEqual(["1"]);
});
