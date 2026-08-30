"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import { Search } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-bold mb-2">All Courses</h1>
      <p className="text-muted mb-8">Browse our full catalog of technical courses.</p>

      <div className="relative max-w-md mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading courses...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted text-sm">No courses found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CourseCard key={c.documentId} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
