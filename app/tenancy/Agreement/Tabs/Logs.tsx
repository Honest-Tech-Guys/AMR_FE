import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const Logs = () => {
  const logs = [
    {
      user: "System",
      event: "Agreement Confirmed",
      description: "Agreement 9JHGWPUYCB updated.",
      datetime: "01 Jun 10:34 AM",
    },
  ];
  return (
    <div className="min-h-[70vh]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Data/Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.user}>
              <TableCell className="font-medium">{log.user}</TableCell>
              <TableCell>{log.event}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell className="text-right">{log.datetime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Logs;
