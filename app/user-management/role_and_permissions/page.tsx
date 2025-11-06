"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import Datatable, { Column } from "@/components/datatable";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import useGetRole from "@/lib/services/hooks/useGetRole";
import { Calendar, Eye, Search } from "lucide-react";
import { useState } from "react";
import CreateNewRole from "./CreateRole";
import type Role from "@/types/RoleType";
import EditRole from "./EditRole";
interface PaginationData {
  page: number;
  per_page: number;
}

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [actionIsOpen, setActionsIsOpen] = useState(false);
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
  const filters = [
    <InputWithIcon key="user_name" icon={Search} placeholder="User Name" />,
    <InputWithIcon key="user_id" icon={Search} placeholder="UserId" />,
    <InputWithIcon key="status" icon={Search} placeholder="Status" />,
  ];

  const actionButton = (
    <Button key="search" className="rounded-[6px]">
      <Search className="size-4 text-white" strokeWidth={2.5} />
    </Button>
  );

  const { data, isLoading, error } = useGetRole();
  // Map API data to table format
  const roles: Role[] = data || [];
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    unit_name: "",
    rental_type: "",
    Meter_and_lock: "",
    data_range: "",
    page: "1",
    per_page: "10",
  });
  return (
    <div>
      {/* <HeaderPage title="Roles and Permissions" /> */}
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter
          filters={[
            {
              name: "property_name",
              placeholder: "Property Name",
              type: "input",
              icon: Search,
            },
            {
              name: "unit_name",
              placeholder: "Unit Name",
              type: "input",
              icon: Search,
            },
            {
              name: "rental_type",
              placeholder: "Rental Type",
              type: "select",
              selectItems: [
                { label: "whole unit", value: "Whole Unit" },
                { label: "Room Rental", value: "Room Rental" },
              ],
              icon: Search,
            },
            {
              name: "Meter_and_lock",
              placeholder: "Meter and Lock",
              type: "input",
              icon: Search,
            },
            {
              name: "date_range",
              placeholder: "Date Range",
              type: "date",
              icon: Calendar,
            },
          ]}
          actionButton={
            <Button
              // onClick={() => setAppliedFilters(formFilters)}
              className="text-white"
            >
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            {/* <Button className="rounded-[6px] text-white ">
              Create New Expenses
            </Button> */}
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
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
