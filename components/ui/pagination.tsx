import * as React from "react";
import {
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5 border", className)}
      {...props}
    >
      <span className="text-xs">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5 border", className)}
      {...props}
    >
      <span className="text-xs">Next</span>
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export interface PaginationData {
  page: number;
  per_page: number;
  last_page?: number;
  links?: {
    active: boolean;
    url: string | null;
    label: string;
  }[];
}
interface PaginationControlProps extends React.ComponentProps<"div"> {
  pagination: PaginationData;
  setPagination: React.Dispatch<React.SetStateAction<PaginationData>>;
}

function PaginationControl({
  className,
  pagination,
  setPagination,
  ...props
}: PaginationControlProps) {
  return (
    <div
      data-slot="pagination-control"
      className={cn("flex items-center gap-x-2", className)}
      {...props}
    >
      <div className="relative">
        <Select
          value={pagination.page?.toString()}
          onValueChange={(page) =>
            setPagination((prev) => ({ ...prev, page: Number(page) }))
          }
        >
          <SelectTrigger
            className={cn(
              "text-xs w-21 bg-white border-gray-200 [&>svg]:hidden pr-0"
            )}
          >
            <SelectValue defaultValue="1" />
            <div className="flex items-center bg-gray-100 absolute right-0 top-0 bottom-0 px-1 rounded-r-md border-l border-gray-200">
              <ChevronDown className="h-4 w-4 text-black" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {pagination?.links
              ?.filter((item) => item.label.match(/\d+/)?.[0])
              .map((page) => (
                <SelectItem
                  key={page.label}
                  value={page?.label}
                  className={"text-xs"}
                >
                  {`Page-${page.label}`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Select
          value={pagination.per_page?.toString()}
          onValueChange={(per_page) =>
            setPagination((prev) => ({ ...prev, per_page: Number(per_page) }))
          }
        >
          <SelectTrigger
            className={cn(
              "text-xs w-22 bg-white border-gray-200 [&>svg]:hidden pr-0"
            )}
          >
            <SelectValue defaultValue="10" />
            <div className="flex items-center bg-gray-100 absolute right-0 top-0 bottom-0 px-1 rounded-r-md border-l border-gray-200">
              <ChevronDown className="h-4 w-4 text-black" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((value) => (
              <SelectItem
                key={value}
                value={value.toString()}
                className="text-xs"
              >
                {`${value} rows`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationControl,
};
