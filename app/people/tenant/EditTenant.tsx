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
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import PhoneInput from "@/components/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import useUpdateTenant from "@/lib/services/hooks/useUpdateTenant";
import { TenantType } from "@/types/TenantType";

// ✅ Validation schema
const schema = yup.object({
  type: yup.string().required("Type is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  alt_phone_number: yup.string().required("Phone number is required"),
  nationality: yup.string().required("Nationality is required"),
  identity_type: yup.string().required("Identity type is required"),
  identity_number: yup.string().required("Identity number is required"),
  race: yup.string().required("Race is required"),
  gender: yup.string().required("Gender is required"),
  address_line_1: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postcode: yup.string().required("Postcode is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  emergency_name: yup.string().required("Emergency name is required"),
  emergency_relationship: yup
    .string()
    .required("Emergency relationship is required"),
  emergency_phone: yup.string().required("Phone number is required"),
  emergency_email: yup.string().email("Invalid email").nullable(),
  remarks: yup.string().nullable(),
});
type schemaType = yup.InferType<typeof schema>;

interface EditTenantProps {
  tenant: TenantType; // pass tenant data here
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}

const EditTenant = ({ tenant, isOpen, setIsOpen }: EditTenantProps) => {
  const form = useForm<schemaType>({
    // resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const { setValue, watch, control, handleSubmit, reset, formState } = form;
  const { errors } = formState;

  const { mutate, isPending } = useUpdateTenant();

  // 🟢 Set default values from tenant data when modal opens
  useEffect(() => {
    if (tenant) {
      reset({
        type: tenant?.tenant_profile?.type,
        name: tenant?.name,
        email: tenant?.email,
        phone_number: tenant?.tenant_profile?.alt_phone_number || "",
        alt_phone_number: tenant?.tenant_profile?.alt_phone_number || "",
        nationality: tenant?.tenant_profile?.nationality,
        identity_type: "NRIC",
        identity_number: tenant?.tenant_profile?.nric_number,
        race: tenant?.tenant_profile?.race,
        gender: tenant?.tenant_profile?.gender,
        address_line_1: tenant?.tenant_profile?.address_line_1,
        city: tenant?.tenant_profile?.city,
        postcode: tenant?.tenant_profile?.postcode,
        state: tenant?.tenant_profile?.state,
        country: tenant?.tenant_profile?.country,
        emergency_name: tenant?.tenant_profile?.emergency_contact_name,
        emergency_relationship:
          tenant?.tenant_profile?.emergency_contact_relationship,
        emergency_phone: tenant?.tenant_profile?.emergency_contact_phone || "",
        emergency_email: tenant?.tenant_profile?.emergency_contact_email || "",
        remarks: tenant?.tenant_profile?.remarks || "",
      });
    }
  }, [tenant, reset]);

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    mutate({ id: tenant.id, ...data } as never, {
      onSuccess: () => {
        toast.success("Tenant updated successfully!");
        setIsOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update tenant.");
      },
    });
  };

  const COUNTRIES = [
    { id: "Malaysia", name: "Malaysia" },
    { id: "Singapore", name: "Singapore" },
    { id: "Thailand", name: "Thailand" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Tenant</Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white">
            Edit Tenant
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Tenant Type" />
            <div className="col-span-1 md:col-span-2">
              <Label className="mb-2">Type</Label>
              <RadioGroup
                value={watch("type")}
                onValueChange={(val) => setValue("type", val)}
                className="flex items-center gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Individual" id="type-individual" />
                  <Label htmlFor="type-individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Company" id="type-company" />
                  <Label htmlFor="type-company">Company</Label>
                </div>
              </RadioGroup>
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <HeaderSection title="Tenant Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="name"
                name="name"
                type="text"
                label="Name"
                value={watch("name")}
                onChange={(e) => setValue("name", e.target.value)}
                errors={errors.name?.message}
                placeholder="Enter Name"
              />
              <CustomInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={watch("email")}
                onChange={(e) => setValue("email", e.target.value)}
                errors={errors.email?.message}
                placeholder="Enter Email"
              />
              <Controller
                control={control}
                name="phone_number"
                render={({ field }) => (
                  <PhoneInput {...field} placeholder="Phone Number" />
                )}
              />
              <Controller
                control={control}
                name="alt_phone_number"
                render={({ field }) => (
                  <PhoneInput {...field} placeholder="Alt Phone" />
                )}
              />
            </div>

            <HeaderSection title="Address & Emergency Info" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="address_line_1"
                name="address_line_1"
                type="text"
                label="Address"
                value={watch("address_line_1")}
                onChange={(e) => setValue("address_line_1", e.target.value)}
                errors={errors.address_line_1?.message}
                placeholder="Enter Address"
              />
              <CustomInput
                id="postcode"
                name="postcode"
                type="text"
                label="Postcode"
                value={watch("postcode")}
                onChange={(e) => setValue("postcode", e.target.value)}
                errors={errors.postcode?.message}
                placeholder="Enter Postcode"
              />
              <SelectWithForm<schemaType>
                name="country"
                title="Country"
                options={COUNTRIES}
              />
              <SelectWithForm<schemaType>
                name="state"
                title="State"
                options={COUNTRIES}
              />
            </div>

            <HeaderSection title="Emergency Contact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="emergency_name"
                name="emergency_name"
                type="text"
                label="Emergency Contact Name"
                value={watch("emergency_name")}
                onChange={(e) => setValue("emergency_name", e.target.value)}
                errors={errors.emergency_name?.message}
              />
              <CustomInput
                id="emergency_relationship"
                name="emergency_relationship"
                type="text"
                label="Relationship"
                value={watch("emergency_relationship")}
                onChange={(e) =>
                  setValue("emergency_relationship", e.target.value)
                }
                errors={errors.emergency_relationship?.message}
              />
              <Controller
                control={control}
                name="emergency_phone"
                render={({ field }) => (
                  <PhoneInput {...field} placeholder="Emergency Phone" />
                )}
              />
              <CustomInput
                id="emergency_email"
                name="emergency_email"
                type="email"
                label="Email"
                value={watch("emergency_email")}
                onChange={(e) => setValue("emergency_email", e.target.value)}
                errors={errors.emergency_email?.message}
                placeholder="Enter Email"
              />
              <CustomInput
                id="remarks"
                label="Remarks"
                type="textArea"
                name="remarks"
                value={watch("remarks")}
                onChange={(e) => setValue("remarks", e.target.value)}
                placeholder="E.g. Updated details or special notes"
                className="bg-gray-100 rounded-[6px]"
                errors={errors.remarks?.message}
              />
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
                {isPending ? "Updating..." : "Update Tenant"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditTenant;
