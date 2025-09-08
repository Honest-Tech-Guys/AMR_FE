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

// import CreateNewTenant from "../[id]/room/CreateNewTenant";
// import Editroom from "../[id]/room/Editroom";
import CreateMeter from "../list-view/Actions/CreateMeter";
import CreateLock from "../list-view/Actions/CreateLock";
import CreateTenancy from "../list-view/Actions/CreateTenancy";
import AddRoomTagging from "../[id]/unit/AddRoomTagging";
import AddRoomDetails from "../[id]/unit/AddRoomDetails";

// Import dialogs for rooms

export default function RoomDropDown({ room }: { room: any }) {
  // centralize dialog states
  const [openDialog, setOpenDialog] = useState<
    | "createTenancy"
    | "addMeter"
    | "addLock"
    | "editRoom"
    | "renameRoom"
    | "addRoomTagging"
    | "addRoomDetails"
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

        <DropdownMenuContent
          className="z-400"
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem dialogKey="editRoom">Edit Room</MenuItem>
          <MenuItem dialogKey="addRoomTagging">Add Room Tagging</MenuItem>
          <MenuItem dialogKey="addRoomDetails">Add Room Details</MenuItem>
          <MenuItem dialogKey="createTenancy">Add Tenancy</MenuItem>
          <MenuItem dialogKey="addMeter">Add Meter</MenuItem>
          <MenuItem dialogKey="addLock">Add Lock</MenuItem>
          <MenuItem dialogKey="renameRoom">Rename Room</MenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs outside dropdown */}
      <AddRoomTagging
        id={room.id}
        open={openDialog === "addRoomTagging"}
        onOpenChange={(open) => setOpenDialog(open ? "addRoomTagging" : null)}
      />
      <AddRoomDetails
        id={room.id}
        open={openDialog === "addRoomDetails"}
        onOpenChange={(open) => setOpenDialog(open ? "addRoomDetails" : null)}
      />
      <CreateTenancy
        id={room.id}
        open={openDialog === "createTenancy"}
        onOpenChange={(open) => setOpenDialog(open ? "createTenancy" : null)}
      />
      {/* <EditRoom
        room={room.id}
        open={openDialog === "editRoom"}
        onOpenChange={(open) => setOpenDialog(open ? "editRoom" : null)}
      /> */}
      <CreateMeter
        id={room.id}
        open={openDialog === "addMeter"}
        onOpenChange={(open) => setOpenDialog(open ? "addMeter" : null)}
      />
      <CreateLock
        id={room.id}
        open={openDialog === "addLock"}
        onOpenChange={(open) => setOpenDialog(open ? "addLock" : null)}
      />
      {/* For placeholders like SmartHome & RenameRoom, you can replace with actual components later */}
    </>
  );
}
