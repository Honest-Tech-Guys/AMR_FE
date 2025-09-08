import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";

const SmartHomeTap = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div>
      {" "}
      <div className="border-1 w-full">
        <div className="flex w-full items-center p-3 justify-between border-b-1">
          <span>Smart Meter</span>
        </div>
        <div className="flex items-center p-3 gap-3">
          <Label htmlFor="enable-feature" className="text-sm font-medium">
            Power off meter when tenancy ended
          </Label>

          <div className="relative w-[50px] ">
            <Switch
              id="enable-feature"
              checked={enabled}
              onCheckedChange={setEnabled}
              className="w-full h-full rounded-full bg-muted data-[state=checked]:bg-primary"
            />
            <span className="absolute inset-0 flex pr-1 items-center justify-end text-xs font-semibold text-white pointer-events-none">
              {enabled ? " On" : " Off"}
            </span>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 text-xs">
              <TableHead>Serial Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Used Unit</TableHead>
              <TableHead>Balance Unit</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Last Connected At</TableHead>
              <TableHead>Is Low Balance</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Power</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>19104951074 </TableCell>
              <TableCell>META B-07- 01 R2</TableCell>
              <TableCell>13.5</TableCell>
              <TableCell>46.5</TableCell>
              <TableCell>RM 0.6</TableCell>
              <TableCell>2025-06-01 19:58:31</TableCell>
              <TableCell>No</TableCell>
              <TableCell>
                Meta Residence @ Seri Kembangan / B-07-01 / Room 2
              </TableCell>
              <TableCell>Wifi Connect</TableCell>
              <TableCell>Power On</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SmartHomeTap;
