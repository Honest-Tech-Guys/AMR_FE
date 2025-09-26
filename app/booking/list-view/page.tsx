"use client";

import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { Calendar, ChevronDown, ChevronUp, Funnel, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import CreateNewBooking from "./CreateNewBooking";
import Datatable, { Column } from "@/components/datatable";
import { useState } from "react";
import useGetBooksList from "@/lib/services/hooks/usGetBooks";
import { Book } from "@/types/BookType";
import { Badge } from "@/components/ui/badge";

type PropertyTableRow = {
  property_id: string;
  unit: string;
  room: string;
  tenant_name: string;
  rental: string;
  rental_frequency: string;
  status: string;
};

// Color function for booking statuses
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        className: "bg-[#FFF7E6] text-[#D46B08] border-[#FFD591]",
        text: "Pending",
      };
    case "confirmed":
      return {
        className: "bg-[#F6FFED] text-[#52C41A] border-[#B7EB8F]",
        text: "Confirmed",
      };
    case "canceled":
      return {
        className: "bg-[#FFF2F0] text-[#FF4D4F] border-[#FFCCC7]",
        text: "Canceled",
      };
    case "completed":
      return {
        className: "bg-[#E6F7FF] text-[#1890FF] border-[#91D5FF]",
        text: "Completed",
      };
    default:
      return {
        className: "bg-gray-100 text-gray-600 border-gray-300",
        text: status,
      };
  }
};

// Mapping Book[] to PropertyTableRow[]
const mapBooksToTable = (books: Book[]): PropertyTableRow[] => {
  return books.map((book) => {
    let propertyName = "";
    let unitNumber = "";
    let roomName = "";

    // Check if bookable is Property
    if ("property_name" in book.bookable) {
      propertyName = book.bookable.property_name;
    }
    // Check if bookable is Unit
    else if ("unit_number" in book.bookable) {
      propertyName = book.bookable.property?.property_name || "";
      unitNumber = book.bookable.unit_number;
    }
    // Check if bookable is Room
    else if ("name" in book.bookable) {
      propertyName = book.bookable.unit?.property?.property_name || "";
      unitNumber = book.bookable.unit?.unit_number || "";
      roomName = book.bookable.name;
    }

    return {
      property_id: propertyName,
      unit: unitNumber,
      room: roomName || "N/A",
      tenant_name: book.tenant.name,
      rental: book.rental_fee,
      rental_frequency: book.rental_payment_frequency,
      status: book.status,
    };
  });
};

const invoiceColumns: Column<PropertyTableRow>[] = [
  {
    title: "Property",
    key: "property_id",
    sortable: true,
    className: "pl-6 py-4",
    render: (row) => (
      <div className="pl-4 text-primary font-medium">{row.property_id}</div>
    ),
  },
  {
    title: "Unit",
    key: "unit",
    sortable: true,
    render: (row) => <div>{row.unit}</div>,
  },
  {
    title: "Room",
    key: "room",
    render: (row) => <div>{row.room}</div>,
  },
  {
    title: "Tenant Name",
    key: "tenant_name",
    render: (row) => <div>{row.tenant_name}</div>,
  },
  {
    title: "Rental",
    key: "rental",
    render: (row) => <div>{row.rental}</div>,
  },
  {
    title: "Rental Frequency",
    key: "rental_frequency",
    render: (row) => <div>{row.rental_frequency}</div>,
  },
  {
    title: "Status",
    key: "status",
    sortable: true,
    render: (row) => {
      const statusColor = getStatusColor(row.status);
      return (
        <Badge className={`rounded-[6px] ${statusColor.className}`}>
          {statusColor.text}
        </Badge>
      );
    },
  },
];

interface PaginationData {
  page: number;
  per_page: number;
}

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading } = useGetBooksList(); // data: Book[]

  const filters = [
    <InputWithIcon key="booking" icon={Search} placeholder="Booking" />,
    <InputWithIcon key="unit" icon={Search} placeholder="Unit Name" />,
    <InputWithIcon key="rental" icon={Search} placeholder="Rental Type" />,
    <InputWithIcon key="meter" icon={Search} placeholder="Meter & Lock" />,
    <InputWithIcon key="date" icon={Calendar} placeholder="Date Range" />,
  ];

  const actionButton = (
    <Button key="search" className="rounded-[6px]">
      <Search className="size-4 text-white" strokeWidth={2.5} />
    </Button>
  );
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
      <HeaderPage title="Booking" />
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
                { label: "Sublet", value: "Sublet" },
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
            <Button className="bg-black rounded-[6px] text-white hover:bg-black/70">
              Create Bulk Booking
            </Button>
            <CreateNewBooking />
          </div>
        </div>

        {/* Filter toggle */}
        <div className="flex items-end justify-end">
          <div className="flex justify-end">
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

        <Datatable<PropertyTableRow>
          columns={invoiceColumns}
          data={data ? mapBooksToTable(data) : []}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item) => item.property_id}
          // isFilter={isFilter}
        />
      </div>
    </div>
  );
};

export default Page;
