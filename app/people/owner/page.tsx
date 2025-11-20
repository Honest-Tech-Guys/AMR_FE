"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";
import CreateNewOwner from "./CreateNewOwner";
import useGetOwnersList from "@/lib/services/hooks/useGetOwners";
import OwnerType from "@/types/OwnerType";
import EditOwnerPage from "./EditOwner";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Page = () => {
  const [selectedOwner, setSelectedOwner] = useState<OwnerType>();

  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [formFilters, setFormFilters] = useState({
    owner_name: "",
    owner_email: "",
    phone: "",
    type: "",
    identity_number: "",
    page: "1",
    per_page: "10",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, error, isPending } =
    useGetOwnersList(appliedFilters);
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
      {/* <HeaderPage title="Owner" /> */}
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        {/* Filters */}
        <ResponsiveFilter
          filters={[
            {
              name: "owner_name",
              placeholder: "Owner Name",
              type: "input",
              icon: Search,
            },
            {
              name: "owner_email",
              placeholder: "Owner Email",
              type: "input",
              icon: Search,
            },
            {
              name: "phone",
              placeholder: "Phone",
              type: "input",
              icon: Search,
            },
            {
              name: "type",
              placeholder: "Type",
              type: "select",
              selectItems: [
                { label: "Individual", value: "Individual" },
                { label: "Company", value: "Company" },
              ],
              icon: Search,
            },
            {
              name: "identity_number",
              placeholder: "Identity Number",
              type: "input",
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
            <CreateNewOwner />
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="text-center py-8 text-gray-500">
            Loading owners...
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-red-500">
            Error loading owners.
          </div>
        )}

        {/* Owners Grid */}
        {!isLoading && !error && (data?.data?.length as number) > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data.map((owner: OwnerType) => (
              <div
                key={owner.id}
                className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <label
                  className="font-bold text-[#337AB7] text-lg"
                  onClick={() => {
                    setSelectedOwner(owner);
                    setOpen(true);
                  }}
                >
                  {owner.name}
                </label>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Email:</span> {owner.email}
                  </p>
                  <p>
                    <span className="font-medium">Nationality:</span>{" "}
                    {owner?.owner_profile?.nationality}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {owner?.owner_profile?.gender}
                  </p>
                  <p>
                    <span className="font-medium">Race:</span>{" "}
                    {owner?.owner_profile?.race}
                  </p>
                  <p>
                    <span className="font-medium">Identity Number:</span>{" "}
                    {owner?.owner_profile?.identity_number}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {owner?.owner_profile?.type}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {owner?.owner_profile?.alt_phone_number}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {owner?.owner_profile?.address_line_1},{" "}
                    {owner?.owner_profile?.city}, {owner?.owner_profile?.state},{" "}
                    {owner?.owner_profile?.country}
                  </p>
                  <p>
                    <span className="font-medium">Emergency Contact:</span>{" "}
                    {owner?.owner_profile?.emergency_name} (
                    {owner?.owner_profile?.emergency_relationship})
                  </p>
                  <p>
                    <span className="font-medium">Emergency Phone:</span>{" "}
                    {owner?.owner_profile?.emergency_phone}
                  </p>
                  <p>
                    <span className="font-medium">Emergency Email:</span>{" "}
                    {owner?.owner_profile?.emergency_email}
                  </p>
                  <p>
                    <span className="font-medium">Remarks:</span>{" "}
                    {owner?.owner_profile?.remarks}
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                      Active
                    </Badge>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <EditOwnerPage
          ownerData={selectedOwner as OwnerType}
          isOpen={open}
          setIsOpen={setOpen}
        />
        {/* Empty State */}
        {!isLoading && !error && (!data || data.data.length === 0) && (
          <div className="text-center py-8 text-gray-500">No owners found.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
