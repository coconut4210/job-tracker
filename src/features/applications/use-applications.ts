"use client";

import { useEffect, useMemo, useState } from "react";
import type { Application, ApplicationDraft } from "./model";
import type { ApplicationRepository } from "./repository";

export function useApplications(repository: ApplicationRepository) {
  const [records, setRecords] = useState<Application[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    repository.list().then((stored) => {
      setRecords(stored);
      setReady(true);
    });
  }, [repository]);

  async function save(draft: ApplicationDraft, id?: string) {
    const previous = records;
    const now = new Date().toISOString();
    const existing = records.find((record) => record.id === id);
    const record: Application = { ...draft, id: id ?? crypto.randomUUID(), createdAt: existing?.createdAt ?? now, updatedAt: now };
    const next = existing ? records.map((item) => item.id === id ? record : item) : [record, ...records];
    setRecords(next);
    try { await repository.save(record); setError(""); }
    catch { setRecords(previous); setError("保存失败，请重试"); }
    return record;
  }

  async function remove(id: string) {
    const previous = records;
    setRecords(records.filter((record) => record.id !== id));
    try { await repository.remove(id); setError(""); }
    catch { setRecords(previous); setError("删除失败，请重试"); }
  }

  return useMemo(() => ({ records, ready, error, save, remove }), [records, ready, error]);
}
