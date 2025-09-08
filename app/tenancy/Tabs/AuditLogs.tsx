import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const AuditLogsTap = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 text-xs">
          <TableHead>User</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date/Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>System </TableCell>
          <TableCell>Meter Power On (Paid Invoice)</TableCell>
          <TableCell>Meter [19104951074-META B-07-01 R2] power on.</TableCell>
          <TableCell>01 Jun 10:34 AM</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default AuditLogsTap;
