"use client";
import Datatable, { Column } from "@/components/datatable";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useGetUserList from "@/lib/services/hooks/useGetUserList";
import type User from "@/types/UserType";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import CreateNewUser from "./CreateNewUser";
import useGetRoleSelection from "@/lib/services/hooks/useGetRoleSelection";

const Page = () => {
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [formFilters, setFormFilters] = useState({
    username: "",
    email: "",
    role: "",
    status: "",
    page: "1",
    per_page: "10",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isPending, error } = useGetUserList(appliedFilters);
  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        page: data?.current_page ?? prev.page,
        per_page: data?.per_page ?? prev.per_page,
        last_page: data?.last_page ?? prev.last_page,
        links: data?.links ?? prev.links,
      }));
    }
  }, [data]);
  useEffect(() => {
    setAppliedFilters({
      ...formFilters,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.per_page]);

  const UserColumns: Column<User>[] = [
    {
      title: "ID",
      key: "id",
      sortable: true,
      className: "pl-6 py-4",
      render: (user) => (
        <div className="pl-4 text-primary font-medium ">{user.id}</div>
      ),
    },
    {
      title: "Name",
      key: "name",
      render: (user) => <div>{user.name}</div>,
    },
    {
      title: "Email",
      key: "email",
      render: (user) => <div>{user.email}</div>,
    },
    {
      title: "Roles",
      key: "roles",
      render: (user) => (
        <div>
          {user.roles && user.roles.length > 0
            ? user.roles.map((role) => role.name).join(", ")
            : "-"}
        </div>
      ),
    },
    {
      title: "Status",
      key: "email_verified_at",
      render: (user) => (
        <div>{user.email_verified_at ? "Active" : "Inactive"}</div>
      ),
      sortable: true,
    },
    {
      title: "Created At",
      key: "created_at",
      render: (user) => (
        <div>
          {user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
  ];
  const [roles, setRoles] = useState([]);
  const { data: rolesApi } = useGetRoleSelection(true);
  useEffect(() => {
    if (rolesApi) {
      const dataT = rolesApi.map((role) => {
        return { value: `${role.id}`, label: role.name };
      });
      setRoles(dataT as never);
    }
  }, [rolesApi, setRoles]);
  const users: User[] = data?.data || [];

  return (
    <div>
      {/* <HeaderPage title="User Management" /> */}
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter
          filters={[
            {
              name: "username",
              placeholder: "Username",
              type: "input",
              icon: Search,
            },
            {
              name: "email",
              placeholder: "Email",
              type: "input",
              icon: Search,
            },
            {
              name: "role",
              placeholder: "Roles",
              type: "select",
              selectItems: roles,
              icon: Search,
            },
            {
              name: "status",
              placeholder: "Status",
              type: "select",
              selectItems: [
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ],
              icon: Search,
            },
          ]}
          actionButton={
            <Button
              onClick={() => setAppliedFilters(formFilters)}
              className="text-white"
            >
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />
        <div className="flex w-full justify-between my-3">
          <div>
            {!isPending && (
              <Pagination>
                <PaginationContent className="flex justify-between w-full items-center">
                  <PaginationItem className="text-xs text-gray-600">
                    Page {pagination.page} of {pagination.last_page}
                  </PaginationItem>
                  <PaginationItem className="flex gap-x-2">
                    <PaginationControl
                      pagination={pagination}
                      setPagination={setPagination}
                    />
                    <PaginationPrevious
                      onClick={() => {
                        if (pagination.page <= 1) {
                          null;
                        } else {
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                          }));
                        }
                      }}
                      isActive={pagination.page > 1}
                      className={`bg-gray-100 cursor-pointer ${
                        pagination.page <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <PaginationNext
                      onClick={() => {
                        if (
                          pagination.page >= (pagination.last_page as number)
                        ) {
                          null;
                        } else {
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                          }));
                        }
                      }}
                      isActive={pagination.page < (pagination.last_page ?? 1)}
                      className={`bg-gray-100 cursor-pointer ${
                        pagination.page >= (pagination.last_page as number)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
          <div className="flex flex-wrap space-x-3">
            {/* <Button className="rounded-[6px] text-white ">
              Create New Expenses
            </Button> */}
            <CreateNewUser />
          </div>
        </div>

        <Datatable<User>
          columns={UserColumns}
          data={users}
          isPending={isPending}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: User) => item.id}
        />
        {error && <div className="text-red-500 mt-2">Error loading users.</div>}
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
