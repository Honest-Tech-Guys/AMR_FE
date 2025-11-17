"use client";
import { useEffect, useState, useMemo } from "react";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import CreateNewProperty from "../list-view/CreateNewProperty";
import CreateBulkPropertyModal from "../list-view/CreateBulkPropertyModal";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PropertyCard from "./PropertyCard";
interface PaginationData {
  page: number;
  per_page: number;
  last_page?: number;
  links?: {
    active: boolean;
    url: string | null;
    label: string;
  }[];
}
const Page = () => {
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const { data, isPending } = useGetPropertiesList({
    ...appliedFilters,
    page: pagination.page.toString(),
    per_page: pagination.per_page.toString(),
  });
  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        page: data?.properties.current_page ?? prev.page,
        per_page: data?.properties.per_page ?? prev.per_page,
        last_page: data?.properties.last_page ?? prev.last_page,
        links: data?.properties.links ?? prev.links,
      }));
    }
  }, [data]);
  useEffect(() => {
    setAppliedFilters((prev) => ({
      ...prev,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    }));
  }, [pagination.page, pagination.per_page]);
  console.log(pagination.last_page);
  return (
    <div>
      {/* <HeaderPage title="Property (Grid View)" /> */}
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        {/* Actions */}
        <div className="flex w-full justify-between my-3 items-center">
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
            <CreateBulkPropertyModal />
            <CreateNewProperty />
          </div>
        </div>

        {/* Properties */}
        <div className="grid grid-cols-1 gap-5">
          {data?.properties.data.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Pagination */}
      </div>
    </div>
  );
};

export default Page;
