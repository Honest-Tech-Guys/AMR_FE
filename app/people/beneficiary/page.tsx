"use client";

import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import useGetBeneficiariesList from "@/lib/services/hooks/useGetBeneficiariesList";
import CreateNewBeneficiary from "./CreateNewBeneficiary";

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch beneficiaries
  const { data, isLoading, error } = useGetBeneficiariesList();

  const [formFilters, setFormFilters] = useState({
    name: "",
    nationality: "",
    gender: "",
    race: "",
    date_range: "",
    status: "all",
    page: "1",
    per_page: "10",
  });

  return (
    <div>
      {/* <HeaderPage title="Beneficiaries" /> */}

      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        {/* Filter Bar */}
        <ResponsiveFilter
          filters={[
            {
              name: "date_range",
              placeholder: "Beneficiary Name",
              type: "input",
              icon: Search,
            },
            {
              name: "date_range",
              placeholder: "Nationality",
              type: "input",
              icon: Search,
            },
            {
              name: "date_range",
              placeholder: "Gender",
              type: "select",
              selectItems: [
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ],
              icon: Search,
            },
            {
              name: "date_range",
              placeholder: "Race",
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
            <Button className="text-white">
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />

        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            {/* Add new beneficiary button could go here */}
            <CreateNewBeneficiary />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading beneficiaries...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-500">Error loading beneficiaries.</div>
          </div>
        )}

        {/* Data Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <label
                  className="font-bold text-[#337AB7] text-lg cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  {beneficiary.name}
                </label>

                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {beneficiary.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span>{" "}
                    {beneficiary.beneficiary_profile?.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nationality:</span>{" "}
                    {beneficiary.beneficiary_profile?.nationality}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Gender:</span>{" "}
                    {beneficiary.beneficiary_profile?.gender}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Race:</span>{" "}
                    {beneficiary.beneficiary_profile?.race}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">NRIC Number:</span>{" "}
                    {beneficiary.beneficiary_profile?.nric_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span>{" "}
                    {beneficiary.beneficiary_profile?.address_line_1},{" "}
                    {beneficiary.beneficiary_profile?.city},{" "}
                    {beneficiary.beneficiary_profile?.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Emergency Contact:</span>{" "}
                    {beneficiary.beneficiary_profile?.emergency_contact_name} (
                    {
                      beneficiary.beneficiary_profile
                        ?.emergency_contact_relationship
                    }
                    )
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Emergency Phone:</span>{" "}
                    {beneficiary.beneficiary_profile?.emergency_contact_phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Remarks:</span>{" "}
                    {beneficiary.beneficiary_profile?.remarks ?? "-"}
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

        {/* Empty State */}
        {!isLoading && !error && (!data || data.length === 0) && (
          <div className="text-center py-8">
            <div className="text-gray-500">No beneficiaries found.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
