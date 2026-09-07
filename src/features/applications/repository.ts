import type { Application } from "./model";

export interface ApplicationRepository {
  list(): Promise<Application[]>;
  save(record: Application): Promise<void>;
  remove(id: string): Promise<void>;
}
