import type { Application } from "./model";
import type { ApplicationRepository } from "./repository";
import { storedApplicationsSchema } from "./schema";

const STORAGE_KEY = "job-tracker.applications.v1";

export class LocalStorageApplicationRepository implements ApplicationRepository {
  constructor(private readonly seed: Application[] = []) {}

  async list(): Promise<Application[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.seed;
      const parsed = storedApplicationsSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : [];
    } catch {
      return [];
    }
  }

  async save(record: Application) {
    const records = await this.list();
    const index = records.findIndex((item) => item.id === record.id);
    if (index >= 0) records[index] = record;
    else records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  async remove(id: string) {
    const records = (await this.list()).filter((record) => record.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}
