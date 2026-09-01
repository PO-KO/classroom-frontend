import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "@/providers/constants";
// import { DEPARTMENT_OPTIONS } from "@/providers/constants";
import { ClassDetails, Subject, User } from "@/types";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { query: subjectsQry } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: teachersQry } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: USER_ROLES.TEACHER }],
    pagination: {
      pageSize: 100,
    },
  });

  const subjects = subjectsQry?.data?.data || [];
  const teachers = teachersQry?.data?.data || [];

  const subjectFilters =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subject",
            operator: "eq" as const,
            value: selectedSubject,
          },
        ];

  const teacherFilters =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "user",
            operator: "eq" as const,
            value: selectedTeacher,
          },
        ];

  const statusFilters =
    selectedStatus === "all"
      ? []
      : [
          {
            field: "status",
            operator: "eq" as const,
            value: selectedStatus,
          },
        ];

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const classesTable = useTable<ClassDetails>({
    columns: useMemo<ColumnDef<ClassDetails>[]>(
      () => [
        {
          id: "name",
          accessorKey: "name",
          size: 200,
          header: () => <p className="column-title">Name</p>,
          cell: ({ getValue }) => (
            <span className="text-forground">{getValue<string>()}</span>
          ),
        },
        {
          id: "subject",
          accessorKey: "subject.name",
          size: 200,
          header: () => <p className="column-title">Subject</p>,
          cell: ({ getValue }) => (
            <Badge variant="outline" className="capitalize">
              {getValue<string>()}
            </Badge>
          ),
        },
        {
          id: "teacher",
          accessorKey: "user.name",
          size: 200,
          header: () => <p className="column-title">Teacher</p>,
          cell: ({ getValue }) => (
            <Badge variant="secondary" className="capitalize">
              {getValue<string>()}
            </Badge>
          ),
        },
        {
          id: "capacity",
          accessorKey: "capacity",
          size: 200,
          header: () => <p className="column-title">Teacher</p>,
          cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        },
        {
          id: "status",
          accessorKey: "status",
          size: 200,
          header: () => <p className="column-title">Status</p>,
          cell: ({ getValue }) => (
            <Badge
              className="capitalize"
              variant={
                getValue<string>() === "inactive" ? "destructive" : "default"
              }
            >
              {getValue<string>()}
            </Badge>
          ),
        },
        {
          id: "description",
          accessorKey: "description",
          size: 300,
          header: () => <p className="column-title">Description</p>,
          cell: ({ getValue }) => (
            <span className="truncate line-clamp">{getValue<string>()}</span>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [
          ...subjectFilters,
          ...teacherFilters,
          ...statusFilters,
          ...searchFilters,
        ],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>
      <div className="intro-row">
        <p>Quick access to essential metrics and managemet tools.</p>
        <div className="actions-row">
          <div className="search-field mb-3">
            <Search className="search-icon" />

            <Input
              name="search"
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:auto">
            <Select
              value={selectedTeacher}
              onValueChange={setSelectedTeacher}
              disabled={teachersQry.isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem
                    key={teacher.id}
                    value={teacher.name}
                    className="capitalize"
                  >
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={subjectsQry.isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem
                    key={subject.id}
                    value={subject.name}
                    className="capitalize"
                  >
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <CreateButton />
          </div>
        </div>
      </div>
      <DataTable table={classesTable} />
    </ListView>
  );
};

export default ClassesList;
