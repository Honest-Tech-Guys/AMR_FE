"use client";

import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as yup from "yup";

import HeaderSection from "@/components/HeaderSection";
import MultiFileUpload from "@/components/input-11";
import { TreeNode, TreeSelect } from "@/components/TreeSelect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useGetSelection, {
  PropertySelection,
} from "@/lib/services/hooks/useGetSelection";
import useGetTenantsList from "@/lib/services/hooks/useGetTenant";
import useGetBooksList from "@/lib/services/hooks/usGetBooks";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { TenantSelect } from "@/components/TenantSelect";
// Schema & type
const schema = yup.object({
  // Basic Information
  property_id: yup.string().required("Item is required"),
  tenant: yup.string().required("Tenant is required"),
  move_in_date: yup.string().required("Move in date is required"),
  move_out_date: yup.string().required("Move out date is required"),
  type: yup.string().required("Type is required"),
  // Rental Information
  rental: yup.string().required("Rental fee is required"),
  rental_payment_frequency: yup
    .string()
    .required("Rental payment frequency is required"),
  remarks: yup.string().required("Remarks is required"),

  front_side: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required(),
        size: yup.number().required(),
        type: yup.string().required(),
        base64: yup.string().required(),
      })
    )
    .optional(),
  back_side: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required(),
        size: yup.number().required(),
        type: yup.string().required(),
        base64: yup.string().required(),
      })
    )
    .optional(),
});
type schemaType = yup.InferType<typeof schema>;
type Payload = {
  tenant_id: string;
  tenant_name: string;
  move_in_date: string;
  move_out_date: string;
  rental_fee: string;
  rental_payment_frequency: string;
  identity_type: string;
  remarks?: string;
};
interface Props {
  payload: Payload[];
  setPayload: React.Dispatch<React.SetStateAction<Payload[]>>;
}
const CreateBulk = ({ setPayload }: Props) => {
  const form = useForm<schemaType>({
    mode: "onTouched",
    resolver: yupResolver(schema) as any,
    defaultValues: {
      type: "NRIC",
    },
  });
  const {
    setValue,
    getValues,
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const [tenantData, setTenantData] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const { data: tenants } = useGetTenantsList();
  useEffect(() => {
    if (tenants) {
      const dataT = tenants.map((t) => {
        return { id: `${t.id}`, name: t.name };
      });
      setTenantData(dataT as never);
    }
  }, [tenants]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  function mapToTreeData(properties: PropertySelection[]): TreeNode[] {
    return properties.map((property) => ({
      label: property.property_name,
      value: `property-${property.id}`, // ensure string
      children: property.units.map((unit) => ({
        label: unit.block_floor_unit_number,
        value: `unit-${unit.id}`, // ensure string
        children: unit.rooms.map((room) => ({
          label: room.name,
          value: `room-${room.id}`, // ensure string
        })),
      })),
    }));
  }
  const { data } = useGetSelection();
  const { refetch } = useGetBooksList();
  useEffect(() => {
    if (data) {
      setTreeData(mapToTreeData(data));
    }
  }, [data]);
  type Result =
    | { room_id: number }
    | { unit_id: number }
    | { property_id: number }
    | null;
  const parseValue = (value: string): Result => {
    const match = value.match(/^(\w+)-(\d+)$/);
    if (!match) return null;

    const [, type, id] = match;
    const numberId = Number(id);
    if (type === "property") {
      return { property_id: numberId };
    } else if (type === "room") {
      return { room_id: numberId };
    } else if (type === "unit") {
      return { unit_id: numberId };
    }

    return null;
  };
  const onSubmit: SubmitHandler<schemaType> = (data, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const selectedTenant = tenantData.find(
      (tenant) => tenant.id === data.tenant
    );

    const payload = {
      tenant_id: data.tenant,
      tenant_name: selectedTenant ? selectedTenant.name : "",
      move_in_date: data.move_in_date,
      move_out_date: data.move_out_date,
      rental_fee: data.rental,
      rental_payment_frequency: data.rental_payment_frequency,
      identity_type: data.type,
      remarks: data.remarks,
      ...parseValue(data.property_id),
    };
    setPayload((prev) => [...prev, payload]);
    reset();
    setIsOpen(false);
    console.log("Form data:", data);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-black rounded-[6px] max-w-15 text-white hover:bg-black/70 cursor-pointer"
          type="button"
        >
          <Plus />
          Add
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Booking
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="space-y-3"
                onClick={(e) => {
                  // e.stopPropagation();
                }}
              >
                <Label>Select Item</Label>
                <TreeSelect
                  control={control}
                  name="property_id"
                  placeholder="Choose item..."
                  treeData={treeData}
                />
                {errors.property_id && (
                  <span className="text-red-500 text-sm">
                    {errors.property_id.message}
                  </span>
                )}
              </div>
              <TenantSelect<schemaType>
                name="tenant"
                title="Tenant"
                options={tenantData}
              />
              <CustomInput
                id="move_in_date"
                name="move_in_date"
                type="date"
                label="Move In Date"
                value={watch("move_in_date")}
                onChange={(e) => setValue("move_in_date", e.target.value)}
                errors={errors.move_in_date?.message}
                placeholder="Enter Move In Date"
              />
              <CustomInput
                id="move_out_date"
                name="move_out_date"
                type="date"
                label="Move Out Date"
                value={watch("move_out_date")}
                onChange={(e) => setValue("move_out_date", e.target.value)}
                errors={errors.move_out_date?.message}
                placeholder="Enter Move Out Date"
              />
              <div>
                <Label className="mb-5">Type</Label>
                <RadioGroup
                  value={watch("type")}
                  className="flex items-center gap-3"
                  onValueChange={(val) => setValue("type", val)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NRIC" id="NRIC" />
                    <Label htmlFor="NRIC">NRIC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="passport" />
                    <Label htmlFor="passport">Passport</Label>
                  </div>
                </RadioGroup>
              </div>{" "}
              <div></div>
              <div className="space-y-2 ">
                <span className="font-semibold">Front Side</span>
                <Controller
                  control={control}
                  name="front_side"
                  // rules={{ required: "Company statutory form is required" }}
                  render={({ field: { onChange, value } }) => (
                    <MultiFileUpload
                      isMulti={false}
                      field="front_side"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.front_side && (
                  <span className="text-red-500 text-sm">
                    {errors.front_side.message}
                  </span>
                )}
              </div>{" "}
              <div className="space-y-2 ">
                <span className="font-semibold">Back Side</span>
                <Controller
                  control={control}
                  name="back_side"
                  // rules={{ required: "Company statutory form is required" }}
                  render={({ field: { onChange, value } }) => (
                    <MultiFileUpload
                      isMulti={false}
                      field="back_side"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.back_side && (
                  <span className="text-red-500 text-sm">
                    {errors.back_side.message}
                  </span>
                )}
              </div>
            </div>
            <HeaderSection title="Rental Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <CustomInput
                  id="rental"
                  name="rental"
                  type="number"
                  label="Rental Fee"
                  value={watch("rental")}
                  onChange={(e) => setValue("rental", e.target.value)}
                  errors={errors.rental?.message}
                  placeholder="Enter Rental"
                />
              </div>

              <div>
                <Label className="mb-3">Rental Payment Frequency</Label>
                <Controller
                  control={control}
                  name="rental_payment_frequency"
                  render={({ field }) => (
                    <ToggleGroup
                      variant="outline"
                      type="single"
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                    >
                      <ToggleGroupItem value="Monthly" aria-label="Monthly">
                        Monthly
                      </ToggleGroupItem>
                      <ToggleGroupItem value="Daily" aria-label="Daily">
                        Daily
                      </ToggleGroupItem>
                      <ToggleGroupItem value="One Time" aria-label="One Time">
                        One Time
                      </ToggleGroupItem>
                    </ToggleGroup>
                  )}
                />
                {errors.rental_payment_frequency && (
                  <span className="text-red-500 text-sm">
                    {errors.rental_payment_frequency.message}
                  </span>
                )}
              </div>
              <div className="col-span-1 md:col-span-2">
                <CustomInput
                  id="remarks"
                  label="Remarks"
                  type="textArea"
                  name="remarks"
                  value={watch("remarks")}
                  onChange={(e) => setValue("remarks", e.target.value)}
                  placeholder="E.g describe more about the reason for change"
                  className="bg-gray-100 rounded-[6px]"
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
              <Button type="submit" className="text-white">
                Add
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBulk;
