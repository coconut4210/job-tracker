"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Building2, CalendarDays, ChevronRight, LayoutGrid, List, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { DndContext, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { APPLICATION_STATUSES, EMPTY_FILTERS, type Application, type ApplicationDraft, type ApplicationFilters, type ApplicationStatus } from "./model";
import { GuestAuthService } from "@/features/auth/auth";
import { useSession } from "@/features/auth/use-session";
import { createApplicationRepository } from "./create-repository";
import { useApplications } from "./use-applications";
import { calculateMetrics } from "./metrics";
import { filterApplications } from "./filter";
import { SAMPLE_APPLICATIONS } from "./sample-data";

const authService = new GuestAuthService();
const categories = ["大厂", "中厂", "小厂", "国央企", "外企", "政府"];
const industries = ["互联网", "电商", "金融", "农林牧渔", "快消", "制造业", "公共服务"];
const jobCategories = ["产品", "运营", "市场", "销售", "数据", "技术", "职能"];
const emptyDraft: ApplicationDraft = { companyName: "", city: "", companyCategory: "", industry: "", jobTitle: "", jobCategory: "", appliedDate: "", status: "待投递", jobUrl: "" };

export default function TrackerDashboard() {
  const session = useSession(authService);
  const repository = useMemo(() => createApplicationRepository(session, SAMPLE_APPLICATIONS), [session]);
  const { records, error, save, remove } = useApplications(repository);
  const [view, setView] = useState<"table" | "board">("table");
  const [filters, setFilters] = useState<ApplicationFilters>(EMPTY_FILTERS);
  const [selected, setSelected] = useState<Application | "new" | null>(null);
  const metrics = calculateMetrics(records);
  const visible = filterApplications(records, filters);

  const setFilter = (key: keyof ApplicationFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const changeStatus = (id: string, status: ApplicationStatus) => {
    const record = records.find((item) => item.id === id);
    if (record) save({ ...record, status }, id);
  };

  return (
    <main className="shell">
      <header className="masthead">
        <div><span className="eyebrow">CAREER WORKBENCH</span><h1>求职进度</h1><p>把每一次机会，放在看得见的地方。</p></div>
        <span className="save-state"><i /> 数据保存在本机</span>
      </header>

      <section className="summary-strip" aria-label="求职概况">
        <Metric icon={<BriefcaseBusiness />} label="已投递岗位数" value={metrics.appliedJobs} suffix="个岗位" />
        <Metric icon={<Building2 />} label="已投递公司数" value={metrics.appliedCompanies} suffix="家公司" />
        <Metric icon={<CalendarDays />} label="已开始求职天数" value={metrics.searchDays} suffix="天" />
      </section>

      <section className="workspace">
        <div className="toolbar">
          <label className="search"><Search size={17} /><input aria-label="搜索岗位" placeholder="搜索公司或岗位" value={filters.query} onChange={(event) => setFilter("query", event.target.value)} /></label>
          <div className="filters"><SlidersHorizontal size={16} />
            <Filter label="城市" values={[...new Set(records.map((r) => r.city).filter(Boolean))]} value={filters.city} onChange={(v) => setFilter("city", v)} />
            <Filter label="公司规模" values={categories} value={filters.companyCategory} onChange={(v) => setFilter("companyCategory", v)} />
            <Filter label="行业" values={industries} value={filters.industry} onChange={(v) => setFilter("industry", v)} />
            <Filter label="岗位类型" values={jobCategories} value={filters.jobCategory} onChange={(v) => setFilter("jobCategory", v)} />
            <Filter label="状态" values={[...APPLICATION_STATUSES]} value={filters.status} onChange={(v) => setFilter("status", v)} />
          </div>
          <div className="toolbar-actions">
            <div className="view-switch"><button className={view === "table" ? "active" : ""} aria-label="列表视图" onClick={() => setView("table")}><List size={17} /></button><button className={view === "board" ? "active" : ""} aria-label="看板视图" onClick={() => setView("board")}><LayoutGrid size={17} /></button></div>
            <button className="primary" onClick={() => setSelected("new")}><Plus size={17} />新增岗位</button>
          </div>
        </div>
        {error && <div className="error-banner">{error}</div>}
        <div className="result-meta"><strong>{view === "table" ? "岗位列表" : "流程看板"}</strong><span>{visible.length} 条记录</span></div>
        {view === "table" ? <ApplicationTable records={visible} onOpen={(record) => setSelected(record)} /> : <ApplicationBoard records={visible} onStatusChange={changeStatus} />}
      </section>

      {selected && <ApplicationPanel record={selected === "new" ? null : selected} onClose={() => setSelected(null)} onSave={async (draft, id) => { await save(draft, id); setSelected(null); }} onDelete={async (id) => { if (confirm("确认删除这条岗位记录？")) { await remove(id); setSelected(null); } }} />}
    </main>
  );
}

function Metric({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: number; suffix: string }) {
  return <article className="metric"><span className="metric-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong><small>{suffix}</small></div></article>;
}

function Filter({ label, values, value, onChange }: { label: string; values: readonly string[]; value: string; onChange: (value: string) => void }) {
  return <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}><option value="">{label}</option>{values.map((item) => <option key={item}>{item}</option>)}</select>;
}

function ApplicationTable({ records, onOpen }: { records: Application[]; onOpen: (record: Application) => void }) {
  return <div className="table-wrap"><table><thead><tr><th>公司名称</th><th>所在城市</th><th>岗位名称</th><th>当前状态</th><th>更多</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td className="company-cell">{record.companyName}</td><td>{record.city || "—"}</td><td className="title-cell" title={record.jobTitle}>{record.jobTitle}</td><td><StatusBadge status={record.status} /></td><td><button className="more" onClick={() => onOpen(record)}>更多 <ChevronRight size={15} /></button></td></tr>)}</tbody></table>{records.length === 0 && <Empty />}</div>;
}

function StatusBadge({ status }: { status: ApplicationStatus }) { return <span className={`badge badge-${APPLICATION_STATUSES.indexOf(status)}`}>{status}</span>; }

function DraggableCard({ record }: { record: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: record.id });
  return <article ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }} className={`job-card ${isDragging ? "dragging" : ""}`} {...listeners} {...attributes}><div><strong>{record.companyName}</strong><span>|</span><small>{record.city || "城市待定"}</small></div><h3 title={record.jobTitle}>{record.jobTitle}</h3></article>;
}

function BoardColumn({ status, records }: { status: ApplicationStatus; records: Application[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return <section ref={setNodeRef} className={`board-column ${isOver ? "over" : ""}`}><header><h2>{status}</h2><span>{records.length}</span></header><div className="card-stack">{records.map((record) => <DraggableCard key={record.id} record={record} />)}{records.length === 0 && <span className="drop-hint">拖放到这里</span>}</div></section>;
}

function ApplicationBoard({ records, onStatusChange }: { records: Application[]; onStatusChange: (id: string, status: ApplicationStatus) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor));
  const onDragEnd = ({ active, over }: DragEndEvent) => { if (over && APPLICATION_STATUSES.includes(over.id as ApplicationStatus)) onStatusChange(String(active.id), over.id as ApplicationStatus); };
  return <DndContext sensors={sensors} onDragEnd={onDragEnd}><div className="board">{APPLICATION_STATUSES.map((status) => <BoardColumn key={status} status={status} records={records.filter((record) => record.status === status)} />)}</div></DndContext>;
}

function Empty() { return <div className="empty"><BriefcaseBusiness size={28} /><strong>这里还没有匹配的岗位</strong><span>调整筛选条件，或新增一条岗位记录。</span></div>; }

function ApplicationPanel({ record, onClose, onSave, onDelete }: { record: Application | null; onClose: () => void; onSave: (draft: ApplicationDraft, id?: string) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [draft, setDraft] = useState<ApplicationDraft>(record ? { ...record } : emptyDraft);
  const [message, setMessage] = useState("");
  const update = (key: keyof ApplicationDraft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!draft.companyName.trim() || !draft.jobTitle.trim()) return setMessage("请填写公司名称和岗位名称"); if (draft.status !== "待投递" && !draft.appliedDate) return setMessage("请选择投递日期"); if (draft.jobUrl) { try { new URL(draft.jobUrl); } catch { return setMessage("请输入有效链接"); } } await onSave(draft, record?.id); };
  return <div className="panel-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><aside role="dialog" aria-modal="true" aria-label={record ? "岗位详情" : "新增岗位"} className="panel"><header><div><span className="eyebrow">APPLICATION RECORD</span><h2>{record ? "岗位详情" : "新增岗位"}</h2></div><button className="icon-button" aria-label="关闭" onClick={onClose}><X /></button></header><form onSubmit={submit}>
    <Field label="公司名称"><input value={draft.companyName} onChange={(e) => update("companyName", e.target.value)} /></Field>
    <div className="form-grid"><Field label="所在城市"><input value={draft.city} onChange={(e) => update("city", e.target.value)} /></Field><Field label="公司规模/性质"><input list="categories" value={draft.companyCategory} onChange={(e) => update("companyCategory", e.target.value)} /><datalist id="categories">{categories.map((v) => <option key={v}>{v}</option>)}</datalist></Field></div>
    <Field label="公司行业"><input list="industries" value={draft.industry} onChange={(e) => update("industry", e.target.value)} /><datalist id="industries">{industries.map((v) => <option key={v}>{v}</option>)}</datalist></Field>
    <Field label="岗位名称"><input value={draft.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} /></Field>
    <div className="form-grid"><Field label="岗位类型"><input list="job-categories" value={draft.jobCategory} onChange={(e) => update("jobCategory", e.target.value)} /><datalist id="job-categories">{jobCategories.map((v) => <option key={v}>{v}</option>)}</datalist></Field><Field label="投递日期"><input type="date" value={draft.appliedDate} onChange={(e) => update("appliedDate", e.target.value)} /></Field></div>
    <Field label="当前状态"><select value={draft.status} onChange={(e) => update("status", e.target.value)}>{APPLICATION_STATUSES.map((v) => <option key={v}>{v}</option>)}</select></Field>
    <Field label="官网/岗位链接"><input type="url" placeholder="https://" value={draft.jobUrl} onChange={(e) => update("jobUrl", e.target.value)} /></Field>
    {message && <p className="form-error">{message}</p>}<footer>{record && <button type="button" className="danger" onClick={() => onDelete(record.id)}>删除记录</button>}<span /><button type="button" className="secondary" onClick={onClose}>取消</button><button className="primary">保存岗位</button></footer>
  </form></aside></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field"><span>{label}</span>{children}</label>; }
