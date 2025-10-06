"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";
import CreateNewOwner from "./CreateNewOwner";
import useGetOwnersList from "@/lib/services/hooks/useGetOwners";
import OwnerType from "@/types/OwnerType";
import EditOwnerPage from "./EditOwner";

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const { data, isLoading, error } = useGetOwnersList();
  const [open, setOpen] = useState(false);
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
      <HeaderPage title="Owner" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        {/* Filters */}
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
                { label: "Whole Unit", value: "Whole Unit" },
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
            <Button className="text-white">
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />

        {/* Actions */}
        <div className="flex w-full justify-end my-3">
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
                    <span className="font-medium">NRIC Number:</span>{" "}
                    {owner?.owner_profile?.nric_number}
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
                    {owner?.owner_profile?.emergency_contact_name} (
                    {owner?.owner_profile?.emergency_contact_relationship})
                  </p>
                  <p>
                    <span className="font-medium">Emergency Phone:</span>{" "}
                    {owner?.owner_profile?.emergency_contact_phone}
                  </p>
                  <p>
                    <span className="font-medium">Emergency Email:</span>{" "}
                    {owner?.owner_profile?.emergency_contact_email}
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
                <EditOwnerPage
                  ownerData={owner}
                  isOpen={open}
                  setIsOpen={setOpen}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!data || data.data.length === 0) && (
          <div className="text-center py-8 text-gray-500">No owners found.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
