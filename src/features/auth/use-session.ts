"use client";

import { useEffect, useState } from "react";
import { ANONYMOUS_SESSION, type AuthService, type AuthSession } from "./auth";

export function useSession(auth: AuthService) {
  const [session, setSession] = useState<AuthSession>(ANONYMOUS_SESSION);

  useEffect(() => {
    auth.getSession().then(setSession);
  }, [auth]);

  return session;
}
