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
// import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import PhoneInput from "@/components/phone-input";
import useAddProperty from "@/lib/services/hooks/useAddProperties";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { TreeNode, TreeSelect } from "@/components/TreeSelect";
import useGetSelection, {
  PropertySelection,
} from "@/lib/services/hooks/useGetSelection";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useGetTenantsList from "@/lib/services/hooks/useGetTenant";
import useCreateTenancy from "@/lib/services/hooks/useCreateTenancy";
import { TenantSelect } from "@/components/TenantSelect";
// Schema & type
const schema = yup.object({
  property_id: yup.string().required("Property name is required"),
  tenant: yup.string().required("Property type is required"),
  date_of_agreement: yup.string().required("Date of agreement is required"),
  rental_fee: yup.string().required("Rental fee is required"),
  tenancy_period_start_date: yup
    .string()
    .required("Tenancy period start date is required"),
  tenancy_period_end_date: yup
    .string()
    .required("Tenancy period end date is required"),
  rental_payment_frequency: yup
    .string()
    .required("Rental payment frequency is required"),
  remarks: yup.string().nullable(),
  //   free_text: yup.boolean().default(false),
});
type schemaType = yup.InferType<typeof schema>;
interface Props {
  id: number;
  type: "Unit" | "Room";
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void; // handler from parent
}
const CreateNewTenancy = ({ id, onOpenChange, open, type }: Props) => {
  const form = useForm<schemaType>({
    mode: "onTouched",
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
  const { mutate, isPending } = useCreateTenancy();
  console.log(errors);
  const [tenantData, setTenantData] = useState([]);
  const { data: tenants } = useGetTenantsList();
  useEffect(() => {
    if (tenants) {
      const dataT = tenants.map((t) => {
        return { id: `${t.id}`, name: t.name };
      });
      setTenantData(dataT as never);
    }
  }, [tenants]);
  useEffect(() => {
    if (type === "Room") {
      setValue("property_id", `room-${id}`);
    } else {
      setValue("property_id", `unit-${id}`);
    }
  }, [id]);
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
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    // Map facilities

    // Compose payload for AddPropertyInput
    console.log(data.property_id);
    const payload = {
      tenant_id: data.tenant,
      date_of_agreement: data.date_of_agreement,
      rental_fee: data.rental_fee,
      tenancy_period_start_date: data.tenancy_period_start_date,
      tenancy_period_end_date: data.tenancy_period_end_date,
      rental_payment_frequency: data.rental_payment_frequency,
      remarks: data.remarks,
      ...parseValue(data.property_id),
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Tenancy created successfully!");
        reset();
        onOpenChange(false);
      },
    });
  };
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  function mapToTreeData(
    properties: PropertySelection[],
    id?: number
  ): TreeNode[] {
    return properties
      .filter((property) => (id ? property.id === id : true))
      .flatMap((property) =>
        property.units.map((unit) => ({
          value: `unit-${unit.id}`,
          label: unit.block_floor_unit_number,
          children: unit.rooms.map((room) => ({
            value: `room-${room.id}`,
            label: room.name,
          })),
        }))
      );
  }
  const { data } = useGetSelection();
  useEffect(() => {
    if (data) {
      setTreeData(mapToTreeData(data));
    }
  }, [data]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Add Tenancy
        </Button>
      </DialogTrigger> */}

      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="md:max-w-[1000px]  z-400 bg-white md:p-10 max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Tenancy
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="md:min-h-[78vh]">
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
              </div>
              <TenantSelect<schemaType>
                name="tenant"
                title="Tenant"
                options={tenantData}
              />

              <CustomInput
                id="date_of_agreement"
                name="date_of_agreement"
                type="date"
                label="Date of Agreement"
                value={watch("date_of_agreement")}
                onChange={(e) => setValue("date_of_agreement", e.target.value)}
                errors={errors.date_of_agreement?.message}
                placeholder="Enter Date of Agreement"
              />
              <CustomInput
                id="rental_fee"
                name="rental_fee"
                type="number"
                label="Rental Fee"
                value={watch("rental_fee")}
                onChange={(e) => setValue("rental_fee", e.target.value)}
                errors={errors.rental_fee?.message}
                placeholder="Enter Rental Fee"
              />
              <CustomInput
                id="tenancy_period_start_date"
                name="tenancy_period_start_date"
                type="date"
                label="Tenancy Period (Start Date)"
                value={watch("tenancy_period_start_date")}
                onChange={(e) =>
                  setValue("tenancy_period_start_date", e.target.value)
                }
                errors={errors.tenancy_period_start_date?.message}
                placeholder="Enter Tenancy Period (Start Date)"
              />
              <CustomInput
                id="tenancy_period_end_date"
                name="tenancy_period_end_date"
                type="date"
                label="Tenancy Period (End Date)"
                value={watch("tenancy_period_end_date")}
                onChange={(e) =>
                  setValue("tenancy_period_end_date", e.target.value)
                }
                errors={errors.tenancy_period_end_date?.message}
                placeholder="Enter Tenancy Period (End Date)"
              />
              <div>
                <Label className="mb-3">Rental Payment Frequency</Label>
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={watch("rental_payment_frequency")}
                  onValueChange={(val) =>
                    setValue("rental_payment_frequency", val)
                  }
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
                {errors.rental_payment_frequency && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.rental_payment_frequency.message}
                  </p>
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
                  className="bg-gray-100"
                  errors={errors.remarks?.message}
                />
              </div>
            </div>
            {/* Toast notifications are handled by 'sonner', so no need for local success/error display here */}
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
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

export default CreateNewTenancy;
