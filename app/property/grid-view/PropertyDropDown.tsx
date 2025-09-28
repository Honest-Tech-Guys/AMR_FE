"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import EditProperty from "../list-view/Actions/EditProperty";
import CreateUnit from "../list-view/Actions/CreateUnit";
import CreateTenancy from "../list-view/Actions/CreateTenancy";
import CreateMeter from "../list-view/Actions/CreateMeter";
import CreateLock from "../list-view/Actions/CreateLock";
import CreateInvoice from "../list-view/Actions/CreateInvoice";
import CreateEquipment from "../list-view/Actions/CreateEquipment";

import { useState } from "react";

// import your dialogs

export default function PropertyDropdown({ property }: { property: any }) {
  // centralize dialog states
  const [openDialog, setOpenDialog] = useState<
    | "editProperty"
    | "createUnit"
    | "createTenancy"
    | "createMeter"
    | "createLock"
    | "createInvoice"
    | "createEquipment"
    | null
  >(null);

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
            className="h-5 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <MenuItem dialogKey="editProperty">Edit Property</MenuItem>
          <MenuItem dialogKey="createUnit">Create Unit</MenuItem>
          {/* <MenuItem dialogKey="createTenancy">Create Tenancy</MenuItem> */}
          <MenuItem dialogKey="createMeter">Create Meter</MenuItem>
          <MenuItem dialogKey="createLock">Create Lock</MenuItem>
          <MenuItem dialogKey="createInvoice">Create Invoice</MenuItem>
          <MenuItem dialogKey="createEquipment">Create Equipment</MenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs outside dropdown */}
      <EditProperty
        property={property}
        open={openDialog === "editProperty"}
        onOpenChange={(open) => setOpenDialog(open ? "editProperty" : null)}
      />
      <CreateUnit
        id={property.id}
        open={openDialog === "createUnit"}
        onOpenChange={(open) => setOpenDialog(open ? "createUnit" : null)}
      />
      {/* <CreateTenancy
        id={property.id}
        open={openDialog === "createTenancy"}
        onOpenChange={(open) => setOpenDialog(open ? "createTenancy" : null)}
      /> */}
      <CreateMeter
        id={property.id}
        open={openDialog === "createMeter"}
        onOpenChange={(open) => setOpenDialog(open ? "createMeter" : null)}
      />
      <CreateLock
        id={property.id}
        open={openDialog === "createLock"}
        onOpenChange={(open) => setOpenDialog(open ? "createLock" : null)}
      />
      <CreateInvoice
        id={property.id}
        open={openDialog === "createInvoice"}
        onOpenChange={(open) => setOpenDialog(open ? "createInvoice" : null)}
      />
      <CreateEquipment
        id={property.id}
        open={openDialog === "createEquipment"}
        onOpenChange={(open) => setOpenDialog(open ? "createEquipment" : null)}
      />
    </>
  );
}
