"use client";

import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Calendar, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

import useGetLocksList from "@/lib/services/hooks/useGetLockList";
import CreateLock from "./CreateLock";
import EditLock from "./EditLock";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

const Page = () => {
  const [openView, setOpenView] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Locks>();

  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    owner_name: "",
    tenant_name: "",
    lock_serial: "",
    status: "",
    page: "1",
    per_page: "10",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, isPending } = useGetLocksList(appliedFilters);
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
      {/* <HeaderPage title="Lock" /> */}
      <div className="w-full mt-5 mb-10 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter
          filters={[
            {
              name: "property_name",
              placeholder: "Property Name",
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
              name: "tenant_name",
              placeholder: "Tenant Name",
              type: "input",
              icon: Search,
            },
            {
              name: "lock_serial",
              placeholder: "Lock Serial",
              type: "input",
              icon: Search,
            },
            {
              name: "status",
              placeholder: "Status",
              type: "select",
              selectItems: [
                { label: "ON", value: "on" },
                { label: "OFF", value: "off" },
              ],
              icon: Search,
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
        <div className="flex w-full justify-between my-3">
          <div>
            {!isPending && (
              <Pagination>
                <PaginationContent className="flex justify-between w-full items-center">
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
            <CreateLock />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
          {data?.data?.map((lock) => (
            <div className=" border rounded-2xl p-3">
              <label
                className="font-bold text-[#337AB7] cursor-pointer"
                onClick={() => {
                  setOpenView(true);
                  setSelectedItem(lock);
                }}
              >
                {lock.serial_number}
              </label>
              <div>
                <p>Battery: 95</p>
                <p>Gateway: N/H</p>
                <p>Unit Price: RM 0.6</p>
                <p>Property: </p>
                <p>Unit: Block p19</p>
                <p>Room : Room 2 </p>
                <div className="flex gap-1">
                  <User /> 5
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <MapWithPoints /> */}
      {selectedItem && (
        <EditLock
          lock={selectedItem}
          onOpenChange={setOpenView}
          open={openView}
        />
      )}
    </div>
  );
};

export default Page;
