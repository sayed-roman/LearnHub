"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { getAllUsers, getAllRoles, changeUserRole, getCourses, getBlogPosts } from "@/lib/api";
import { Users, BookOpen, FileText } from "lucide-react";

function AdminPanel({ token }: { token: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [courseCount, setCourseCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  function load() {
    Promise.all([
      getAllUsers(token),
      getAllRoles(token),
      getCourses(token),
      getBlogPosts(token),
    ])
      .then(([u, r, c, p]) => {
        setUsers(u);
        setRoles(r.filter((role: any) => role.type !== "authenticated" && role.type !== "public"));
        setCourseCount(c.length);
        setPostCount(p.length);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  async function handleRoleChange(userId: number, roleId: number) {
    setSavingId(userId);
    try {
      await changeUserRole(token, userId, roleId);
      load();
    } catch (err: any) {
      alert(err.message || "Could not update role");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
      <p className="text-muted mb-8">Manage users, roles, and see platform stats.</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="card p-5">
          <Users className="h-5 w-5 text-accent mb-2" />
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-sm text-muted">Total users</p>
        </div>
        <div className="card p-5">
          <BookOpen className="h-5 w-5 text-accent mb-2" />
          <p className="text-2xl font-bold">{courseCount}</p>
          <p className="text-sm text-muted">Courses</p>
        </div>
        <div className="card p-5">
          <FileText className="h-5 w-5 text-accent mb-2" />
          <p className="text-2xl font-bold">{postCount}</p>
          <p className="text-sm text-muted">Blog posts</p>
        </div>
      </div>

      <h2 className="font-semibold mb-4">Users</h2>
      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className="input-field py-1.5 text-sm"
                      value={u.role?.id}
                      disabled={savingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, Number(e.target.value))}
                    >
                      {roles.map((r: any) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <RequireAuth allowedRoles={["Admin"]}>
        {(_user, token) => <AdminPanel token={token} />}
      </RequireAuth>
    </div>
  );
}
