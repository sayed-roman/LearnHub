"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser, clearAuth, StoredUser } from "@/lib/auth";
import { GraduationCap, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  function handleLogout() {
    clearAuth();
    setUser(null);
    router.push("/");
  }

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="h-6 w-6 text-accent" strokeWidth={2} />
          LearnHub
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted">
                {user.username} <span className="badge ml-1">{user.role?.name}</span>
              </span>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm">
                Login
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium">
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm font-medium">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm w-full">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm w-full text-center">
                Login
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm w-full text-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
