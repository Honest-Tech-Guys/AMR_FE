"use client";
import HeaderPage from "@/components/HeaderPage";

import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
// import CreateNewOwner from "./CreateNewOwner";
import useGetOwnersList from "@/lib/services/hooks/useGetOwners";
import OwnerType from "@/types/OwnerType";
import { Separator } from "@/components/ui/separator";
import ViewTenancy from "./ViewTenancy";

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  // const { data, isLoading, error } = useGetOwnersList();
  const data = [
    {
      id: 1,
      name: "John Doe",
      type: "Individual",
      property: "Sunshine Apartments",
      tenancy: "12 months",
      rental: "770",
      tenancy_start_date: "2023-01-01",
      tenancy_end_date: "2023-12-31",
      smart_meter: "META B-07-01 R2",
      balance: "46.7",
      status: "Active",
      top_up: "Last update 01 Jun 07:58 PM",
    },
    {
      id: 2,
      name: "Jane Smith",
      type: "Company",
      property: "Green Villas",
      tenancy: "24 months",
      rental: "770",
      tenancy_start_date: "2022-06-01",
      tenancy_end_date: "2024-05-31",
      smart_meter: "META B-07-01 R2",
      balance: "46.7",
      status: "Inactive",
      top_up: "Last update 01 Jun 07:58 PM",
    },
    {
      id: 3,
      name: "Alice Lee",
      type: "Individual",
      property: "Blue Condos",
      tenancy: "6 months",
      rental: "770",
      tenancy_start_date: "2023-03-15",
      tenancy_end_date: "2023-09-14",
      smart_meter: "META B-07-01 R2",
      balance: "46.7",
      status: "Active",
      top_up: "Last update 01 Jun 07:58 PM",
    },
  ];
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

  return (
    <div>
      <HeaderPage title="Tenancy" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter filters={filters} actionButton={actionButton} />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            {/* <CreateNewOwner /> */}
          </div>
        </div>
        {/* 
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading owners...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500">Error loading owners.</div>
          </div>
        )} */}

        {
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((tenancy) => (
              <div
                key={tenancy.id}
                className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                {/* <label className="font-bold text-[#337AB7] text-lg">
                  {tenancy.name}
                </label> */}
                <p className="flex items-center gap-2">
                  <Badge className="text-[#F6FFED] bg-[#52C41A] font-normal  border-[#B7EB8F]">
                    Active
                  </Badge>
                  <Badge className="bg-gray-100 text-black font-normal  border-1">
                    Auto Pay Not Activated
                  </Badge>
                </p>
                <p className="text-sm text-gray-600">
                  <p className="font-medium">Tenant</p>{" "}
                  <span className="font-bold text-lg">{tenancy.name}</span>
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {tenancy.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Property:</span>{" "}
                    {tenancy.property}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tenancy:</span>{" "}
                    {tenancy.tenancy}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Rental:</span> MRY
                    {" " + tenancy.rental}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">
                      <p className="font-medium">Tenancy Start Date</p>{" "}
                      {tenancy.tenancy_start_date}
                    </p>
                    <p className="text-sm text-gray-600 max-w-29">
                      <p className="font-medium">Tenancy End Date</p>{" "}
                      {tenancy.tenancy_end_date}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className=" flex  flex-col gap-2">
                      <p className="text-sm text-gray-600">
                        <p className="font-medium">Smart Meter</p>{" "}
                        {tenancy.smart_meter}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Balance</span>{" "}
                        {tenancy.balance} unit
                      </p>
                      <p className="text-primary text-sm ">Sync Balance</p>
                    </div>
                    <div>
                      {" "}
                      <p className="text-sm text-gray-600 max-w-28">
                        <p className="font-medium ">Top Up</p> {tenancy.top_up}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="my-5" />
                <div className="flex justify-center text-sm font-normal text-primary">
                  <ViewTenancy />
                </div>
              </div>
            ))}
          </div>
        }

        {/* {!isLoading && !error && (!data || data.length === 0) && (
          <div className="text-center py-8">
            <div className="text-gray-500">No owners found.</div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Page;
