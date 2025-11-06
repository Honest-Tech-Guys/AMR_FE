"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Funnel,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import RadioCardsDemo from "@/components/RaidoTab";
import Datatable, { Column } from "@/components/datatable";
import { useState } from "react";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { Separator } from "@/components/ui/separator";
import CreateNewUser from "./CreateNewUser";
import useGetUserList from "@/lib/services/hooks/useGetUserList";
import type User from "@/types/UserType";
// import CreateInvoice from "./CreateInvoice";
const options = [
  {
    value: "Vacant",
    label: "Vacant (50)",
  },
  {
    value: "Occupied",
    label: "Occupied (32)",
  },
  {
    value: "Deactivated ",
    label: "Deactivated (24)",
  },
];
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
  const UserColumns: Column<User>[] = [
    {
      title: "ID",
      key: "id",
      sortable: true,
      className: "pl-6 py-4",
      render: (user) => (
        <div className="pl-4 text-primary font-medium ">{user.id}</div>
      ),
    },
    {
      title: "Name",
      key: "name",
      render: (user) => <div>{user.name}</div>,
    },
    {
      title: "Email",
      key: "email",
      render: (user) => <div>{user.email}</div>,
    },
    {
      title: "Roles",
      key: "roles",
      render: (user) => (
        <div>
          {user.roles && user.roles.length > 0
            ? user.roles.map((role) => role.name).join(", ")
            : "-"}
        </div>
      ),
    },
    {
      title: "Status",
      key: "email_verified_at",
      render: (user) => (
        <div>{user.email_verified_at ? "Active" : "Inactive"}</div>
      ),
      sortable: true,
    },
    {
      title: "Created At",
      key: "created_at",
      render: (user) => (
        <div>
          {user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "-"}
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

  // const { data, isLoading, error } = useGetPropertiesList({});
  const { data, isPending, error } = useGetUserList();
  // Map API data to table format
  const users: User[] = data?.data || [];
  const paginationData = {
    page: data?.current_page || 1,
    per_page: data?.per_page || 10,
    last_page: data?.last_page || 1,
  };

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
      {/* <HeaderPage title="User Management" /> */}
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
            <CreateNewUser />
          </div>
        </div>

        <Datatable<User>
          columns={UserColumns}
          data={users}
          isPending={isPending}
          pagination={{
            ...pagination,
            last_page: paginationData.last_page,
          }}
          setPagination={setPagination}
          rowKey={(item: User) => item.id}
        />
        {error && <div className="text-red-500 mt-2">Error loading users.</div>}
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
