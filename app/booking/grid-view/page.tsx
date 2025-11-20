"use client";
import useGetBooksList from "@/lib/services/hooks/usGetBooks";
import {
  CheckCheck,
  FileText,
  LoaderCircle,
  TrendingDownIcon,
  TrendingUp,
} from "lucide-react";
import BookingCard from "./BookingCard";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CreateBulkBookModal from "../list-view/CreateBulkBookingModal";
import CreateNewBooking from "../list-view/CreateNewBooking";

const Page = () => {
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
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

  const stats = [
    {
      label: "Total Booking",
      value: "100",
      icon: FileText,
      color: "bg-green-50",
    },
    {
      label: "Completed",
      value: "3",
      icon: CheckCheck,
      color: "bg-green-50",
    },
    {
      label: "Last Month",
      value: "80",
      icon: TrendingDownIcon,
      color: "bg-green-50",
    },
    {
      label: "Next Month",
      value: "4",
      icon: TrendingUp,
      color: "bg-green-50",
    },
  ];
  if (isPending) {
    return <LoaderCircle className="animate-spin" />;
  }
  return (
    <div className="w-full p-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white hover:border-green-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-slate-800">
                  {stat.value ?? 0}
                </p>
              </div>
              <div
                className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <HeaderPage title="Booking (List View)" /> */}
      <div className="flex w-full justify-between my-3 bg-white p-5 rounded-2xl shadow-sm">
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
                      if (pagination.page >= (pagination.last_page as number)) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {data?.data.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default Page;
