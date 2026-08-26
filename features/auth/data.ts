import type { SessionUser } from "./types/user";
import { mockSessionUser } from "./fixtures";

export async function getCurrentUser(): Promise<SessionUser | null> {
  // TEMPORARY (mock data): swap body for the session lookup when backend lands.
  void mockSessionUser;
  return mockSessionUser;
}
