"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import AddRoomTagging from "../[id]/unit/AddRoomTagging";
import AddRoomDetails from "../[id]/unit/AddRoomDetails";
import CreateNewTenant from "../[id]/unit/CreateNewTenant";
import EditUnit from "../[id]/unit/EditUnit";
import CreateMeter from "../list-view/Actions/CreateMeter";
import CreateLock from "../list-view/Actions/CreateLock";
import CreateTenancy from "../list-view/Actions/CreateTenancy";
import { Unit } from "@/types/UnitType";
import EditMeter from "@/app/smart-home/meter/EditMeter";
import EditLock from "@/app/smart-home/lock/EditLock";
import CreateEquipment from "../list-view/Actions/CreateEquipment";

// Import dialogs for units

export default function UnitDropdown({ unit }: { unit: Unit }) {
  // centralize dialog states
  const [openDialog, setOpenDialog] = useState<
    | "addRoomTagging"
    | "addRoomDetails"
    | "createTenancy"
    | "editUnit"
    | "addMeter"
    | "addLock"
    | "editMeter"
    | "editLock"
    | "renameRoom"
    | "addCarpark"
    | "createEquipment"
    | null
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
      onClick={() => {
        console.log("locks", unit.locks.length);
        console.log("meters", unit.meters.length);
      }}
      onSelect={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDialog(dialogKey);
      }}
    >
      {children}
    </DropdownMenuItem>
  );
  console.log(unit);
  return (
    <>
      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 cursor-pointer"
            onClick={(e) => e.stopPropagation()} // stop accordion toggle
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="z-300"
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem dialogKey="editUnit">Edit Unit</MenuItem>
          {unit.rental_type === "Room Rental" ? (
            <>
              <MenuItem dialogKey="addRoomTagging">Add Room Tagging</MenuItem>
              <MenuItem dialogKey="addRoomDetails">Add Room Details</MenuItem>
              <MenuItem dialogKey="addCarpark">Add Carpark</MenuItem>
            </>
          ) : (
            <MenuItem dialogKey="createEquipment">Add Equipment</MenuItem>
          )}
          {unit.meters.length > 0 ? (
            <MenuItem dialogKey="editMeter">Edit Meter</MenuItem>
          ) : (
            <MenuItem dialogKey="addMeter">Add Meter</MenuItem>
          )}
          {unit.locks.length > 0 ? (
            <MenuItem dialogKey="editLock">Edit Lock</MenuItem>
          ) : (
            <MenuItem dialogKey="addLock">Add Lock</MenuItem>
          )}
          <MenuItem dialogKey="createTenancy">Add Tenancy</MenuItem>
          {/* <MenuItem dialogKey="renameRoom">Rename Room</MenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs outside dropdown */}
      <AddRoomTagging
        // id={unit.id}
        unit_id={unit.id}
        rooms={unit.rooms}
        url={unit.floor_plan_image_url}
        open={openDialog === "addRoomTagging"}
        onOpenChange={(open) => setOpenDialog(open ? "addRoomTagging" : null)}
      />
      <AddRoomDetails
        id={unit.id}
        open={openDialog === "addRoomDetails"}
        onOpenChange={(open) => setOpenDialog(open ? "addRoomDetails" : null)}
      />
      <CreateTenancy
        id={unit.id}
        open={openDialog === "createTenancy"}
        type="Unit"
        onOpenChange={(open) => setOpenDialog(open ? "createTenancy" : null)}
      />
      <EditUnit
        unit={unit}
        open={openDialog === "editUnit"}
        onOpenChange={(open) => setOpenDialog(open ? "editUnit" : null)}
      />
      <CreateMeter
        id={unit.id}
        open={openDialog === "addMeter"}
        onOpenChange={(open) => setOpenDialog(open ? "addMeter" : null)}
      />
      <CreateLock
        id={unit.id}
        open={openDialog === "addLock"}
        onOpenChange={(open) => setOpenDialog(open ? "addLock" : null)}
      />
      {unit.meters.length > 0 ? (
        <EditMeter
          meter={unit.meters[0]}
          open={openDialog === "editMeter"}
          onOpenChange={(open) => setOpenDialog(open ? "editMeter" : null)}
        />
      ) : null}
      {unit.locks.length > 0 ? (
        <EditLock
          lock={unit.locks[0]}
          open={openDialog === "editLock"}
          onOpenChange={(open) => setOpenDialog(open ? "editLock" : null)}
        />
      ) : null}
      <CreateEquipment
        type="Unit"
        id={unit.id}
        open={openDialog === "createEquipment"}
        onOpenChange={(open) => setOpenDialog(open ? "createEquipment" : null)}
      />
      {/* For placeholders like SmartHome & RenameRoom, you can replace with actual components later */}
    </>
  );
}
