"use client";

import CustomInput from "@/components/CustomInput";
import HeaderSection from "@/components/HeaderSection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetRole from "@/lib/services/hooks/useGetRole";
import useUpdateRole from "@/lib/services/hooks/useUpdateRole";
import useGetPermissionsList from "@/lib/services/hooks/useGetPermissionsList";
import Role from "@/types/RoleType";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { Eye } from "lucide-react";
interface Permission {
  id: number;
  name: string;
  value: boolean;
}
interface ModulePermissions {
  module: string;
  permissions: Permission[];
}

type FormValues = {
  name: string;
  permissions: ModulePermissions[];
};

const schema = yup.object({
  name: yup.string().required("Name is required"),
  permissions: yup
    .array()
    .of(
      yup.object({
        module: yup.string().required("Module name is required"),
        permissions: yup
          .array()
          .of(
            yup.object({
              id: yup.number().required(),
              name: yup.string().required(),
              value: yup.boolean().required(),
            })
          )
          .required(),
      })
    )
    .required("Permissions are required")
    .min(1, "At least one module must be present"),
});
interface Props {
  role: Role;
}
const EditRole = ({ role }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  // Merge API permissions with role's current permissions
  const defaultPermissions: ModulePermissions[] =
    role.permissions?.map((mod: any) => {
      const roleModule = role.permissions?.find(
        (rmod: any) => rmod.module === mod.module
      );
      return {
        module: mod.module,
        permissions: mod.permissions.map((perm: any) => {
          //   const hasPermission = roleModule?.permissions.some(
          //     (rperm: any) => rperm.id === perm.id
          //   );
          return {
            id: perm.id,
            name: perm.name,
            value: perm.value,
          };
        }),
      };
    }) || [];

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: role.name || "",
      permissions: defaultPermissions,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = methods;

  // Reset form when permissionsData or role changes
  useEffect(() => {
    if (role) {
      reset({
        name: role.name || "",
        permissions: defaultPermissions,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // Toggle all permissions
  const toggleAllPermissions = (value: boolean) => {
    const updatedPermissions = methods.getValues("permissions").map((mod) => ({
      ...mod,
      permissions: mod.permissions.map((perm) => ({ ...perm, value })),
    }));
    methods.setValue("permissions", updatedPermissions);
  };
  const { mutate, isPending } = useUpdateRole();
  const { refetch } = useGetRole();
  const onSubmit = (data: FormValues) => {
    mutate(
      { ...data, id: role.id },
      {
        onSuccess: () => {
          toast.success("Role updated successfully!");
          reset();
          refetch();
          setIsOpen(false);
        },
        onError: (err) => {
          toast.error((err as any)?.message || "Failed to update role.");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Eye />
      </DialogTrigger>
      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-2xl font-bold">Edit Role</div>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <CustomInput
                id="name"
                type="text"
                name="name"
                label="Name"
                value={watch("name")}
                onChange={(e) => setValue("name", e.target.value)}
                placeholder="Enter Name"
                errors={errors.name?.message}
              />
            </div>
            <HeaderSection title="Permissions Table" />
            <div className="flex justify-end items-center text-sm text-primary my-4 ">
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-transparent cursor-pointer"
                onClick={() => toggleAllPermissions(true)}
              >
                Select All
              </Button>
              |
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-transparent cursor-pointer"
                onClick={() => toggleAllPermissions(false)}
              >
                Deselect All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 text-xs">
                  <TableHead>Module</TableHead>
                  {/* Dynamically render permission columns */}
                  {role.permissions &&
                    role.permissions[0]?.permissions.map((perm: any) => (
                      <TableHead
                        key={perm.id}
                        className="capitalize text-center"
                      >
                        {perm.name.split(" ")[0]}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {watch("permissions").map((mod, modIdx) => (
                  <TableRow key={mod.module}>
                    <TableCell>{mod.module}</TableCell>
                    {mod.permissions.map((perm, permIdx) => (
                      <TableCell key={perm.id} className=" text-center">
                        <Controller
                          control={control}
                          name={
                            `permissions.${modIdx}.permissions.${permIdx}.value` as const
                          }
                          render={({ field: switchField }) => (
                            <Switch
                              checked={switchField.value}
                              onCheckedChange={switchField.onChange}
                            />
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="text-white" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditRole;
