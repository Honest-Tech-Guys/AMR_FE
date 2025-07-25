"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LoaderCircle,
  Ellipsis,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type Column<T> = {
  title: string;
  key: keyof T | string;
  className?: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
};

type DatatableProps<T> = {
  data: T[];
  isPending: boolean;
  isFilter: boolean;
  pagination: PaginationData;
  setPagination: React.Dispatch<React.SetStateAction<PaginationData>>;
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
};

function Datatable<T>({
  columns,
  data,
  isPending,
  pagination,
  setPagination,
  rowKey,
  onView,
  onEdit,
  onDelete,
  isFilter,
}: DatatableProps<T>) {
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "default">(
    "desc"
  );

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder("desc");
    } else {
      if (sortOrder === "default") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortOrder("asc");
      } else if (sortOrder === "asc") {
        setSortKey(null);
        setSortOrder("default");
      }
    }
  };

  const filteredData = data.filter((item) => {
    return columns.every((col) => {
      const key = col.key as keyof T;
      const searchTerm = searchTerms[key as string];
      if (!searchTerm) return true;
      const value = String(item[key] ?? "");
      return value.includes(searchTerm);
    });
  });

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const valA = String((a as any)[sortKey]);
        const valB = String((b as any)[sortKey]);
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      })
    : filteredData;

  return (
    <div className="w-full max-w-[1070px]">
      <div className=" overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="p-2 bg-gray-50 text-xs">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={` text-gray-600 text-center ${
                    col.className ?? ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-x-2">
                      {col.title}
                      {col.sortable && (
                        <span
                          className="hover:cursor-pointer"
                          onClick={() =>
                            col.sortable && handleSort(String(col.key))
                          }
                        >
                          {sortKey === col.key && sortOrder === "asc" ? (
                            <ArrowUp size={12} />
                          ) : sortKey === col.key && sortOrder === "desc" ? (
                            <ArrowDown size={12} />
                          ) : (
                            <ArrowUpDown size={12} />
                          )}
                        </span>
                      )}
                    </div>
                    <AnimatePresence>
                      {isFilter && (
                        <motion.div
                          key="filter-panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <Input
                            className="mt-2 w-full h-6 placeholder:text-xs bg-white font-normal text-xs min-w-25"
                            readOnly={isPending}
                            placeholder={`Search ${col.title}`}
                            value={searchTerms[String(col.key)] ?? ""}
                            onChange={(e) =>
                              setSearchTerms((prev) => ({
                                ...prev,
                                [String(col.key)]: e.target.value,
                              }))
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* {col.searchable !== false && (
                      <Input
                        className="mt-2 w-full h-6 placeholder:text-xs bg-white font-normal text-xs min-w-25"
                        readOnly={isPending}
                        placeholder={`Search ${col.title}`}
                        value={searchTerms[String(col.key)] ?? ""}
                        onChange={(e) =>
                          setSearchTerms((prev) => ({
                            ...prev,
                            [String(col.key)]: e.target.value,
                          }))
                        }
                      />
                    )} */}
                  </div>
                </TableHead>
              ))}
              {/* <TableHead className="text-gray-600 text-center pr-6">
                Actions
              </TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData.length > 0
              ? sortedData.map((item) => (
                  <Row
                    key={rowKey(item)}
                    columns={columns}
                    item={item}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              : !isPending && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="text-center py-0"
                    >
                      <div className="flex w-full justify-center items-center min-h-96">
                        <span className="font-light">No Results Found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>

        {isPending && (
          <div className="flex w-full justify-center items-center min-h-96">
            <LoaderCircle className="size-10 animate-spin text-primary" />
          </div>
        )}

        {!isPending && sortedData.length > 0 && (
          <Pagination className="mt-4">
            <PaginationContent className="flex justify-between w-full">
              <PaginationItem className="text-xs text-gray-600">
                Page {pagination.page} of 10
              </PaginationItem>
              <PaginationItem className="flex gap-x-2">
                <PaginationControl
                  pagination={pagination}
                  setPagination={setPagination}
                />
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(prev.page - 1, 1),
                    }))
                  }
                  className="bg-gray-100"
                />
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: prev.page + 1,
                    }))
                  }
                  className="bg-gray-100"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export default Datatable;

function Row<T>({
  columns,
  item,
  onView,
  onEdit,
  onDelete,
}: {
  columns: Column<T>[];
  item: T;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <TableRow className="odd:bg-muted/50 ">
      {columns.map((col) => (
        <TableCell key={String(col.key)} className="text-center">
          {col.render
            ? col.render(item)
            : String((item as any)[col.key] ?? "-")}
        </TableCell>
      ))}
      {/* <TableCell className="text-center">
        {onView && !onEdit && !onDelete ? (
          <Eye
            onClick={() => onView?.(item)}
            className="w-full cursor-pointer text-primary h-5 pr-4"
          />
        ) : (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild className="mr-4">
              <Button variant="ghost" size="icon" className=" h-5">
                <Ellipsis className="text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setTimeout(() => onView?.(item), 0);
                  }}
                >
                  View
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setTimeout(() => onEdit?.(item), 0);
                  }}
                >
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-red-500 hover:cursor-pointer hover:bg-gray-100 hover:text-red-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setTimeout(() => onDelete?.(item), 0);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell> */}
    </TableRow>
  );
}
