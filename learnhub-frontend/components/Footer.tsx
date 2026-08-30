import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold">
          <GraduationCap className="h-5 w-5 text-accent" />
          LearnHub
        </div>
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} LearnHub. Built for learning, made for growth.
        </p>
        <div className="flex gap-5 text-sm text-muted">
          <Link href="/courses" className="hover:text-accent transition-colors">
            Courses
          </Link>
          <Link href="/blog" className="hover:text-accent transition-colors">
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}
