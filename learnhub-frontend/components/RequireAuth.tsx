"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, StoredUser } from "@/lib/auth";

export default function RequireAuth({
  allowedRoles,
  children,
}: {
  allowedRoles?: string[];
  children: (user: StoredUser, token: string) => React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    const u = getStoredUser();
    if (!t || !u) {
      router.push("/login");
      return;
    }
    if (allowedRoles && u.role && !allowedRoles.includes(u.role.name)) {
      router.push("/dashboard");
      return;
    }
    setToken(t);
    setUser(u);
    setReady(true);
  }, [router, allowedRoles]);

  if (!ready || !user || !token) {
    return (
      <div className="flex items-center justify-center py-24 text-muted">Loading...</div>
    );
  }

  return <>{children(user, token)}</>;
}
