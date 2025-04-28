import Link from "next/link";

const departments = [
  {
    id: "civil_rights",
    name: "Civil Rights",
    description: "Advocating for equality, justice, and fundamental human rights for all.",
    color: "bg-purple-500",
  },
  {
    id: "economics",
    name: "Economics",
    description: "Analyzing economic policies and their impact on communities.",
    color: "bg-blue-500",
  },
  {
    id: "education",
    name: "Education",
    description: "Promoting equitable access to quality education and learning opportunities.",
    color: "bg-green-500",
  },
  {
    id: "environment",
    name: "Environment",
    description: "Addressing climate change and environmental sustainability.",
    color: "bg-emerald-500",
  },
  {
    id: "public_health",
    name: "Public Health",
    description: "Improving health outcomes and healthcare accessibility.",
    color: "bg-red-500",
  },
];

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Policy Departments</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <Link
            key={dept.id}
            href={`/departments/${dept.id}`}
            className="group block"
          >
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className={`${dept.color} h-2`} />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {dept.name}
                </h2>
                <p className="text-gray-600">{dept.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
