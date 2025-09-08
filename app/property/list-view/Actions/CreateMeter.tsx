"use client";

import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import { TreeNode, TreeSelect } from "@/components/TreeSelect";
import { Label } from "@/components/ui/label";
import useGetSelection, {
  PropertySelection,
} from "@/lib/services/hooks/useGetSelection";
import { useEffect, useState } from "react";
import useAddMeter from "@/lib/services/hooks/useAddMeter";
import { toast } from "sonner";
// ✅ Schema based on `Meter` type
const schema = yup.object({
  property_id: yup.string().required("Meter name is required"),
  name: yup.string().required("Meter name is required"),
  serial_number: yup.string().required("Serial number is required"),
  brand: yup.string().nullable(),
  model: yup.string().nullable(),
  unit_price_per_unit: yup.string().required("Unit price is required"),
  minimum_topup_unit: yup
    .number()
    .typeError("Minimum topup unit must be a number")
    .required("Minimum topup unit is required"),
  minimum_topup_rm: yup.string().required("Minimum topup value is required"),
  free_unit: yup.number().typeError("Free unit must be a number").default(0),
  free_unit_refresh_on: yup.string().nullable(),
  remarks: yup.string().nullable(),
});
const treeDataDummy = [
  {
    label: "Fruits",
    value: "fruits",
    children: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      {
        label: "Citrus",
        value: "citrus",
        children: [
          { label: "Orange", value: "orange" },
          { label: "Lemon", value: "lemon" },
        ],
      },
    ],
  },
  {
    label: "Vegetables",
    value: "vegetables",
    children: [
      { label: "Carrot", value: "carrot" },
      { label: "Potato", value: "potato" },
    ],
  },
];
type SchemaType = yup.InferType<typeof schema>;
interface Props {
  id: number;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}
const CreateMeter = ({ id, open, onOpenChange }: Props) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  function mapToTreeData(properties: PropertySelection[]): TreeNode[] {
    return properties
      .filter((property) => (id ? property.id === id : true))
      .map((property) => ({
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
  const { data } = useGetSelection();
  useEffect(() => {
    if (data) {
      setTreeData(mapToTreeData(data));
    }
  }, [data]);
  const form = useForm<SchemaType>({
    mode: "onTouched",
    // resolver: yupResolver(schema),
  });
  const { mutate, isPending } = useAddMeter();
  const {
    setValue,
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  type Result = { room_id: number } | { unit_id: number } | null;

  const parseValue = (value: string): Result => {
    const match = value.match(/^(\w+)-(\d+)$/);
    if (!match) return null;

    const [, type, id] = match;
    const numberId = Number(id);

    if (type === "room") {
      return { room_id: numberId };
    } else if (type === "unit") {
      return { unit_id: numberId };
    }

    return null;
  };
  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    const payload: any = {
      name: data.name,
      serial_number: data.serial_number,
      brand: data.brand,
      model: data.model,
      unit_price_per_unit: data.unit_price_per_unit,
      minimum_topup_unit: data.minimum_topup_unit,
      minimum_topup_rm: data.minimum_topup_rm,
      ...parseValue(data.property_id),
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Meter created successfully!");
        reset();
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error((err as any)?.message || "Failed to create Meter");
      },
    });
    console.log("Meter form data:", data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Add Meter
        </Button>
      </DialogTrigger> */}

      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="md:max-w-[1000px] bg-white z-400 md:p-10 max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Add Meter
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>Select Item</Label>
                <TreeSelect
                  control={control}
                  name="property_id"
                  placeholder="Choose item..."
                  treeData={treeData}
                />
              </div>

              <CustomInput
                id="name"
                name="name"
                type="text"
                label="Meter Name"
                value={watch("name")}
                onChange={(e) => setValue("name", e.target.value)}
                errors={errors.name?.message}
                placeholder="Enter Meter Name"
              />

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

              <CustomInput
                id="brand"
                name="brand"
                type="text"
                label="Brand"
                value={watch("brand")}
                onChange={(e) => setValue("brand", e.target.value)}
                errors={errors.brand?.message}
                placeholder="Enter Brand"
              />

              <CustomInput
                id="model"
                name="model"
                type="text"
                label="Model"
                value={watch("model")}
                onChange={(e) => setValue("model", e.target.value)}
                errors={errors.model?.message}
                placeholder="Enter Model"
              />

              <CustomInput
                id="unit_price_per_unit"
                name="unit_price_per_unit"
                type="number"
                label="Unit Price / per unit"
                value={watch("unit_price_per_unit")}
                onChange={(e) =>
                  setValue("unit_price_per_unit", e.target.value)
                }
                errors={errors.unit_price_per_unit?.message}
                placeholder="Enter Unit Price"
              />

              <CustomInput
                id="minimum_topup_unit"
                name="minimum_topup_unit"
                type="number"
                label="Minimum Topup Unit"
                value={watch("minimum_topup_unit")}
                onChange={(e) =>
                  setValue("minimum_topup_unit", Number(e.target.value))
                }
                errors={errors.minimum_topup_unit?.message}
                placeholder="Enter Minimum Topup Unit"
              />

              <CustomInput
                id="minimum_topup_rm"
                name="minimum_topup_rm"
                type="number"
                label="Minimum Topup Value (RM)"
                value={watch("minimum_topup_rm")}
                onChange={(e) => setValue("minimum_topup_rm", e.target.value)}
                errors={errors.minimum_topup_rm?.message}
                placeholder="Enter Minimum Topup Value"
              />

              <CustomInput
                id="free_unit"
                name="free_unit"
                type="number"
                label="Free Unit"
                value={watch("free_unit")}
                onChange={(e) => setValue("free_unit", Number(e.target.value))}
                errors={errors.free_unit?.message}
                placeholder="Enter Free Units"
              />

              <CustomInput
                id="free_unit_refresh_on"
                name="free_unit_refresh_on"
                type="date"
                label="Free Unit Refresh On"
                value={watch("free_unit_refresh_on") ?? ""}
                onChange={(e) =>
                  setValue("free_unit_refresh_on", e.target.value)
                }
                errors={errors.free_unit_refresh_on?.message}
              />

              <div className="col-span-1 md:col-span-2">
                <CustomInput
                  id="remarks"
                  label="Remarks"
                  type="textArea"
                  name="remarks"
                  value={watch("remarks") ?? ""}
                  onChange={(e) => setValue("remarks", e.target.value)}
                  placeholder="E.g. describe more about the reason for change"
                  className="bg-gray-100"
                  errors={errors.remarks?.message}
                />
              </div>
            </div>

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

export default CreateMeter;
