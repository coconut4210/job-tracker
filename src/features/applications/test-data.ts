import type { Application } from "./model";

export const records: Application[] = [
  { id: "1", companyName: "字节跳动", city: "上海", companyCategory: "大厂", industry: "互联网", jobTitle: "AI 产品经理", jobCategory: "产品", appliedDate: "2026-09-01", status: "面试", jobUrl: "https://example.com/1", createdAt: "2026-09-01T00:00:00.000Z", updatedAt: "2026-09-01T00:00:00.000Z" },
  { id: "2", companyName: " 字节跳动 ", city: "北京", companyCategory: "大厂", industry: "互联网", jobTitle: "数据分析师", jobCategory: "数据", appliedDate: "2026-09-03", status: "筛选中", jobUrl: "", createdAt: "2026-09-03T00:00:00.000Z", updatedAt: "2026-09-03T00:00:00.000Z" },
  { id: "3", companyName: "招商银行", city: "深圳", companyCategory: "国央企", industry: "金融", jobTitle: "产品实习生", jobCategory: "产品", appliedDate: "", status: "待投递", jobUrl: "", createdAt: "2026-09-04T00:00:00.000Z", updatedAt: "2026-09-04T00:00:00.000Z" }
];
