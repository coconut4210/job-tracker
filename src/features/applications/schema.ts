import { z } from "zod";
import { APPLICATION_STATUSES } from "./model";

export const applicationSchema = z.object({
  id: z.string().min(1),
  companyName: z.string().trim().min(1, "请输入公司名称"),
  city: z.string(),
  companyCategory: z.string(),
  industry: z.string(),
  jobTitle: z.string().trim().min(1, "请输入岗位名称"),
  jobCategory: z.string(),
  appliedDate: z.string(),
  status: z.enum(APPLICATION_STATUSES),
  jobUrl: z.union([z.literal(""), z.url("请输入有效链接")]),
  createdAt: z.string(),
  updatedAt: z.string()
}).superRefine((record, context) => {
  if (record.status !== "待投递" && !record.appliedDate) {
    context.addIssue({ code: "custom", path: ["appliedDate"], message: "请选择投递日期" });
  }
});

export const storedApplicationsSchema = z.array(applicationSchema);
