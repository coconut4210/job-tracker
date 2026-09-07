import type { AuthSession } from "@/features/auth/auth";
import type { Application } from "./model";
import type { ApplicationRepository } from "./repository";
import { LocalStorageApplicationRepository } from "./local-storage-repository";

export function createApplicationRepository(session: AuthSession, seed: Application[] = []): ApplicationRepository {
  if (session.status === "authenticated" && session.userId) {
    // Swap in SupabaseApplicationRepository(session.userId) when login is enabled.
    return new LocalStorageApplicationRepository(seed);
  }

  return new LocalStorageApplicationRepository(seed);
}
