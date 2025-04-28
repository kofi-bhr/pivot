"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const departments = [
  { value: "civil_rights", label: "Civil Rights" },
  { value: "economics", label: "Economics" },
  { value: "education", label: "Education" },
  { value: "environment", label: "Environment" },
  { value: "public_health", label: "Public Health" },
] as const;

type Department = typeof departments[number]['value'];

interface Author {
  id: string;
  first_name: string;
  last_name: string;
}

interface BriefFormProps {
  brief?: {
    id: string;
    title: string;
    summary: string;
    content: string;
    department: Department;
    author_id: string;
    published: boolean;
  };
  authors: Author[];
}

export default function BriefForm({ brief, authors }: BriefFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const briefData = {
      title: formData.get("title"),
      summary: formData.get("summary"),
      content: formData.get("content"),
      department: formData.get("department"),
      author_id: formData.get("author_id"),
      published: formData.get("published") === "true",
    };

    try {
      if (brief?.id) {
        await supabase
          .from("briefs")
          .update(briefData)
          .eq("id", brief.id);
      } else {
        await supabase
          .from("briefs")
          .insert([briefData]);
      }
      router.push("/admin/briefs");
      router.refresh();
    } catch (error) {
      console.error("Error saving brief:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          defaultValue={brief?.title}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          id="department"
          name="department"
          required
          defaultValue={brief?.department}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="author_id" className="block text-sm font-medium text-gray-700">
          Author
        </label>
        <select
          id="author_id"
          name="author_id"
          required
          defaultValue={brief?.author_id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select an author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.first_name} {author.last_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          required
          defaultValue={brief?.summary}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          required
          defaultValue={brief?.content}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="published" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="published"
          name="published"
          defaultValue={brief?.published ? "true" : "false"}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="false">Draft</option>
          <option value="true">Published</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
