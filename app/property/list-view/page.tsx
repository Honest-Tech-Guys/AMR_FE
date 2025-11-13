"use client";
import { InputWithIcon } from "@/components/InpuWithIcon";
import RadioCardsDemo from "@/components/RaidoTab";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { Property } from "@/types/PropertyType";
import { 
  Calendar, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Home, 
  Users, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Plus,
  ArrowUpDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyDropdown from "../grid-view/PropertyDropDown";
import EditProperty from "./Actions/EditProperty";
import CreateBulkPropertyModal from "./CreateBulkPropertyModal";
import CreateNewProperty from "./CreateNewProperty";

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
  const [options, setOptions] = useState([
    {
      value: "",
      label: "ALL",
      count: "",
    },
    {
      value: "Vacant",
      label: "Vacant ",
      count: "",
    },
    {
      value: "Fully Occupied",
      label: "Fully Occupied ",
      count: "",
    },
    {
      value: "Partially Occupied",
      label: "Partially Occupied",
      count: "",
    },
    {
      value: "Deactivated",
      label: "Deactivated",
      count: "",
    },
  ]);
  
  const router = useRouter();
  const [expandedPropertyId, setExpandedPropertyId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [openView, setOpenView] = useState(false);

  const togglePropertyExpansion = (propertyId: number) => {
    setExpandedPropertyId(expandedPropertyId === propertyId ? null : propertyId);
  };

  const [formFilters, setFormFilters] = useState({
    property_name: "",
    unit_name: "",
    rental_type: "",
    Meter_and_lock: "",
    data_range: "",
    status: "",
    page: "1",
    per_page: "10",
  });

  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, error } = useGetPropertiesList(appliedFilters);

  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        page: data?.properties.current_page ?? prev.page,
        per_page: data?.properties.per_page ?? prev.per_page,
        last_page: data?.properties.last_page ?? prev.last_page,
        links: data?.properties.links ?? prev.links,
      }));
      setOptions([
        {
          value: "",
          label: "ALL",
          count: "",
        },
        {
          value: "Vacant",
          label: "Vacant ",
          count: `${data.counters.Vacant}`,
        },
        {
          value: "Fully Occupied",
          label: "Fully Occupied ",
          count: `${data.counters["Fully Occupied"]}`,
        },
        {
          value: "Partially Occupied ",
          label: "Partially Occupied ",
          count: `${data.counters["Partially Occupied"]}`,
        },
        {
          value: "Deactivated",
          label: "Deactivated",
          count: `${data.counters["Deactivated"]}`,
        },
      ]);
    }
  }, [data]);

  useEffect(() => {
    setAppliedFilters({
      ...formFilters,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    });
  }, [pagination.page, pagination.per_page]);

  const tableData: Property[] =
    data?.properties.data.map((item: Property) => item) ?? [];

  // Pagination component
  const PaginationControls = () => {
    const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= (pagination.last_page || 1)) {
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    };

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Page {pagination.page} of {pagination.last_page}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.last_page}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
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
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <CreateBulkPropertyModal />
            <CreateNewProperty />
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <RadioCardsDemo
            options={options}
            value={(appliedFilters as { status?: string })?.status || ""}
            onChange={(val) =>
              setAppliedFilters((prev) => ({ ...prev, status: val }))
            }
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                    Property
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                    Owner
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Facilities</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No properties found.
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((property) => (
                  <>
                    {/* Property Row */}
                    <TableRow
                      key={property.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => togglePropertyExpansion(property.id)}
                    >
                      <TableCell>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePropertyExpansion(property.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {expandedPropertyId === property.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center gap-2 text-primary font-medium cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProperty(property);
                            setOpenView(true);
                          }}
                        >
                          <Home className="w-5 h-5 text-primary" />
                          {property.property_name}
                        </div>
                      </TableCell>
                      <TableCell>{property.property_type}</TableCell>
                      <TableCell>{property.owner.name}</TableCell>
                      <TableCell>
                        <div className="break-words whitespace-normal max-w-xs">
                          {property.city},{property.state},{property.address_line_1}
                        </div>
                      </TableCell>
                      <TableCell>{property?.facilities}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <PropertyDropdown property={property} />
                      </TableCell>
                    </TableRow>

                    {/* Expandable Units Row */}
                    {expandedPropertyId === property.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gradient-to-r from-green-50 to-blue-50 p-0">
                          <div className="px-12 py-6">
                            <div className="mb-4 flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Home className="w-5 h-5 text-primary" />
                                Units in {property.property_name}
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  {property.units?.length || 0} units
                                </span>
                              </h3>
                              <Button className="flex items-center gap-2 text-sm">
                                <Plus className="w-4 h-4" />
                                Add Unit
                              </Button>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                              {!property.units || property.units.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                  No units available for this property
                                </div>
                              ) : (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Unit Name</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Tenant</TableHead>
                                      <TableHead>Rental Type</TableHead>
                                      <TableHead>Monthly Rent</TableHead>
                                      <TableHead>Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {property.units.map((unit: any) => (
                                      <TableRow key={unit.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                          {unit.unit_name || unit.name || '-'}
                                        </TableCell>
                                        <TableCell>
                                          {unit.status === 'Occupied' || unit.status === 'occupied' ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                              <CheckCircle className="w-3 h-3" />
                                              Occupied
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                              <XCircle className="w-3 h-3" />
                                              Vacant
                                            </span>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">
                                              {unit.tenant_name || unit.tenant || '-'}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          {unit.rental_type || '-'}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">
                                              RM {unit.monthly_rent || unit.rent || '0'}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-xs"
                                              onClick={() => {
                                                console.log('View unit:', unit.id);
                                              }}
                                            >
                                              View
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-xs"
                                              onClick={() => {
                                                console.log('Edit unit:', unit.id);
                                              }}
                                            >
                                              Edit
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!isLoading && tableData.length > 0 && <PaginationControls />}
        </div>

        {error && (
          <div className="text-red-500 mt-2">Error loading properties.</div>
        )}
      </div>

      <EditProperty
        onOpenChange={setOpenView}
        open={openView}
        property={selectedProperty}
      />
    </div>
  );
};

export default Page;