"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { Column } from "@/components/datatable";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";

import SettlementTable from "./TableData";
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
type property = {
  property_id: string;
  unit: string;
  room: string;
  smart_home: string;
  owner_name: string;
  rental: string;
  tenancy: string;
  status: string;
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
  const invoiceColumns: Column<property>[] = [
    {
      title: "Property",
      key: "Property_id",
      sortable: true,
      className: "pl-6 py-4",
      render: (order) => (
        <div className="pl-4 text-primary font-medium ">
          {order.property_id ?? "-"}
        </div>
      ),
    },
    {
      title: "Unit",
      key: "unit",
      sortable: true,
      render: (user) => <div>{user.unit}</div>,
    },
    {
      title: "Status",
      key: "status",
      sortable: true,
    },
    {
      title: "Room",
      key: "room",
      render: (order) => <div>{order.room}</div>,
    },
    {
      title: "Smart Home",
      key: "smart_home",
      render: (order) => <div>{order.smart_home}</div>,
    },
    {
      title: "Owner Name",
      key: "owner_name",
      render: (order) => <div>{order.owner_name}</div>,
    },
    {
      title: "Rental",
      key: "rental",
      render: (order) => <div>{order.rental}</div>,
    },
    {
      title: "Tenancy",
      key: "tenancy",
      render: (order) => <div>{order.tenancy}</div>,
    },
  ];
  const filters = [
    <InputWithIcon key="start_date" icon={Calendar} placeholder="Start Date" />,
    <InputWithIcon key="end_date" icon={Calendar} placeholder="End Date" />,
  ];

  const actionButton = (
    <Button key="search" className="rounded-[6px]">
      <Search className="size-4 text-white" strokeWidth={2.5} />
    </Button>
  );

  // const { data, isLoading, error } = useGetPropertiesList();

  // // Map API data to table format
  // const tableData = (data || []).map((item) => ({
  //   property_id: item.property_name ?? "-",
  //   unit: "-", // Replace with actual unit info if available
  //   room: "-", // Replace with actual room info if available
  //   smart_home: "-", // Replace with actual smart home info if available
  //   owner_name: "-", // Replace with actual owner name if available
  //   rental: "-", // Replace with actual rental info if available
  //   tenancy: "-", // Replace with actual tenancy info if available
  //   status: "-", // Replace with actual status if available
  // }));
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    unit_name: "",
    rental_type: "",
    Meter_and_lock: "",
    data_range: "",
    status: "all",
    page: "1",
    per_page: "10",
  });
  return (
    <div>
      <HeaderPage title="Settlement" />
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
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <Button className=" bg-transparent border-1 rounded-[6px] text-Black hover:bg-transparent ">
              Clear
            </Button>
            <Button className=" rounded-[6px] text-white ">
              Export To Excel
            </Button>
          </div>
        </div>
        {/*  */}
        {/* <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 text-xs">
              <TableHead></TableHead>
              <TableHead>Settlement Date</TableHead>
              <TableHead>Settlement ID</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Gross</TableHead>
              <TableHead>MDR</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Net</TableHead>
              <TableHead>Net (Payex)</TableHead>
              <TableHead>Net (Others)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger
                  classNameIcon="hidden"
                  className=" hover:no-underline flex items-center justify-start font-semibold gap-2  rounded-none"
                >
                  <TableRow>
                    <TableCell>
                      <Plus />
                    </TableCell>
                    <TableCell>Key Deposit</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 text-xs">
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Invoice Amount</TableHead>
                        <TableHead>Gross</TableHead>
                        <TableHead>MDR</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Net</TableHead>
                        <TableHead>Net (Payex)</TableHead>
                        <TableHead>Net (Others)</TableHead>
                        <TableHead>P.Datetime</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="flex gap-2">
                          {" "}
                          <PenLine className="size-4 text-primary" />
                          <Share2 className="size-4 text-primary" />
                        </TableCell>
                        <TableCell>Whole Unit</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>NO</TableCell>
                        <TableCell>NO</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TableBody>
        </Table> */}
        <SettlementTable />
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
