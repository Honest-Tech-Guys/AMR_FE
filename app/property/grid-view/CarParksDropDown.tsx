"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import CreateTenancy from "../list-view/Actions/CreateTenancy";

// Import dialogs for rooms

export default function CarParksDropDown({ carpark }: { carpark: any }) {
  // centralize dialog states
  const [openDialog, setOpenDialog] = useState<
    "editCarPark" | "createTenancy" | null
  >(null);

  // Reusable menu item
  const MenuItem = ({
    children,
    dialogKey,
  }: {
    children: React.ReactNode;
    dialogKey: typeof openDialog;
  }) => (
    <DropdownMenuItem
      className="hover:bg-gray-100 hover:cursor-pointer"
      onSelect={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDialog(dialogKey);
      }}
    >
      {children}
    </DropdownMenuItem>
  );

  return (
    <>
      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5"
            onClick={(e) => e.stopPropagation()} // stop accordion toggle
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <MenuItem dialogKey="editCarPark">Edit Carpark</MenuItem>

          <MenuItem dialogKey="createTenancy">Add Tenancy</MenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs outside dropdown */}

      <CreateTenancy
        id={carpark.id}
        open={openDialog === "createTenancy"}
        onOpenChange={(open) => setOpenDialog(open ? "createTenancy" : null)}
      />

      {/* For placeholders like SmartHome & RenameRoom, you can replace with actual components later */}
    </>
  );
}
