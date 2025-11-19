"use client";

import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
import HeaderSection from "@/components/HeaderSection";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TreeNode, TreeSelect } from "@/components/TreeSelect";
import { useEffect, useState } from "react";
import useGetSelection, {
  PropertySelection,
} from "@/lib/services/hooks/useGetSelection";
import { toast } from "sonner";
import LockType from "@/types/LockType";

// Schema & type
const schema = yup.object({
  property_id: yup.string().required("Property id is required"),
  serial_number: yup.string().required("Serial Number is required"),
  auto_create_passcode: yup.boolean().required(),
});
type SchemaType = yup.InferType<typeof schema> & {
  [key: string]: any; // allow dynamic fields
};

type EditLockProps = {
  lock: LockType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EditLock = ({ lock, open, onOpenChange }: EditLockProps) => {
  const form = useForm<SchemaType>({
    mode: "onTouched",
    defaultValues: {
      serial_number: lock?.serial_number || "",
      property_id: "",
      auto_create_passcode: Boolean(lock?.auto_create_passcode),
    },
  });
  const {
    setValue,
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const { data } = useGetSelection(open);

  useEffect(() => {
    if (data) setTreeData(mapToTreeData(data));
  }, [data]);

  useEffect(() => {
    if (lock) {
      reset({
        serial_number: lock.serial_number,
        property_id: "",
        auto_create_passcode: Boolean(lock.auto_create_passcode),
      });
    }
  }, [lock, reset]);

  function mapToTreeData(properties: PropertySelection[]): TreeNode[] {
    return properties.map((property) => ({
      value: `property-${property.id}`,
      label: property.property_name,
      children: property.units.map((unit) => ({
        value: `unit-${unit.id}`,
        label: unit.block_floor_unit_number,
        children: unit.rooms.map((room) => ({
          value: `room-${room.id}`,
          label: room.name,
        })),
      })),
    }));
  }

  const facilities = [
    { id: "Passcode", label: "Passcode" },
    { id: "Finger print", label: "Fingerprint" },
    { id: "IC Card", label: "IC Card" },
  ] as const;
  type FacilityId = (typeof facilities)[number]["id"];

  type Result = { room_id: number } | { unit_id: number } | null;
  const parseValue = (value: string): Result => {
    const match = value.match(/^(\w+)-(\d+)$/);
    if (!match) return null;
    const [, type, id] = match;
    const numberId = Number(id);
    if (type === "room") return { room_id: numberId };
    if (type === "unit") return { unit_id: numberId };
    return null;
  };

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    if (!lock) return;

    const self_check_options = facilities
      .filter((f) => (data as any)[f.id])
      .map((f) => f.id);

    const payload: any = {
      serial_number: data.serial_number,
      auto_create_passcode: data.auto_create_passcode,
      self_check_options,
      ...parseValue(data.property_id),
    };

    console.log(lock);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            View Lock
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="serial_number"
                name="serial_number"
                type="text"
                label="Serial Number"
                value={watch("serial_number")}
                onChange={(e) => setValue("serial_number", e.target.value)}
                errors={errors.serial_number?.message}
                placeholder="Enter Serial Number"
              />
              <div className="space-y-2.5">
                <Label>Select Item</Label>
                <TreeSelect
                  control={control}
                  name="property_id"
                  placeholder="Choose item..."
                  treeData={treeData}
                />
              </div>
              <div>
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="auto_create_passcode">
                    Auto Create Passcode
                  </Label>
                  <Controller
                    name="auto_create_passcode"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="auto_create_passcode"
                          checked={Boolean(field.value)}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="auto_create_passcode"
                          className="text-sm"
                        >
                          Auto Create Passcode
                        </label>
                      </div>
                    )}
                  />
                </div>
              </div>
              <div>
                <Label>Self Check</Label>
                <div className="flex gap-4 mt-4">
                  {facilities.map((facility) => (
                    <CustomInput
                      key={facility.id}
                      id={facility.id}
                      name={facility.id}
                      label={facility.label}
                      type="checkbox"
                      checkboxDefaultValue={Boolean(
                        watch(facility.id as FacilityId)
                      )}
                      onCheckedChange={(checked) =>
                        setValue(facility.id as FacilityId, checked as boolean)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditLock;
