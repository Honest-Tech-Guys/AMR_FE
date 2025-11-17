"use client";

import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { Calendar, ChevronDown, ChevronUp, Funnel, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import CreateNewBooking from "./CreateNewBooking";
import Datatable, { Column } from "@/components/datatable";
import { useEffect, useState } from "react";
import useGetBooksList from "@/lib/services/hooks/usGetBooks";
import { Book } from "@/types/BookType";
import { Badge } from "@/components/ui/badge";
import { Unit } from "@/types/UnitType";
import { Room } from "@/types/RoomType";
import CreateBulkBookModal from "./CreateBulkBookingModal";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
      propertyName = book.bookable.property_name as string;
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

const bookingColumns: Column<Book>[] = [
  {
    title: "Property",
    key: "bookable.property.property_name",
    sortable: true,
    className: "pl-6 py-4",
    render: (row) => (
      <div className="pl-4 text-primary font-medium">
        {"unit" in row.bookable
          ? (row.bookable as Room).unit.property.property_name
          : (row.bookable as Unit).property.property_name}
      </div>
    ),
  },
  {
    title: "Unit",
    key: "bookable.block_floor_unit_number",
    sortable: true,
    render: (row) => (
      <div>
        {" "}
        {"unit" in row.bookable
          ? (row.bookable as Room).unit.block_floor_unit_number
          : (row.bookable as Unit).block_floor_unit_number}
      </div>
    ),
  },
  {
    title: "Room",
    key: "bookable.name",
    render: (row) => (
      <div> {"unit" in row.bookable ? (row.bookable as Room).name : "-"}</div>
    ),
  },
  {
    title: "Tenant Name",
    key: "tenant.name",
    render: (row) => <div>{row.tenant.name}</div>,
  },
  {
    title: "Rental",
    key: "rental_fee",
    render: (row) => <div>{row.rental_fee}</div>,
  },
  {
    title: "Rental Frequency",
    key: "rental_payment_frequency",
    render: (row) => <div>{row.rental_payment_frequency}</div>,
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

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });

  // data: Book[]

  const filters = [
    <InputWithIcon key="booking" icon={Search} placeholder="Booking" />,
    <InputWithIcon key="unit" icon={Search} placeholder="Unit Number" />,
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
    tenant_name: "",
    owner_name: "",
    status: "",
    data_range: "",
    page: "1",
    per_page: "10",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, isPending } = useGetBooksList(appliedFilters);
  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        page: data?.current_page ?? prev.page,
        per_page: data?.per_page ?? prev.per_page,
        last_page: data?.last_page ?? prev.last_page,
        links: data?.links ?? prev.links,
      }));
    }
  }, [data]);
  useEffect(() => {
    setAppliedFilters({
      ...formFilters,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.per_page]);

  return (
    <div>
      {/* <HeaderPage title="Booking (List View)" /> */}
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
              name: "tenant_name",
              placeholder: "Tenant Name",
              type: "input",
              icon: Search,
            },
            {
              name: "owner_name",
              placeholder: "Owner Name",
              type: "input",
              icon: Search,
            },
            {
              name: "status",
              placeholder: "Status",
              type: "select",
              selectItems: [
                { label: "Pending", value: "Pending" },
                { label: "Confirmed", value: "Confirmed" },
                { label: "Completed", value: "Completed" },
                { label: "Canceled", value: "Canceled" },
              ],
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
              onClick={() => setAppliedFilters(formFilters)}
              className="text-white"
            >
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />
        {/* Actions */}
        <div className="flex w-full justify-between my-3">
          <div>
            {!isPending && (
              <Pagination>
                <PaginationContent className="flex justify-between w-full">
                  <PaginationItem className="text-xs text-gray-600">
                    Page {pagination.page} of {pagination.last_page}
                  </PaginationItem>
                  <PaginationItem className="flex gap-x-2">
                    <PaginationControl
                      pagination={pagination}
                      setPagination={setPagination}
                    />
                    <PaginationPrevious
                      onClick={() => {
                        if (pagination.page <= 1) {
                          null;
                        } else {
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                          }));
                        }
                      }}
                      isActive={pagination.page > 1}
                      className={`bg-gray-100 cursor-pointer ${
                        pagination.page <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <PaginationNext
                      onClick={() => {
                        if (
                          pagination.page >= (pagination.last_page as number)
                        ) {
                          null;
                        } else {
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                          }));
                        }
                      }}
                      isActive={pagination.page < (pagination.last_page ?? 1)}
                      className={`bg-gray-100 cursor-pointer ${
                        pagination.page >= (pagination.last_page as number)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
          <div className="flex flex-wrap space-x-3">
            <CreateBulkBookModal />
            <CreateNewBooking />
          </div>
        </div>

        {/* Filter toggle */}

        <Datatable<Book>
          columns={bookingColumns}
          data={data?.data ?? []}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item) => item.id}
          // isFilter={isFilter}
        />
      </div>
    </div>
  );
};

export default Page;
