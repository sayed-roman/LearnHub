import Link from "next/link";
import { BookOpen, User } from "lucide-react";

export default function CourseCard({ course }: { course: any }) {
  const title = course.title;
  const description = course.description;
  const instructorName = course.instructor?.username || "Unassigned";
  const lessonCount = course.lessons?.length ?? null;

  return (
    <Link href={`/courses/${course.documentId}`} className="card block overflow-hidden">
      <div className="h-36 bg-surface-muted flex items-center justify-center">
        {course.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.coverImageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <BookOpen className="h-10 w-10 text-muted" strokeWidth={1.5} />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1.5 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted line-clamp-2 mb-3">{description}</p>
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {instructorName}
          </span>
          {lessonCount !== null && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {lessonCount} lessons
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
