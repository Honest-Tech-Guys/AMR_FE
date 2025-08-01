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
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useCreateTenancy from "@/lib/services/hooks/useCreateTenancy";
import { toast } from "sonner";
import { useState } from "react";

// Schema & type
const schema = yup.object({
  property_name: yup.string().required("Property name is required"),
  tenant_type: yup.string().required("Tenant is required"),
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
});
type schemaType = yup.InferType<typeof schema>;
const CreateTenancy = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  const COUNTRIES = [
    { id: "us", name: "United States" },
    { id: "uk", name: "United Kingdom" },
    { id: "ca", name: "Canada" },
    { id: "au", name: "Australia" },
    { id: "fr", name: "France" },
    { id: "de", name: "Germany" },
    { id: "jp", name: "Japan" },
    { id: "br", name: "Brazil" },
  ];
  const PartnerType = [
    { id: "1", name: "Apartment" },
    { id: "2", name: "Condominium" },
    { id: "3", name: "Flat " },
    { id: "4", name: "Landed" },
    { id: "5", name: "Townhouse" },
  ];
  const { mutate, isPending } = useCreateTenancy();
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    const tenancyData = {
      ...data,
      remarks: data.remarks || null,
    };

    mutate(tenancyData, {
      onSuccess: () => {
        toast.success("Tenancy created successfully!");
        reset();
        setIsOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to create tenancy.");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Add Tenancy
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Tenancy
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="property_name"
                name="property_name"
                type="text"
                label="Property Name"
                value={watch("property_name")}
                onChange={(e) => setValue("property_name", e.target.value)}
                errors={errors.property_name?.message}
                placeholder="Enter Property Name"
              />
              <CustomInput
                id="tenant_type"
                name="tenant_type"
                type="text"
                label="Tenant"
                value={watch("tenant_type")}
                onChange={(e) => setValue("tenant_type", e.target.value)}
                errors={errors.tenant_type?.message}
                placeholder="Enter Tenant"
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
                  <ToggleGroupItem value="monthly" aria-label="Monthly">
                    Monthly
                  </ToggleGroupItem>
                  <ToggleGroupItem value="daily" aria-label="Daily">
                    Daily
                  </ToggleGroupItem>
                  <ToggleGroupItem value="one_time" aria-label="One Time">
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

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="text-white" disabled={isPending}>
                {isPending ? "Creating..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTenancy;
