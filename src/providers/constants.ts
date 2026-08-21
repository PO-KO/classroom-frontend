import { Subject } from "@/types";

export const API_URL = "https://api.fake-rest.refine.dev";
export const DEPARTMENTS = [
    'CS',
    'Math',
    'English'
]

export const DEPARTMENTS_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept
}))

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "CS",
    description: "Fundamental concepts of programming, algorithms, data structures, and computational problem-solving.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "MATH201",
    name: "Linear Algebra",
    department: "Math",
    description: "Study of vector spaces, matrices, systems of linear equations, eigenvalues, and linear transformations.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "ENG102",
    name: "Academic Writing & Research",
    department: "English",
    description: "Advanced composition focusing on critical reading, rhetorical analysis, and scholarly research methodologies.",
    createdAt: new Date().toISOString(),
  },
];
