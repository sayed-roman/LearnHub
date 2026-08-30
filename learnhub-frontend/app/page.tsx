"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCourses } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import { Code2, Rocket, Target } from "lucide-react";

export default function HomePage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(data.slice(0, 3)))
      .catch(() => setCourses([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-5">
            Learn. Practice. <span className="text-accent">Grow.</span>
          </h1>
          <p className="text-lg text-muted mb-8 max-w-md">
            LearnHub helps you master technical skills through structured
            courses, hands-on lessons, and practical assessments built for
            real progress.
          </p>
          <div className="flex gap-3">
            <Link href="/courses" className="btn-primary">
              Explore Courses
            </Link>
            <Link href="/register" className="btn-secondary">
              Start Learning
            </Link>
          </div>
        </div>
        <div className="card p-10 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm">Structured Curriculum</p>
              <p className="text-xs text-muted">Step-by-step lessons that build on each other</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm">Track Your Progress</p>
              <p className="text-xs text-muted">See exactly how far you&apos;ve come</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm">Test Your Knowledge</p>
              <p className="text-xs text-muted">Quizzes that reinforce what you learn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Courses</h2>
          <Link href="/courses" className="text-sm font-medium text-accent hover:underline">
            View all &rarr;
          </Link>
        </div>
        {courses.length === 0 ? (
          <p className="text-muted text-sm">No courses available yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <CourseCard key={c.documentId} course={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
