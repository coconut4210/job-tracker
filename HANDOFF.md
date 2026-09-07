# 求职岗位追踪器 — Agent 交接文档

更新时间：2026-09-07

## 项目目标

这是一个手动录入岗位的求职进度追踪器。用户希望先完成前端，后续再支持跨设备访问、账号系统、数据库和邮箱自动同步。

用户已确定的核心字段：

- 公司名称
- 所在城市
- 公司规模/性质：大厂、中厂、小厂、国央企、外企、政府等
- 公司行业：互联网、电商、金融、农林牧渔、快消等
- 岗位名称
- 岗位类型
- 投递日期
- 当前状态
- 官网/岗位链接

状态固定为：`待投递`、`筛选中`、`测评`、`笔试`、`面试`、`Offer`、`拒绝`。

## 已完成内容

当前实现位于 `C:\Users\admin\Desktop\暑期实习\job-tracker`。

- Next.js 15 + TypeScript + Tailwind 风格 CSS 前端。
- 单页布局，不包含侧边导航。
- 顶部三项统计：已投递岗位数、已投递公司数、已开始求职天数。
- 默认列表视图，仅显示：公司名称、所在城市、岗位名称、当前状态、更多。
- “更多”打开右侧详情/编辑面板，展示并编辑所有字段。
- 可切换到七列状态看板。
- 看板卡片只显示：`公司名称 | 城市` 与下一行的岗位名称。
- 支持拖拽岗位卡改变状态；状态允许前后流转。
- 支持搜索以及城市、公司规模、行业、岗位类型、状态筛选。
- 支持新增、编辑、删除。
- 浏览器本地持久化，键名：`job-tracker.applications.v1`。
- 首次未初始化时显示演示数据；用户删除全部数据后刷新不会重新填充演示数据。
- 已完成桌面和窄屏视觉检查。

## 重要文件

| 文件 | 用途 |
|---|---|
| `src/app/page.tsx` | 页面入口 |
| `src/app/globals.css` | 全部视觉与响应式样式 |
| `src/features/applications/tracker-dashboard.tsx` | 主界面、工具栏、列表、看板、侧面板 |
| `src/features/applications/model.ts` | 领域类型、状态定义、筛选类型 |
| `src/features/applications/metrics.ts` | 三项统计口径 |
| `src/features/applications/filter.ts` | 搜索与组合筛选 |
| `src/features/applications/repository.ts` | 数据访问接口 |
| `src/features/applications/local-storage-repository.ts` | 目前的本地存储实现 |
| `src/features/applications/use-applications.ts` | 加载、保存、删除与失败回滚 |
| `src/features/applications/sample-data.ts` | 初次展示的演示数据 |
| `docs/superpowers/specs/2026-09-07-job-application-tracker-frontend-design.md` | 已确认的产品与设计规格 |
| `docs/superpowers/plans/2026-09-07-job-application-tracker-frontend.md` | 已执行的前端实施计划 |

## 启动与验证

在项目目录运行：

```powershell
npm install
npm run dev
```

本地地址：`http://localhost:3000`

完整验证命令：

```powershell
npm test
npm run typecheck
npm run build
```

最后一次验证结果：4 个测试文件、11 项测试通过；类型检查通过；生产构建通过。

## 当前限制

- 数据只保存在当前浏览器。部署到公网后，不同电脑或不同浏览器不会共享数据。
- 没有登录、数据库、服务端 API、邮件同步或浏览器/官网抓取。
- 当前工作目录不是 Git 仓库；项目尚未提交到 GitHub。
- 看板拖拽使用 `@dnd-kit/core`。目前有基础 Pointer 与 Keyboard sensor；若扩展拖拽排序或无障碍提示，需要补充测试。

## 推荐下一步：跨设备部署

推荐技术路线：Vercel + Supabase。

```text
浏览器
  ↓
Vercel 上的 Next.js
  ↓
Supabase Auth（登录） + PostgreSQL（岗位记录）
```

实施顺序：

1. 在 `job-tracker` 初始化 Git 仓库，创建 GitHub 私有仓库并推送。
2. 创建 Supabase 项目。
3. 建立 `applications` 表，字段与 `Application` 类型对应，并增加 `user_id`。
4. 开启 Row Level Security：仅允许登录用户读取、写入、修改和删除自己的记录。
5. 集成 Supabase Auth，优先使用邮箱验证码或 Google 登录。
6. 新建 `SupabaseApplicationRepository` 实现 `ApplicationRepository` 接口。
7. 根据登录状态选择 Supabase repository；本地存储可作为未登录体验或迁移来源。
8. 为本地数据迁移设计一次性导入提示，避免已有数据丢失。
9. 在 Vercel 导入 GitHub 仓库，设置环境变量：

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

10. 部署后验证：登录、跨设备新增/编辑/删除、权限隔离、退出登录和迁移提示。

## 数据库建议

```sql
create table public.applications (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  city text not null default '',
  company_category text not null default '',
  industry text not null default '',
  job_title text not null,
  job_category text not null default '',
  applied_date date,
  status text not null,
  job_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

请对 `status` 增加检查约束，并为所有表操作添加基于 `auth.uid() = user_id` 的 Row Level Security 策略。

## 实施注意事项

- 不要让 React 组件直接访问 `localStorage` 或 Supabase；统一通过 `ApplicationRepository`。
- 保持现有的状态文字和显示顺序，不要替换为英文或增加未经用户确认的阶段。
- 保持列表折叠态只有五列，避免信息溢出。
- 保持看板卡片的极简格式，勿在卡片中增加行业、日期或标签。
- 数据库接入前先写失败测试；项目此前按测试驱动方式建立。
- `待投递` 允许没有投递日期；其他状态必须有投递日期。
- 不应将“公司规模/性质”强行拆为两个字段，除非用户后续明确要求。

## 后续可选能力

在数据库和登录稳定后，再按优先级考虑：

1. CSV 导入与导出。
2. Gmail / Microsoft Outlook 邮件同步。
3. 自动识别测评、笔试、面试、拒绝、Offer 邮件。
4. 状态事件历史、邮件证据和低置信度人工确认。
5. 公司官网或 ATS 投递捕捉。

