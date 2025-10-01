import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetTenancyLogs from "@/lib/services/hooks/useGetTenancyLogs";
import { formatDate } from "@/lib/utils";
import { Tenancy } from "@/types/TenancyType";
import React from "react";
interface Props {
  tenancy: Tenancy;
}
const AuditLogsTap = ({ tenancy }: Props) => {
  const { data } = useGetTenancyLogs(tenancy.id);
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
        {data?.map((log) => (
          <TableRow>
            <TableCell>{log.causer.name} </TableCell>
            <TableCell>{log.event}</TableCell>
            <TableCell>{log.description}</TableCell>
            <TableCell>
              {formatDate(log.created_at, { withTime: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuditLogsTap;
