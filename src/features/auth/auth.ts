export type AuthStatus = "anonymous" | "authenticated";

export interface AuthSession {
  status: AuthStatus;
  userId: string | null;
}

export const ANONYMOUS_SESSION: AuthSession = { status: "anonymous", userId: null };

export interface AuthService {
  getSession(): Promise<AuthSession>;
  signIn(provider: string): Promise<AuthSession>;
  signOut(): Promise<AuthSession>;
}

export class GuestAuthService implements AuthService {
  async getSession() { return ANONYMOUS_SESSION; }
  async signIn(_provider: string) { return ANONYMOUS_SESSION; }
  async signOut() { return ANONYMOUS_SESSION; }
}
