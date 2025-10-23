"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  CircleArrowDown,
  PenLine,
  Search,
  Share2,
} from "lucide-react";
import UpdateUnitInformation from "./UpdateUnitInformation";
import { useState } from "react";
import UpdateRoomInformation from "./UpdateRoomInformation";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const filters = [
    <InputWithIcon
      className="w-full"
      key="property_name"
      icon={Search}
      placeholder="Property Name"
    />,
    <InputWithIcon
      key="Status"
      className="w-full"
      icon={Search}
      placeholder="Status"
    />,
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
      <HeaderPage title="Booking Setting" />
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
        {/* Actions */}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger
              classNameIcon="hidden"
              className=" hover:no-underline flex items-center justify-start font-semibold gap-2  rounded-none"
            >
              <CircleArrowDown
                className={
                  "text-primary pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
                }
              />
              Sky Residences Puchong (5)
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sub-item-1">
                  <AccordionTrigger
                    classNameIcon="hidden"
                    className="text-primary hover:no-underline flex items-center justify-start font-semibold gap-2 bg-gray-100 rounded-none"
                  >
                    <CircleArrowDown
                      className={
                        "text-primary pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
                      }
                    />
                    Block 1
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 text-xs">
                          <TableHead>Action</TableHead>
                          <TableHead>Unit/Room</TableHead>
                          <TableHead>Monthly Rental</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Rental-First Month</TableHead>
                          <TableHead>Rental-Last Month</TableHead>
                          <TableHead>Move-In</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="flex gap-2">
                            {" "}
                            <UpdateUnitInformation
                              open={open}
                              setOpen={setOpen}
                            />
                            <Share2 className="size-4 text-primary" />
                          </TableCell>
                          <TableCell>Whole Unit</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>NO</TableCell>
                          <TableCell>NO</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger
              classNameIcon="hidden"
              className=" hover:no-underline flex items-center justify-start font-semibold gap-2  rounded-none"
            >
              <CircleArrowDown
                className={
                  "text-primary pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
                }
              />
              Skypod Puchong (2)
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sub-item-2">
                  <AccordionTrigger
                    classNameIcon="hidden"
                    className="text-primary hover:no-underline flex items-center justify-start font-semibold gap-2 bg-gray-100 rounded-none"
                  >
                    <CircleArrowDown
                      className={
                        "text-primary pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
                      }
                    />
                    Block 1
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 text-xs">
                          <TableHead>Action</TableHead>
                          <TableHead>Unit/Room</TableHead>
                          <TableHead>Monthly Rental</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Rental-First Month</TableHead>
                          <TableHead>Rental-Last Month</TableHead>
                          <TableHead>Move-In</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="flex gap-2">
                            {" "}
                            <UpdateRoomInformation
                              open={open2}
                              setOpen={setOpen2}
                            />
                            <Share2 className="size-4 text-primary" />
                          </TableCell>
                          <TableCell>Whole Unit</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>NO</TableCell>
                          <TableCell>NO</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
