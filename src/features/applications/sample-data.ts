import type { Application } from "./model";

export const SAMPLE_APPLICATIONS: Application[] = [
  { id: "sample-1", companyName: "小米", city: "北京", companyCategory: "大厂", industry: "互联网", jobTitle: "AI 产品经理", jobCategory: "产品", appliedDate: "2026-09-01", status: "面试", jobUrl: "https://xiaomi.com", createdAt: "2026-09-01T08:00:00.000Z", updatedAt: "2026-09-06T08:00:00.000Z" },
  { id: "sample-2", companyName: "招商银行", city: "深圳", companyCategory: "国央企", industry: "金融", jobTitle: "数据产品实习生", jobCategory: "产品", appliedDate: "2026-09-03", status: "笔试", jobUrl: "https://cmbchina.com", createdAt: "2026-09-03T08:00:00.000Z", updatedAt: "2026-09-05T08:00:00.000Z" },
  { id: "sample-3", companyName: "联合利华", city: "上海", companyCategory: "外企", industry: "快消", jobTitle: "消费者洞察实习生", jobCategory: "市场", appliedDate: "2026-09-05", status: "筛选中", jobUrl: "https://unilever.com", createdAt: "2026-09-05T08:00:00.000Z", updatedAt: "2026-09-05T08:00:00.000Z" },
  { id: "sample-4", companyName: "上海市大数据中心", city: "上海", companyCategory: "政府", industry: "公共服务", jobTitle: "数据治理实习生", jobCategory: "数据", appliedDate: "", status: "待投递", jobUrl: "", createdAt: "2026-09-06T08:00:00.000Z", updatedAt: "2026-09-06T08:00:00.000Z" }
];
