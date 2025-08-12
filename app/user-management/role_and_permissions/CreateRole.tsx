"use client";

import {
  useForm,
  FormProvider,
  useFieldArray,
  Controller,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import CustomInput from "@/components/CustomInput";
import HeaderSection from "@/components/HeaderSection";
import { Separator } from "@radix-ui/react-separator";

const MODULES = [
  "Dashboard",
  "Property",
  "Tenancy",
  "Booking",
  "Smart Home",
  "Payout",
  "People",
  "Accounting",
  "Notification",
  "Reports",
  "User Management",
] as const;

const PERMISSIONS = ["view", "add", "edit", "delete", "export"] as const;

type PermissionType = (typeof PERMISSIONS)[number];

type FormValues = {
  role: string;
  identifier: string;
  remarks: string;
  permissions: {
    module: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
  }[];
};

const schema = yup.object({
  role: yup.string().required("Role is required"),
  identifier: yup.string().required("Identifier is required"),
  remarks: yup.string().required("Remarks are required"),
  permissions: yup
    .array()
    .of(
      yup.object({
        module: yup.string().required("Module name is required"),
        view: yup.boolean().required(),
        add: yup.boolean().required(),
        edit: yup.boolean().required(),
        delete: yup.boolean().required(),
        export: yup.boolean().required(),
      })
    )
    .required("Permissions are required")
    .min(1, "At least one module must be present"),
});

const CreateNewRole = () => {
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "",
      identifier: "",
      remarks: "",
      permissions: MODULES.map((module) => ({
        module,
        view: false,
        add: false,
        edit: false,
        delete: false,
        export: false,
      })),
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const toggleAllPermissions = (value: boolean) => {
    const updatedPermissions = methods.getValues("permissions").map((perm) => ({
      ...perm,
      view: value,
      add: value,
      edit: value,
      delete: value,
      export: value,
    }));
    methods.setValue("permissions", updatedPermissions);
  };

  const { fields } = useFieldArray({
    control,
    name: "permissions",
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white">Create New Role</Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-2xl font-bold">Create New Role</div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="role"
                type="text"
                name="role"
                label="Role"
                placeholder="Enter Role"
                errors={errors.role?.message}
              />
              <CustomInput
                type="text"
                id="identifier"
                name="identifier"
                label="Identifier"
                placeholder="Enter Identifier"
                errors={errors.identifier?.message}
              />
              <div className="col-span-1 md:col-span-2">
                <CustomInput
                  id="remarks"
                  name="remarks"
                  label="Remarks"
                  placeholder="Describe reason for the role"
                  type="textArea"
                  errors={errors.remarks?.message}
                />
              </div>
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
                  {PERMISSIONS.map((perm) => (
                    <TableHead key={perm} className="capitalize">
                      {perm}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>{field.module}</TableCell>
                    {PERMISSIONS.map((perm) => (
                      <TableCell key={perm} className="text-center">
                        <Controller
                          control={control}
                          name={`permissions.${index}.${perm}` as const}
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
              <Button type="submit" className="text-white">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewRole;
