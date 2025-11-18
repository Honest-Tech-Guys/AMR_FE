"use client";
import Datatable, { Column } from "@/components/datatable";
import useGetRole from "@/lib/services/hooks/useGetRole";
import type Role from "@/types/RoleType";
import { useState } from "react";
import CreateNewRole from "./CreateRole";
import EditRole from "./EditRole";
interface PaginationData {
  page: number;
  per_page: number;
}

const Page = () => {
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const RoleColumns: Column<Role>[] = [
    {
      title: "Role ID",
      key: "id",
      render: (role) => <div>{role.id ?? "-"}</div>,
    },
    {
      title: "Role Name",
      key: "name",
      sortable: true,
      className: "pl-6 py-4",
      render: (role) => (
        <div className="pl-4 text-primary font-medium ">{role.name}</div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (role) => (
        <div className="flex justify-center text-primary text-center font-medium ">
          <EditRole role={role} />
        </div>
      ),
    },
  ];
  const { data, isLoading, error } = useGetRole();
  const roles: Role[] = data || [];
  return (
    <div>
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <CreateNewRole />
          </div>
        </div>
        <Datatable<Role>
          columns={RoleColumns}
          data={roles}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: Role) => item.name}
        />
        {error && <div className="text-red-500 mt-2">Error loading roles.</div>}
      </div>
    </div>
  );
};

export default Page;
