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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SelectWithForm } from "@/components/CustomSelect";

import { FormProvider, useForm } from "react-hook-form";
const ITEMS_PER_PAGE = 9; // Number of cards per page

const Page = () => {
  const { data } = useGetPropertiesList();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Map API data to card format
  const cardData = useMemo(
    () =>
      (data || []).map((item) => ({
        property_id: item.property_name ?? "-",
        unit: item.property_type ?? "-",
        room: item.facilities?.length ? item.facilities.join(", ") : "-",
        smart_home:
          item.facilities?.includes("meeting_room") ||
          item.facilities?.includes("game_room")
            ? "Yes"
            : "No",
        owner_name: item.attention_name ?? "-",
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
    const totalItems = cardData.length;
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
  return (
    <div>
      <HeaderPage title="Property (Grid View)" />
      <div className="w-full mt-5  rounded-[6px] p-3 bg-white">
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <Button className="bg-black rounded-[6px] text-white hover:bg-black/70">
              Create Bulk Property
            </Button>
            <CreateNewProperty />
          </div>
        </div>

        {/* Grid layout */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Error loading properties.</div>
          ) : paginatedData.length === 0 ? (
            <div>No properties found.</div>
          ) : (
            <>
              {cardData.map((property) => (
                <div
                  key={property.property_id}
                  className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
                >
                  <p className="flex items-center gap-2">
                    <Badge className="text-[#F6FFED] bg-[#52C41A] font-normal border-[#B7EB8F]">
                      {property.status}
                    </Badge>
                    <Badge className="bg-gray-100 text-black font-normal border-1">
                      {property.smart_home === "Yes"
                        ? "Smart Home"
                        : "Standard"}
                    </Badge>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Property</span>
                    <span className="font-bold text-lg ml-2">
                      {property.property_id}
                    </span>
                  </p>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Unit:</span> {property.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Room:</span> {property.room}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Owner:</span>{" "}
                      {property.owner_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Rental:</span>{" "}
                      {property.rental}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tenancy:</span>{" "}
                      {property.tenancy}
                    </p>
                  </div>
                  <Separator className="my-5" />
                  <div className="flex justify-center text-sm font-normal text-primary">
                  
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="">
                        <Button className="rounded-md text-white cursor-pointer">
                          View Details
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                        className="hover:bg-gray-100 hover:cursor-pointer"
                        onSelect={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <EditProperty property={property} />
                      </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-gray-100 hover:cursor-pointer"
                          onSelect={(e) => {
                            e.preventDefault();
                            router.push("/unit");
                          }}
                        >
                          Add Unit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-gray-100 hover:cursor-pointer"
                          onSelect={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <CreateTenancy />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-gray-100 hover:cursor-pointer"
                          onSelect={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <CreateMeter />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-gray-100 hover:cursor-pointer"
                          onSelect={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <CreateInvoice />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-gray-100 hover:cursor-pointer"
                          onClick={() => {}}
                        >
                          Add Lock
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-gray-100 hover:cursor-pointer"
                          onSelect={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <CreateEquipment />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </>
          )}
        </div> */}
        <div className="grid grid-cols-1 gap-5">
          <div className="border rounded-2xl p-4 hover:shadow-md transition-shadow">
            {" "}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="property">
                <AccordionTrigger className="hover:no-underline">
                  <div className="w-full flex justify-between">
                    <div className="">
                      <p className="text-primary hover:underline font-bold z-50 mb-3 cursor-pointer">
                        Meta Residence @ Seri Kembangan
                      </p>
                      <p>
                        Jalan Atmosphere Utama 2,, Seri Kembangan, 43400,
                        Selangor, Malaysia
                      </p>
                      <p className="flex">
                        <span>Condominium</span>
                        <Dot />
                        <span>31 unit</span>
                        <Dot />
                        <span>100 rooms</span>
                      </p>
                    </div>
                    <div>
                      <Button className="text-white rounded-[6px]">
                        <Plus />
                        New Unit
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="unit">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="w-full">
                          <div className="flex w-full justify-between my-2">
                            <div className="w-full flex flex-col gap-2">
                              <Badge className="bg-primary-foreground text-white">
                                Partially Occupied
                              </Badge>
                              {/* {unit name} */}
                              <p className="text-primary-foreground">B-26-07</p>
                              <div className="flex gap-2">
                                <div className="flex gap-1 items-center">
                                  <BedSingle className="size-4" />
                                  <span>6</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Bath className="size-4" />
                                  <span>6</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Lock className="size-4" />
                                  <span>off</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Gauge className="size-4" />
                                  <span>off</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex w-full gap-5">
                                <Image className="size-4" />
                                <Share2 className="size-4" />
                                <EllipsisVertical className="size-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex w-full overflow-x-scroll  gap-3">
                          <Card className="w-full max-w-sm min-w-sm">
                            <CardHeader>
                              <div className="w-full items-end flex justify-between">
                                <div className="text-primary">Room</div>
                                <div>
                                  <div className="flex w-full gap-5">
                                    <Image className="size-4" />
                                    <Share2 className="size-4" />
                                    <EllipsisVertical className="size-4" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="bg-green-500 p-2 rounded-sm">
                                  <KeyRound className="size-3 text-white " />
                                </div>
                                <span className="text-green-500">Occupied</span>
                                <Separator className="bg-green-500 max-w-60" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <FormProvider {...form}>
                                <form onSubmit={handleSubmit(onSubmit)}>
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
                                        Sharvindan A/L Silvam - META B-26-07
                                      </p>
                                      <p className="text-primary">
                                        (R1) AuntieMichelle-T24000331 MYR
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
                                          {/* {tenancy.top_up} */}MYR 0
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </FormProvider>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild className="">
                                  <Button className="rounded-md text-white cursor-pointer">
                                    View Tenancy
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    {/* <EditProperty property={property} /> */}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      router.push("/unit");
                                    }}
                                  >
                                    Add Unit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateTenancy />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateMeter />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateInvoice />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onClick={() => {}}
                                  >
                                    Add Lock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateEquipment />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardFooter>
                          </Card>
                          <Card className="w-full max-w-sm min-w-sm">
                            <CardHeader>
                              <div className="w-full items-end flex justify-between">
                                <div className="text-primary">Room</div>
                                <div>
                                  <div className="flex w-full gap-5">
                                    <Image className="size-4" />
                                    <Share2 className="size-4" />
                                    <EllipsisVertical className="size-4" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="bg-green-500 p-2 rounded-sm">
                                  <KeyRound className="size-3 text-white " />
                                </div>
                                <span className="text-green-500">Occupied</span>
                                <Separator className="bg-green-500 max-w-60" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <FormProvider {...form}>
                                <form onSubmit={handleSubmit(onSubmit)}>
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
                                        Sharvindan A/L Silvam - META B-26-07
                                      </p>
                                      <p className="text-primary">
                                        (R1) AuntieMichelle-T24000331 MYR
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
                                          {/* {tenancy.top_up} */}MYR 0
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </FormProvider>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild className="">
                                  <Button className="rounded-md text-white cursor-pointer">
                                    View Tenancy
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    {/* <EditProperty property={property} /> */}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      router.push("/unit");
                                    }}
                                  >
                                    Add Unit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateTenancy />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateMeter />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateInvoice />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onClick={() => {}}
                                  >
                                    Add Lock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateEquipment />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardFooter>
                          </Card>
                          <Card className="w-full max-w-sm min-w-sm">
                            <CardHeader>
                              <div className="w-full items-end flex justify-between">
                                <div className="text-primary">Room</div>
                                <div>
                                  <div className="flex w-full gap-5">
                                    <Image className="size-4" />
                                    <Share2 className="size-4" />
                                    <EllipsisVertical className="size-4" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="bg-green-500 p-2 rounded-sm">
                                  <KeyRound className="size-3 text-white " />
                                </div>
                                <span className="text-green-500">Occupied</span>
                                <Separator className="bg-green-500 max-w-60" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <FormProvider {...form}>
                                <form onSubmit={handleSubmit(onSubmit)}>
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
                                        Sharvindan A/L Silvam - META B-26-07
                                      </p>
                                      <p className="text-primary">
                                        (R1) AuntieMichelle-T24000331 MYR
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
                                          {/* {tenancy.top_up} */}MYR 0
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </FormProvider>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild className="">
                                  <Button className="rounded-md text-white cursor-pointer">
                                    View Tenancy
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    {/* <EditProperty property={property} /> */}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      router.push("/unit");
                                    }}
                                  >
                                    Add Unit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateTenancy />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateMeter />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateInvoice />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onClick={() => {}}
                                  >
                                    Add Lock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateEquipment />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardFooter>
                          </Card>
                          <Card className="w-full max-w-sm min-w-sm">
                            <CardHeader>
                              <div className="w-full items-end flex justify-between">
                                <div className="text-primary">Room</div>
                                <div>
                                  <div className="flex w-full gap-5">
                                    <Image className="size-4" />
                                    <Share2 className="size-4" />
                                    <EllipsisVertical className="size-4" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="bg-green-500 p-2 rounded-sm">
                                  <KeyRound className="size-3 text-white " />
                                </div>
                                <span className="text-green-500">Occupied</span>
                                <Separator className="bg-green-500 max-w-60" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <FormProvider {...form}>
                                <form onSubmit={handleSubmit(onSubmit)}>
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
                                        Sharvindan A/L Silvam - META B-26-07
                                      </p>
                                      <p className="text-primary">
                                        (R1) AuntieMichelle-T24000331 MYR
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
                                          {/* {tenancy.top_up} */}MYR 0
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </FormProvider>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild className="">
                                  <Button className="rounded-md text-white cursor-pointer">
                                    View Tenancy
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    {/* <EditProperty property={property} /> */}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      router.push("/unit");
                                    }}
                                  >
                                    Add Unit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateTenancy />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateMeter />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateInvoice />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onClick={() => {}}
                                  >
                                    Add Lock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateEquipment />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardFooter>
                          </Card>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="unit1">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="w-full">
                          <div className="flex w-full justify-between my-2">
                            <div className="w-full flex flex-col gap-2">
                              <Badge className="bg-gray-400 text-white">
                                Fully Occupied
                              </Badge>
                              {/* {unit name} */}
                              <p className="text-primary-foreground">A-06-09</p>
                              <div className="flex gap-2">
                                <div className="flex gap-1 items-center">
                                  <BedSingle className="size-4" />
                                  <span>6</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Bath className="size-4" />
                                  <span>6</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Lock className="size-4" />
                                  <span>off</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Gauge className="size-4" />
                                  <span>off</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex w-full gap-5">
                                <Image className="size-4" />
                                <Share2 className="size-4" />
                                <EllipsisVertical className="size-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex   gap-3">
                          <Card className="w-full max-w-sm">
                            <CardHeader>
                              <div className="w-full items-end flex justify-between">
                                <div className="text-primary">Room</div>
                                <div>
                                  <div className="flex w-full gap-5">
                                    <Image className="size-4" />
                                    <Share2 className="size-4" />
                                    <EllipsisVertical className="size-4" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="bg-green-500 p-2 rounded-sm">
                                  <KeyRound className="size-3 text-white " />
                                </div>
                                <span className="text-green-500">Occupied</span>
                                <Separator className="bg-green-500 max-w-60" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <FormProvider {...form}>
                                <form onSubmit={handleSubmit(onSubmit)}>
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
                                        Sharvindan A/L Silvam - META B-26-07
                                      </p>
                                      <p className="text-primary">
                                        (R1) AuntieMichelle-T24000331 MYR
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
                                          {/* {tenancy.top_up} */}MYR 0
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </FormProvider>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild className="">
                                  <Button className="rounded-md text-white cursor-pointer">
                                    View Tenancy
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    {/* <EditProperty property={property} /> */}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      router.push("/unit");
                                    }}
                                  >
                                    Add Unit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateTenancy />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateMeter />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateInvoice />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onClick={() => {}}
                                  >
                                    Add Lock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateEquipment />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardFooter>
                          </Card>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="unit2">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="w-full">
                          <div className="flex w-full justify-between my-2">
                            <div className="w-full flex flex-col gap-2">
                              <Badge className="bg-red-600 text-white">
                                Vacant
                              </Badge>
                              {/* {unit name} */}
                              <p className="text-primary-foreground">
                                A-25-05 Car Park
                              </p>
                              <div className="flex gap-2">
                                <div className="flex gap-1 items-center">
                                  <BedSingle className="size-4" />
                                  <span>2</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Bath className="size-4" />
                                  <span>1</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Lock className="size-4" />
                                  <span>off</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Gauge className="size-4" />
                                  <span>off</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex w-full gap-5">
                                <Image className="size-4" />
                                <Share2 className="size-4" />
                                <EllipsisVertical className="size-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex w-full gap-3">
                          <Card className="w-full max-w-sm">
                            <CardHeader>
                              <div className="w-full items-end flex justify-between">
                                <div className="text-primary">Room</div>
                                <div>
                                  <div className="flex w-full gap-5">
                                    <Image className="size-4" />
                                    <Share2 className="size-4" />
                                    <EllipsisVertical className="size-4" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="bg-green-500 p-2 rounded-sm">
                                  <KeyRound className="size-3 text-white " />
                                </div>
                                <span className="text-green-500">Occupied</span>
                                <Separator className="bg-green-500 max-w-60" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <FormProvider {...form}>
                                <form onSubmit={handleSubmit(onSubmit)}>
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
                                        Sharvindan A/L Silvam - META B-26-07
                                      </p>
                                      <p className="text-primary">
                                        (R1) AuntieMichelle-T24000331 MYR
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
                                          {/* {tenancy.top_up} */}MYR 0
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </FormProvider>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild className="">
                                  <Button className="rounded-md text-white cursor-pointer">
                                    View Tenancy
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    {/* <EditProperty property={property} /> */}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      router.push("/unit");
                                    }}
                                  >
                                    Add Unit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateTenancy />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateMeter />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateInvoice />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onClick={() => {}}
                                  >
                                    Add Lock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <CreateEquipment />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardFooter>
                          </Card>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
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
