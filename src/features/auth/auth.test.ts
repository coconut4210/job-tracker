import { ANONYMOUS_SESSION, GuestAuthService } from "./auth";
import { createApplicationRepository } from "@/features/applications/create-repository";
import { LocalStorageApplicationRepository } from "@/features/applications/local-storage-repository";

test("guest auth grants access without a user", async () => {
  const auth = new GuestAuthService();
  const session = await auth.getSession();
  expect(session.status).toBe("anonymous");
  expect(session.userId).toBeNull();
  expect(session).toEqual(ANONYMOUS_SESSION);
});

test("guest sign-in and sign-out stay anonymous", async () => {
  const auth = new GuestAuthService();
  expect(await auth.signIn("email")).toEqual(ANONYMOUS_SESSION);
  expect(await auth.signOut()).toEqual(ANONYMOUS_SESSION);
});

test("anonymous session uses the local repository", () => {
  const repository = createApplicationRepository(ANONYMOUS_SESSION);
  expect(repository).toBeInstanceOf(LocalStorageApplicationRepository);
});

test("authenticated session still returns a repository without blocking", () => {
  const repository = createApplicationRepository({ status: "authenticated", userId: "user-1" });
  expect(repository).toBeInstanceOf(LocalStorageApplicationRepository);
});
