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
// prettier-ignore
import { Pagination, PaginationContent, PaginationControl, PaginationData, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
import { formatDate } from "@/lib/utils";

export type Column<T> = {
  title: string;
  key: keyof T | string;
  className?: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  searchType?: "text" | "date";
};

type DatatableProps<T> = {
  data: T[];
  isPending: boolean;
  pagination: PaginationData;
  setPagination: React.Dispatch<React.SetStateAction<PaginationData>>;
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
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
  actions,
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

  function getNestedValue(obj: any, path: string): any {
    const parts = path.split(".");
    let current = obj;

    for (let part of parts) {
      const isArray = part.endsWith("[]");
      const key = isArray ? part.slice(0, -2) : part;

      if (current == null) return undefined;

      if (isArray) {
        const array = current[key];
        if (!Array.isArray(array)) return undefined;

        // return flat list of values for rest of path
        const remainingPath = parts.slice(parts.indexOf(part) + 1).join(".");
        return array.map((item) => getNestedValue(item, remainingPath)).flat();
      } else {
        current = current[key];
      }
    }

    return current;
  }

  const filteredData = data.filter((item) => {
    return Object.entries(searchTerms).every(([key, searchTerm]) => {
      if (!searchTerm) return true;

      const column = columns.find((col) => col.key === key);
      const searchType = column?.searchType || "text";
      const rawValue = getNestedValue(item, key);

      const testValue = (v: any) => {
        if (searchType === "date") {
          const formatted = formatDate(v, { withTime: true });
          return formatted.includes(searchTerm);
        }
        // default to text
        return String(v).toLowerCase().includes(searchTerm.toLowerCase());
      };

      if (Array.isArray(rawValue)) {
        return rawValue.some(testValue);
      }

      return testValue(rawValue);
    });
  });

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = getNestedValue(a, sortKey);
        const bVal = getNestedValue(b, sortKey);

        const valA = Array.isArray(aVal)
          ? String(aVal[0] ?? "")
          : String(aVal ?? "");
        const valB = Array.isArray(bVal)
          ? String(bVal[0] ?? "")
          : String(bVal ?? "");

        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      })
    : filteredData;

  return (
    <div className="w-full">
      <div className="rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="p-2 bg-gray-50 text-xs">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={` text-gray-600 py-4`}
                >
                  <div
                    className={`flex flex-col items-center ${
                      col.className ?? ""
                    }`}
                  >
                    <div className="flex items-center gap-x-2">
                      <span
                        className={`${
                          col.className?.includes("items-start") ? "pl-2" : ""
                        }`}
                      >
                        {col.title}
                      </span>
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

                    {col.searchable !== false && col.key !== "actions" && (
                      <Input
                        className="mt-2 w-full bg-white font-normal text-xs min-w-30 placeholder:text-xs"
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
                    )}
                  </div>
                </TableHead>
              ))}
              {(onView || onEdit || onDelete || actions) && (
                <TableHead className="text-gray-600 text-center pr-6">
                  Actions
                </TableHead>
              )}
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
                    actions={actions}
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

        {/* {!isPending && (
          <Pagination className="mt-4">
            <PaginationContent className="flex justify-between w-full">
              <PaginationItem className="text-xs text-gray-600">
                Page {pagination.page} of {pagination.last_page}
              </PaginationItem>
              <PaginationItem className="flex gap-x-2">
                <PaginationControl
                  pagination={pagination}
                  setPagination={setPagination}
                />
                <PaginationPrevious
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  isActive={pagination.page > 1}
                  className="bg-gray-100"
                />
                <PaginationNext
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  isActive={pagination.page < (pagination.last_page ?? 1)}
                  className="bg-gray-100"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )} */}
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
  actions,
}: {
  columns: Column<T>[];
  item: T;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
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
      {actions != null ? (
        <TableCell className="text-center">{actions(item)}</TableCell>
      ) : (
        (onView || onEdit || onDelete) && (
          <TableCell className="text-center">
            {onView && !onEdit && !onDelete ? (
              <Eye
                onClick={() => onView?.(item)}
                className="w-full cursor-pointer text-primary h-5 pr-4"
              />
            ) : (
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
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
          </TableCell>
        )
      )}
    </TableRow>
  );
}
