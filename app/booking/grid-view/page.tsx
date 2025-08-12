"use client";
import HeaderPage from "@/components/HeaderPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import CreateNewBooking from "../list-view/CreateNewBooking";

// Dummy data for demonstration; replace with your real data fetching logic
const data = [
  {
    property_id: "P-001",
    unit: "Unit 1",
    room: "Room A",
    smart_home: "Yes",
    tenant_name: "John Doe",
    rental: "$1000",
    rental_frequency: "Monthly",
    status: "Vacant",
  },
  {
    property_id: "P-002",
    unit: "Unit 2",
    room: "Room B",
    smart_home: "No",
    tenant_name: "Jane Smith",
    rental: "$1200",
    rental_frequency: "Monthly",
    status: "Occupied",
  },
  // ...add more items as needed
];

const ITEMS_PER_PAGE = 6; // Number of cards per page

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIdx, endIdx);

  // Handle page change
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <HeaderPage title="Booking (Grid View)" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <div className="flex w-full gap-3 justify-end my-3">
          <Button className="bg-black rounded-[6px] text-white hover:bg-black/70">
            Create Bulk Booking
          </Button>
          <CreateNewBooking />
        </div>
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedData.length === 0 ? (
            <div>No bookings found.</div>
          ) : (
            paginatedData.map((item) => (
              <div
                key={item.property_id + item.unit}
                className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="text-[#F6FFED] bg-[#52C41A] font-normal border-[#B7EB8F]">
                    {item.status}
                  </Badge>
                  <Badge className="bg-gray-100 text-black font-normal border-1">
                    {item.smart_home === "Yes" ? "Smart Home" : "Standard"}
                  </Badge>
                </div>
                <div className="font-bold text-lg mb-1">{item.property_id}</div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Unit:</span> {item.unit}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Room:</span> {item.room}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Tenant:</span>{" "}
                  {item.tenant_name}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Rental:</span> {item.rental}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Frequency:</span>{" "}
                  {item.rental_frequency}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-center text-sm font-normal text-primary">
                  {/* You can add actions here, e.g. <ViewBooking booking={item} /> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="">
                      <Button className="rounded-md text-white cursor-pointer">
                        View Details
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end"></DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default Page;
