type Department = "civil_rights" | "economics" | "education" | "environment" | "public_health";

interface DepartmentBadgeProps {
  department: Department;
}

const departmentConfig = {
  civil_rights: {
    label: "Civil Rights",
    color: "bg-purple-100 text-purple-800",
  },
  economics: {
    label: "Economics",
    color: "bg-blue-100 text-blue-800",
  },
  education: {
    label: "Education",
    color: "bg-green-100 text-green-800",
  },
  environment: {
    label: "Environment",
    color: "bg-emerald-100 text-emerald-800",
  },
  public_health: {
    label: "Public Health",
    color: "bg-red-100 text-red-800",
  },
};

export function DepartmentBadge({ department }: DepartmentBadgeProps) {
  const config = departmentConfig[department];
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}
