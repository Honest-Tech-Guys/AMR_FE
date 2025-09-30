"use client";
import { useMemo, useState } from "react";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import CreateNewProperty from "../list-view/CreateNewProperty";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import CreateEquipment from "../list-view/Actions/CreateEquipment";
import CreateInvoice from "../list-view/Actions/CreateInvoice";
import CreateMeter from "../list-view/Actions/CreateMeter";
import CreateTenancy from "../list-view/Actions/CreateTenancy";
// import RadioCardsDemo from "@/components/RaidoTab";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bath,
  BedSingle,
  Dot,
  Gauge,
  Plus,
  Lock,
  Image,
  EllipsisVertical,
  Share2,
  KeyRound,
  House,
  Car,
  Ellipsis,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SelectWithForm } from "@/components/CustomSelect";

import { Portal } from "@radix-ui/react-portal";
import { FormProvider, useForm } from "react-hook-form";
import { capitalize } from "@/lib/utilities/Capitalize";
const ITEMS_PER_PAGE = 9; // Number of cards per page
import getMeterAndLock from "@/components/General/GetMeterAndLock";
import { getStatus } from "@/components/General/GetStatus";
import {
  getUnitStatus,
  unitStatusConfig,
} from "@/components/General/GetUnitStatus";
import EditProperty from "../list-view/Actions/EditProperty";
import AddRoomTagging from "../[id]/unit/AddRoomTagging";
import AddRoomDetails from "../[id]/unit/AddRoomDetails";
import CreateNewTenant from "../[id]/unit/CreateNewTenant";
import EditUnit from "../[id]/unit/EditUnit";
import CreateUnit from "../list-view/Actions/CreateUnit";
import CreateLock from "../list-view/Actions/CreateLock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PropertyDropdown from "./PropertyDropDown";
import ViewTenancy from "@/app/tenancy/ViewTenancy";
import UnitDropdown from "./UnitDropDown";
import RoomDropDown from "./RoomDropDown";
import CarParksDropDown from "./CarParksDropDown";
import CreateBulkPropertyModal from "../list-view/CreateBulkPropertyModal";
const Page = () => {
  const { data } = useGetPropertiesList({});
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Map API data to card format
  const cardData = useMemo(
    () =>
      data?.properties.data.map((item) => ({
        property_id: item.property_name ?? "-",
        unit: item.property_type ?? "-",
        room: item.facilities?.length ? item.facilities.join(", ") : "-",
        smart_home:
          item.facilities?.includes("meeting_room") ||
          item.facilities?.includes("game_room")
            ? "Yes"
            : "No",
        owner_name: item.property_name ?? "-",
        rental: item.address_line_1
          ? `${item.address_line_1}, ${item.city}`
          : "-",
        tenancy: `${item.city}, ${item.state}`,
        status: item.remarks || "Active",
        originalData: item, // Store the original item for actions
      })),
    [data]
  );

  // Pagination logic
  const totalPages = useMemo(() => {
    const totalItems = cardData?.length as number;
    return Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  }, [cardData]);

  // Handle page change
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  type FormValues = { status: string };
  const statusType = [
    { id: "1", name: "Not Applicable" },
    { id: "2", name: "To be Vacant , To acquire new tenet" },
    { id: "3", name: "To be Vacant , To be Reno / Maintenance " },
    { id: "4", name: "To be Vacant , To return to owner  " },
    { id: "5", name: "Upon Expiry , Existing Tenant to continue" },
    { id: "6", name: "Upon Expiry , New Tenant Acquired" },
  ];
  const form = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { status: "" },
  });
  const { handleSubmit } = form;
  const onSubmit = (formData: FormValues) => {
    console.log("Form data:", formData);
  };
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div>
      <HeaderPage title="Property (Grid View)" />
      <div className="w-full mt-5  rounded-[6px] p-3 bg-white">
        {/* Actions */}

        {/* Dialog (outside dropdown) */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Tenancy</DialogTitle>
            </DialogHeader>

            {/* Your form here */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Tenant Name"
                className="border rounded p-2 w-full"
              />
              <input
                type="text"
                placeholder="Room ID"
                className="border rounded p-2 w-full"
              />
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <CreateBulkPropertyModal />
            <CreateNewProperty />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {data?.properties.data.map((property) => (
            <div className="border rounded-2xl p-4 hover:shadow-md transition-shadow">
              {" "}
              <Accordion
                type="single"
                key={property.id}
                collapsible
                className="w-full"
              >
                <AccordionItem value="property">
                  <AccordionTrigger className="hover:no-underline cursor-pointer">
                    <div className="w-full flex justify-between">
                      <div className="">
                        <p className="text-primary hover:underline font-bold z-50 mb-3 cursor-pointer">
                          {property.property_name}
                        </p>
                        <p>{`${property.city},${property.address_line_1}`}</p>
                        <p className="flex">
                          <span>{property.property_type}</span>
                          <Dot />
                          <span>{property.units.length} Unit</span>
                          <Dot />
                          <span>
                            {property.units.reduce(
                              (total, unit) => total + unit.rooms.length,
                              0
                            )}{" "}
                            Rooms
                          </span>
                          <Dot />
                          <span>
                            {property.units.reduce(
                              (total, unit) => total + unit.carparks.length,
                              0
                            )}{" "}
                            Car Parks
                          </span>
                        </p>
                      </div>
                      <div>
                        <div>
                          {" "}
                          <PropertyDropdown property={property} />
                        </div>
                        {/* */}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="single" collapsible>
                      {property.units.map((unit) => {
                        const roomsStatus = getUnitStatus(unit.rooms); // ترجع string من نوع UnitStatus
                        const { label, badgeClass } =
                          unitStatusConfig[roomsStatus];
                        const carParksStatus = getUnitStatus(unit.carparks); // ترجع string من نوع UnitStatus
                        const {
                          label: carParksLabel,
                          badgeClass: carParksBadgeClass,
                        } = unitStatusConfig[carParksStatus];
                        return (
                          <AccordionItem value={`${unit.id}`}>
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                              <div className="w-full">
                                <div className="flex w-full justify-between my-2">
                                  <div className="w-full flex flex-col gap-2">
                                    <p className="text-primary-foreground">
                                      Unit - {unit.block_floor_unit_number}
                                    </p>
                                    <p>{unit.rental_type}</p>
                                    {unit.rental_type === "Sublet" ? (
                                      <div className="flex gap-3">
                                        <span>Rooms :</span>
                                        <Badge className={badgeClass}>
                                          {label}
                                        </Badge>
                                        <span>Car Parks :</span>
                                        <Badge className={carParksBadgeClass}>
                                          {carParksLabel === "No Rooms"
                                            ? "No Car Park"
                                            : carParksLabel}
                                        </Badge>
                                      </div>
                                    ) : null}

                                    {/* {unit name} */}
                                    <div className="flex gap-2">
                                      <div className="flex gap-1 items-center">
                                        <BedSingle className="size-4" />
                                        <span>{unit.bedroom_count}</span>
                                      </div>
                                      <div className="flex gap-1 items-center">
                                        <Bath className="size-4" />
                                        <span>{unit.bathroom_count}</span>
                                      </div>
                                      <div className="flex gap-1 items-center">
                                        <Lock className="size-4" />
                                        <span>
                                          {unit.locks.length > 0 ? "on" : "off"}
                                        </span>
                                      </div>
                                      <div className="flex gap-1 items-center">
                                        <Gauge className="size-4" />
                                        <span>
                                          {unit.meters.length > 0
                                            ? "on"
                                            : "off"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex w-full gap-5">
                                      <Image
                                        className="size-4 text-black/30"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      />
                                      <Share2
                                        className="size-4 text-black/30"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      />
                                      <UnitDropdown unit={unit} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {unit.rental_type === "Sublet" ? (
                                <Accordion type="multiple">
                                  {roomsStatus !== "No Rooms" ? (
                                    <AccordionItem value="units">
                                      <AccordionTrigger className="hover:no-underline cursor-pointer">
                                        Rooms
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="flex w-full overflow-x-scroll  gap-3">
                                          {unit.rooms.map((room) => {
                                            return (
                                              <Card className="w-full max-w-sm min-w-sm">
                                                <CardHeader>
                                                  <div className="w-full items-end flex justify-between">
                                                    <div className="text-primary">
                                                      {capitalize(room.name)}
                                                    </div>
                                                    <div>
                                                      <div className="flex w-full gap-5">
                                                        <Image className="size-4 text-black/30" />
                                                        <Share2 className="size-4 text-black/30" />
                                                        <RoomDropDown
                                                          room={room}
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {getStatus(room.status)}
                                                </CardHeader>
                                                <CardContent>
                                                  <FormProvider {...form}>
                                                    <form
                                                      onSubmit={handleSubmit(
                                                        onSubmit
                                                      )}
                                                    >
                                                      <div className="flex flex-col gap-6">
                                                        <div>
                                                          {getMeterAndLock(
                                                            room
                                                          )}
                                                        </div>
                                                        {unit
                                                          .last_active_tenancy[0] ? (
                                                          <>
                                                            {" "}
                                                            <div className="grid gap-2">
                                                              <SelectWithForm<FormValues>
                                                                name="status"
                                                                title="Status"
                                                                options={
                                                                  statusType
                                                                }
                                                              />
                                                            </div>
                                                            <div>
                                                              <p>
                                                                Sharvindan A/L
                                                                Silvam - META
                                                                B-26-07
                                                              </p>
                                                              <p className="text-primary">
                                                                (R1)
                                                                AuntieMichelle-T24000331
                                                                MYR
                                                              </p>
                                                              <p>550/Monthly</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                              <p className="text-sm text-gray-600">
                                                                <p className="font-medium">
                                                                  Tenancy Start
                                                                  Date
                                                                </p>{" "}
                                                                {/* {tenancy.tenancy_start_date} */}
                                                                01/12/2024
                                                              </p>
                                                              <p className="text-sm text-gray-600 max-w-29">
                                                                <p className="font-medium">
                                                                  Tenancy End
                                                                  Date
                                                                </p>{" "}
                                                                {/* {tenancy.tenancy_end_date} */}
                                                                30/11/2025
                                                              </p>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                              <div className=" flex  flex-col gap-2">
                                                                <p className="text-sm text-gray-600">
                                                                  <p className="font-medium">
                                                                    Auto Pay
                                                                  </p>{" "}
                                                                  {/* {tenancy.smart_meter} */}
                                                                  Disabled
                                                                </p>
                                                              </div>
                                                              <div>
                                                                {" "}
                                                                <p className="text-sm text-gray-600 max-w-28">
                                                                  <p className="font-medium ">
                                                                    Total
                                                                    Overdue
                                                                  </p>
                                                                  {/* {tenancy.top_up} */}
                                                                  MYR 0
                                                                </p>
                                                              </div>
                                                            </div>
                                                          </>
                                                        ) : null}
                                                      </div>
                                                    </form>
                                                  </FormProvider>
                                                </CardContent>
                                                <CardFooter className="flex-col gap-2">
                                                  {unit
                                                    .last_active_tenancy[0] ? (
                                                    <ViewTenancy
                                                      tenancy={
                                                        unit
                                                          .last_active_tenancy[0]
                                                      }
                                                    />
                                                  ) : (
                                                    <Button className="text-white">
                                                      Move in
                                                    </Button>
                                                  )}
                                                </CardFooter>
                                              </Card>
                                            );
                                          })}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  ) : null}
                                  {carParksStatus !== "No Rooms" ? (
                                    <AccordionItem value="carParks">
                                      {" "}
                                      <AccordionTrigger className="hover:no-underline cursor-pointer">
                                        Car Parks
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="flex w-full overflow-x-scroll  gap-3">
                                          {unit.carparks.map((carpark) => {
                                            return (
                                              <Card className="w-full max-w-sm min-w-sm">
                                                <CardHeader>
                                                  <div className="w-full items-end flex justify-between">
                                                    <div className="text-primary">
                                                      Car Park -{" "}
                                                      {carpark.number}
                                                    </div>
                                                    <div>
                                                      <div className="flex w-full gap-5">
                                                        <Image className="size-4" />
                                                        <Share2 className="size-4" />
                                                        <CarParksDropDown
                                                          carpark={carpark}
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {getStatus(carpark.status)}
                                                </CardHeader>
                                                <CardContent>
                                                  <FormProvider {...form}>
                                                    <form
                                                      onSubmit={handleSubmit(
                                                        onSubmit
                                                      )}
                                                    >
                                                      <div className="flex flex-col gap-6">
                                                        <div className="grid gap-2">
                                                          <SelectWithForm<FormValues>
                                                            name="status"
                                                            title="Status"
                                                            options={statusType}
                                                          />
                                                        </div>
                                                        <div>
                                                          <p>
                                                            Sharvindan A/L
                                                            Silvam - META
                                                            B-26-07
                                                          </p>
                                                          <p className="text-primary">
                                                            (R1)
                                                            AuntieMichelle-T24000331
                                                            MYR
                                                          </p>
                                                          <p>550/Monthly</p>
                                                        </div>
                                                        <div className="flex justify-between">
                                                          <p className="text-sm text-gray-600">
                                                            <p className="font-medium">
                                                              Tenancy Start Date
                                                            </p>{" "}
                                                            {/* {tenancy.tenancy_start_date} */}
                                                            01/12/2024
                                                          </p>
                                                          <p className="text-sm text-gray-600 max-w-29">
                                                            <p className="font-medium">
                                                              Tenancy End Date
                                                            </p>{" "}
                                                            {/* {tenancy.tenancy_end_date} */}
                                                            30/11/2025
                                                          </p>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                          <div className=" flex  flex-col gap-2">
                                                            <p className="text-sm text-gray-600">
                                                              <p className="font-medium">
                                                                Auto Pay
                                                              </p>{" "}
                                                              {/* {tenancy.smart_meter} */}
                                                              Disabled
                                                            </p>
                                                          </div>
                                                          <div>
                                                            {" "}
                                                            <p className="text-sm text-gray-600 max-w-28">
                                                              <p className="font-medium ">
                                                                Total Overdue
                                                              </p>
                                                              {/* {tenancy.top_up} */}
                                                              MYR 0
                                                            </p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </form>
                                                  </FormProvider>
                                                </CardContent>
                                                <CardFooter className="flex-col gap-2">
                                                  {unit
                                                    .last_active_tenancy[0] ? (
                                                    <ViewTenancy
                                                      tenancy={
                                                        unit
                                                          .last_active_tenancy[0]
                                                      }
                                                    />
                                                  ) : (
                                                    <Button className="text-white">
                                                      Move in
                                                    </Button>
                                                  )}
                                                </CardFooter>
                                              </Card>
                                            );
                                          })}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  ) : null}
                                </Accordion>
                              ) : (
                                <Card className="w-full border-0 ">
                                  <CardContent>
                                    <FormProvider {...form}>
                                      <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="flex flex-col gap-6">
                                          <div className="text-primary">
                                            {capitalize(unit.description)}
                                          </div>
                                          <div className="grid gap-2">
                                            <SelectWithForm<FormValues>
                                              name="status"
                                              title="Status"
                                              options={statusType}
                                            />
                                          </div>
                                          <div className="flex justify-between">
                                            <p>
                                              Sharvindan A/L Silvam - META
                                              B-26-07
                                            </p>
                                            <p className="text-primary">
                                              (R1) AuntieMichelle-T24000331 MYR
                                            </p>
                                            <p>550/Monthly</p>
                                          </div>
                                          <div className="flex gap-10 justify-between">
                                            <p className="text-sm text-gray-600">
                                              <p className="font-medium">
                                                Tenancy Start Date
                                              </p>{" "}
                                              {/* {tenancy.tenancy_start_date} */}
                                              01/12/2024
                                            </p>
                                            <p className="text-sm text-gray-600 max-w-29">
                                              <p className="font-medium">
                                                Tenancy End Date
                                              </p>{" "}
                                              {/* {tenancy.tenancy_end_date} */}
                                              30/11/2025
                                            </p>
                                            <div className="flex  items-center">
                                              <p className="text-sm text-gray-600">
                                                <p className="font-medium">
                                                  Auto Pay
                                                </p>{" "}
                                                {/* {tenancy.smart_meter} */}
                                                Disabled
                                              </p>
                                            </div>
                                            <div>
                                              {" "}
                                              <p className="text-sm text-gray-600 max-w-28">
                                                <p className="font-medium ">
                                                  Total Overdue
                                                </p>
                                                {/* {tenancy.top_up} */}
                                                MYR 0
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                    </FormProvider>
                                  </CardContent>
                                  <CardFooter className="flex-col gap-2">
                                    {unit.last_active_tenancy[0] ? (
                                      <ViewTenancy
                                        tenancy={unit.last_active_tenancy[0]}
                                      />
                                    ) : (
                                      <Button className="text-white">
                                        Move in
                                      </Button>
                                    )}
                                  </CardFooter>
                                </Card>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        {/* {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-black text-white" : ""
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Page;
