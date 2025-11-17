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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Grid,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyDropdown from "../grid-view/PropertyDropDown";
import EditProperty from "./Actions/EditProperty";
import CreateBulkPropertyModal from "./CreateBulkPropertyModal";
import CreateNewProperty from "./CreateNewProperty";
import { Unit } from "@/types/UnitType";
import CreateUnit from "./Actions/CreateUnit";
import { Input } from "@/components/ui/input";
import UnitDropdown from "../grid-view/UnitDropDown";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    { value: "", label: "ALL", count: "" },
    { value: "Vacant", label: "Vacant ", count: "" },
    { value: "Fully Occupied", label: "Fully Occupied ", count: "" },
    { value: "Partially Occupied", label: "Partially Occupied", count: "" },
    { value: "Deactivated", label: "Deactivated", count: "" },
  ]);
  const router = useRouter();
  const [expandedPropertyId, setExpandedPropertyId] = useState<number | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [openView, setOpenView] = useState(false);
  const [openAddUnit, setOpenAddUnit] = useState(false);

  const togglePropertyExpansion = (propertyId: number) => {
    setExpandedPropertyId(
      expandedPropertyId === propertyId ? null : propertyId
    );
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
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  // useEffect(() => {
  //   if (query.status) {
  //     setFormFilters((prev) => ({
  //       ...prev,
  //       status: query.status,
  //     }));
  //   }
  // }, [query.status]);

  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, isPending, error } =
    useGetPropertiesList(appliedFilters);

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
        { value: "", label: "ALL", count: "" },
        { value: "Vacant", label: "Vacant ", count: `${data.counters.Vacant}` },
        {
          value: "Fully Occupied",
          label: "Fully Occupied ",
          count: `${data.counters["Fully Occupied"]}`,
        },
        {
          value: "Partially Occupied",
          label: "Partially Occupied",
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

  // --- SEARCH / SORT STATE ---
  // Keys use actual data fields:
  // property_name, property_type, owner (owner.name), address (composed), facilities
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // helper to extract searchable string / nested fields
  const getValueForSearch = (item: any, key: string) => {
    if (!item) return "";
    if (key === "owner") return (item.owner?.name ?? "").toString();
    if (key === "address") {
      // compose address fields (adjust fields to your model)
      const parts = [
        item.city,
        item.state,
        item.address_line_1,
        item.address_line_2,
      ].filter(Boolean);
      return parts.join(" ");
    }
    // default: direct field (property_name, property_type, facilities, ...)
    const val = item[key];
    if (val == null) return "";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  // prepare base array safely
  const propertiesArray: any[] = data?.properties?.data ?? [];

  const filteredData = propertiesArray
    .filter((item) =>
      // for every search term key -> must match
      Object.entries(searchTerms).every(([key, value]) => {
        if (!value) return true;
        const source = getValueForSearch(item, key);
        return source.toLowerCase().includes(value.toLowerCase());
      })
    )
    .sort((a, b) => {
      if (!sortKey || !sortOrder) return 0;
      const aVal = getValueForSearch(a, sortKey).toLowerCase();
      const bVal = getValueForSearch(b, sortKey).toLowerCase();
      if (sortOrder === "asc") return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });

  useEffect(() => {
    setFormFilters({ ...formFilters, status: query.status });
    setAppliedFilters({
      ...formFilters,
      status: query.status,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.per_page, query.status]);

  const tableData: Property[] = filteredData ?? [];

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
              placeholder: "Unit Number",
              type: "input",
              icon: Search,
            },
            {
              name: "rental_type",
              placeholder: "Unit Type",
              type: "select",
              selectItems: [
                { label: "Whole Unit", value: "Whole Unit" },
                { label: "Room", value: "Room" },
                { label: "Car Park", value: "Car Park" },
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
              <TableRow className="p-2 bg-gray-50 text-xs">
                {/* Empty column for checkbox or icons */}
                <TableHead className="w-12"></TableHead>

                {/* Property */}
                <TableHead className="text-gray-600 py-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-x-2">
                      <span>Property</span>
                      <span
                        className="cursor-pointer"
                        onClick={() => handleSort("property_name")}
                      >
                        {sortKey === "property_name" ? (
                          sortOrder === "asc" ? (
                            <ArrowUp size={12} />
                          ) : (
                            <ArrowDown size={12} />
                          )
                        ) : (
                          <ArrowUpDown size={12} />
                        )}
                      </span>
                    </div>
                    <Input
                      className="mt-2 w-full bg-white font-normal text-xs placeholder:text-xs"
                      placeholder="Search Property"
                      value={searchTerms.property_name ?? ""}
                      onChange={(e) =>
                        setSearchTerms((prev) => ({
                          ...prev,
                          property_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </TableHead>

                {/* Type */}
                <TableHead className="text-gray-600 py-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-x-2">
                      <span>Type</span>
                      <span
                        className="cursor-pointer"
                        onClick={() => handleSort("property_type")}
                      >
                        {sortKey === "property_type" ? (
                          sortOrder === "asc" ? (
                            <ArrowUp size={12} />
                          ) : (
                            <ArrowDown size={12} />
                          )
                        ) : (
                          <ArrowUpDown size={12} />
                        )}
                      </span>
                    </div>
                    <Input
                      className="mt-2 w-full bg-white font-normal text-xs placeholder:text-xs"
                      placeholder="Search Type"
                      value={searchTerms.property_type ?? ""}
                      onChange={(e) =>
                        setSearchTerms((prev) => ({
                          ...prev,
                          property_type: e.target.value,
                        }))
                      }
                    />
                  </div>
                </TableHead>

                {/* Owner */}
                <TableHead className="text-gray-600 py-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-x-2">
                      <span>Owner</span>
                      <span
                        className="cursor-pointer"
                        onClick={() => handleSort("owner")}
                      >
                        {sortKey === "owner" ? (
                          sortOrder === "asc" ? (
                            <ArrowUp size={12} />
                          ) : (
                            <ArrowDown size={12} />
                          )
                        ) : (
                          <ArrowUpDown size={12} />
                        )}
                      </span>
                    </div>
                    <Input
                      className="mt-2 w-full bg-white font-normal text-xs placeholder:text-xs"
                      placeholder="Search Owner"
                      value={searchTerms.owner ?? ""}
                      onChange={(e) =>
                        setSearchTerms((prev) => ({
                          ...prev,
                          owner: e.target.value,
                        }))
                      }
                    />
                  </div>
                </TableHead>

                {/* Address */}
                <TableHead className="text-gray-600 py-4">
                  <div className="flex flex-col items-center">
                    <span>Address</span>
                    <Input
                      className="mt-2 w-full bg-white font-normal text-xs placeholder:text-xs"
                      placeholder="Search Address"
                      value={searchTerms.address ?? ""}
                      onChange={(e) =>
                        setSearchTerms((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>
                </TableHead>

                {/* Facilities */}
                <TableHead className="text-gray-600 py-4">
                  <div className="flex flex-col items-center">
                    <span>Facilities</span>
                    <Input
                      className="mt-2 w-full bg-white font-normal text-xs placeholder:text-xs"
                      placeholder="Search Facilities"
                      value={searchTerms.facilities ?? ""}
                      onChange={(e) =>
                        setSearchTerms((prev) => ({
                          ...prev,
                          facilities: e.target.value,
                        }))
                      }
                    />
                  </div>
                </TableHead>

                {/* Actions */}
                <TableHead className="text-gray-600 text-center pr-6">
                  Actions
                </TableHead>
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
                      <TableCell>{property.owner?.name}</TableCell>
                      <TableCell>
                        <div className="break-words whitespace-normal max-w-xs">
                          {property.city},{property.state},
                          {property.address_line_1}
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
                        <TableCell
                          colSpan={7}
                          className="bg-gradient-to-r from-green-50 to-blue-50 p-0"
                        >
                          <div className="px-12 py-6">
                            <div className="mb-4 flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Grid className="w-5 h-5 text-primary" />
                                Units in {property.property_name}
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  {property.units?.length || 0} units
                                </span>
                              </h3>
                              <Button
                                className="flex items-center gap-2 text-sm text-white"
                                onClick={() => {
                                  setOpenAddUnit(true);
                                }}
                              >
                                <Plus className="w-4 h-4" />
                                Add Unit
                              </Button>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                              {!property.units ||
                              property.units.length === 0 ? (
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
                                    {property.units.map((unit: Unit) => (
                                      <TableRow
                                        key={unit.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <TableCell className="font-medium">
                                          {unit.block_floor_unit_number || "-"}
                                        </TableCell>
                                        <TableCell>
                                          {unit.status === "Occupied" ||
                                          unit.status === "occupied" ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                              <CheckCircle className="w-3 h-3" />
                                              Occupied
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                              <XCircle className="w-3 h-3" />
                                              Vacant
                                            </span>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">
                                              {unit?.last_active_tenancy[0]
                                                ?.tenant.name || "-"}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          {unit.rental_type || "-"}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                              RM
                                            </span>
                                            <span className="font-medium">
                                              {" "}
                                              {unit.last_active_tenancy[0]
                                                ?.rental_fee || "0"}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <UnitDropdown unit={unit} />
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
          {/* {!isLoading && tableData.length > 0 && <PaginationControls />} */}
        </div>

        {error && (
          <div className="text-red-500 mt-2">Error loading properties.</div>
        )}
      </div>
      <CreateUnit
        id={expandedPropertyId as number}
        open={openAddUnit}
        onOpenChange={setOpenAddUnit}
      />
      <EditProperty
        onOpenChange={setOpenView}
        open={openView}
        property={selectedProperty}
      />
    </div>
  );
};

export default Page;
