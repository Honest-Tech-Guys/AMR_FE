"use client";
import HeaderPage from "@/components/HeaderPage";

import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import CreateNewTenant from "./CreateNewTenant";

import useGetTenantList from "@/lib/services/hooks/useGetTenantsList";
import EditTenant from "./EditTenant";
import { TenantType } from "@/types/TenantType";

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const { data, isLoading, error } = useGetTenantList();
  const [open, setOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantType>();
  const filters = [
    <InputWithIcon key="property" icon={Search} placeholder="Property Name" />,
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
      {/* <HeaderPage title="Tenant" /> */}
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
            <CreateNewTenant />
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading tenants...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500">Error loading tenants.</div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((tenant) => (
              <div
                key={tenant.id}
                className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <label
                  className="font-bold text-[#337AB7] text-lg cursor-pointer"
                  onClick={() => {
                    setSelectedTenant(tenant);
                    setOpen(true);
                  }}
                >
                  {tenant.name}
                </label>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Entity:</span>{" "}
                    {tenant?.tenant_profile?.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span>{" "}
                    {tenant?.tenant_profile?.alt_phone_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {tenant?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nationality:</span>{" "}
                    {tenant?.tenant_profile?.nationality}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Gender:</span>{" "}
                    {tenant?.tenant_profile?.gender}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Race:</span>{" "}
                    {tenant?.tenant_profile?.race}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Identity:</span>{" "}
                    {tenant?.tenant_profile?.type} -{" "}
                    {tenant?.tenant_profile?.nric_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span>{" "}
                    {tenant?.tenant_profile?.address_line_1},{" "}
                    {tenant?.tenant_profile?.city},{" "}
                    {tenant?.tenant_profile?.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Emergency Contact:</span>{" "}
                    {tenant?.tenant_profile?.emergency_contact_name} (
                    {tenant?.tenant_profile?.emergency_contact_relationship})
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Emergency Phone:</span>{" "}
                    {tenant?.tenant_profile?.emergency_contact_phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">iCoins:</span> -
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-sm">Status:</span>
                    <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                      Active
                    </Badge>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <EditTenant
          tenant={selectedTenant as TenantType}
          isOpen={open}
          setIsOpen={setOpen}
        />

        {!isLoading && !error && (!data || data.length === 0) && (
          <div className="text-center py-8">
            <div className="text-gray-500">No tenants found.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
