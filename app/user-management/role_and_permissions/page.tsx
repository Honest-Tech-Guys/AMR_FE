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
import CreateNewRole from "./CreateRole";
import useGetRole from "@/lib/services/hooks/useGetRole";
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
type user = {
  user_no: string;
  role: string;
  Identifier: string;
  user_id: string;
  description: string;
};
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
  const UserColumns: Column<user>[] = [
    {
      title: "No",
      key: "user_no",
      sortable: true,
      className: "pl-6 py-4",
      render: (order) => (
        <div className="pl-4 text-primary font-medium ">
          {order.user_no ?? "-"}
        </div>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (order) => <div>{order.role ?? "-"}</div>,
    },
    {
      title: "Identifier",
      key: "identifier",
      sortable: true,
    },
    {
      title: "Description",
      key: "description",
      sortable: true,
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
  const tableData = (data || []).map((item) => ({
    property_id: item.name ?? "-",
    unit: "-", // Replace with actual unit info if available
    room: "-", // Replace with actual room info if available
    smart_home: "-", // Replace with actual smart home info if available
    owner_name: "-", // Replace with actual owner name if available
    rental: "-", // Replace with actual rental info if available
    tenancy: "-", // Replace with actual tenancy info if available
    status: "-", // Replace with actual status if available
  }));

  return (
    <div>
      <HeaderPage title="Roles and Permissions" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter filters={filters} actionButton={actionButton} />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            {/* <Button className="rounded-[6px] text-white ">
              Create New Expenses
            </Button> */}
            <CreateNewRole />
          </div>
        </div>

        <div className="flex items-end justify-end">
          <div className=" flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsFilter((prev) => !prev)}
              className="rounded-[6px] h-6 m-0"
            >
              <Funnel className="mr-2" />
              Fast Filter {isFilter ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </div>
        <Datatable<user>
          columns={UserColumns}
          data={[
            {
              user_no: "U12345",
              role: "admin",
              Identifier: "ID-987654",
              user_id: "user_001",
              description: "Administrator with full access to the system",
            },
          ]}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: user) => item.user_no}
          isFilter={isFilter}
        />
        {error && (
          <div className="text-red-500 mt-2">Error loading properties.</div>
        )}
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
