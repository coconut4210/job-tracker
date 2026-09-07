# 求职岗位追踪器

一个以手动录入为主的本地求职进度看板。支持紧凑列表、流程看板、拖拽更新状态、搜索筛选以及新增、编辑和删除岗位。

## 启动

```powershell
npm install
npm run dev
```

打开 `http://localhost:3000`。

公网地址（GitHub Pages）：https://coconut4210.github.io/job-tracker/

## 验证

```powershell
npm test
npm run typecheck
npm run build
```

## 数据

岗位记录保存在浏览器本地存储中，键名为 `job-tracker.applications.v1`。首次打开时会展示演示数据；第一次新增或修改记录后，数据写入本机浏览器。

当前版本不包含账户、服务器数据库、邮箱同步或网站抓取。
