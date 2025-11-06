"use client";

import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import MultiFileUpload from "@/components/input-11";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FileData } from "@/types/FileData";
import useCreateAgreement from "@/lib/services/hooks/useCreateAgreement";
import useGetTenancyList from "@/lib/services/hooks/useGetTenancyList";
import { Tenancy } from "@/types/TenancyType";
export interface RentalAgreement {
  agreement_date: string;
  landlord_name: string;
  landlord_phone: string;
  landlord_email: string;
  landlord_identity_number: string;
  landlord_address: string;
  tenant_name: string;
  tenant_phone: string;
  tenant_email: string;
  tenant_identity_number: string;
  tenant_address: string;
  start_date: string; // e.g., "2025-10-01"
  end_date: string; // e.g., "2026-09-30"
  rental_amount: string; // stored as string, can be number if parsed
  payment_due_day: string; // could be number if parsed
  payment_bank_name: string;
  payment_bank_holder_name: string;
  payment_bank_account_number: string;
  security_deposit: string;
  key_deposit: string;
  advanced_rental_amount: string;
  house_rules_remarks: string;
  terms_conditions_remarks: string;
  attachments: FileList;
}

// Schema & type
export const schema = yup.object({
  agreement_date: yup.string().required("Agreement Date is required"),
  landlord_name: yup.string().required("Landlord Name is required"),
  landlord_phone: yup.string().required("Landlord Phone is required"),
  landlord_email: yup
    .string()
    .email("Invalid email")
    .required("Landlord Email is required"),
  landlord_identity_number: yup
    .string()
    .required("Landlord Identity Number is required"),
  landlord_address: yup.string().required("Landlord Address is required"),
  tenant_name: yup.string().required("Tenant Name is required"),
  tenant_phone: yup.string().required("Tenant Phone is required"),
  tenant_email: yup
    .string()
    .email("Invalid email")
    .required("Tenant Email is required"),
  tenant_identity_number: yup
    .string()
    .required("Tenant Identity Number is required"),
  tenant_address: yup.string().required("Tenant Address is required"),
  start_date: yup.string().required("Start Date is required"),
  end_date: yup.string().required("End Date is required"),
  rental_amount: yup.string().required("Rental Amount is required"),
  payment_due_day: yup.string().required("Payment Due Day is required"),
  payment_bank_name: yup.string().required("Payment Bank Name is required"),
  payment_bank_holder_name: yup
    .string()
    .required("Payment Bank Holder Name is required"),
  payment_bank_account_number: yup
    .string()
    .required("Payment Bank Account Number is required"),
  security_deposit: yup.string().required("Security Deposit is required"),
  key_deposit: yup.string().required("Key Deposit is required"),
  advanced_rental_amount: yup
    .string()
    .required("Advanced Rental Amount is required"),
  house_rules_remarks: yup.string().optional(),
  terms_conditions_remarks: yup.string().optional(),
  attachments: yup
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

// Convert base64 back to a File
function base64ToFile(fileData: FileData): File {
  const arr = fileData.base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || fileData.type;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileData.name, { type: mime });
}

// Convert FileData[] → FileList
export function fileDataToFileList(fileDataList: FileData[]): FileList {
  const dataTransfer = new DataTransfer();
  fileDataList.forEach((fd) => {
    dataTransfer.items.add(base64ToFile(fd));
  });
  return dataTransfer.files;
}

type schemaType = yup.InferType<typeof schema>;

interface Props {
  tenancy: Tenancy;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void; // handler from parent
}
const CreateAgreement = ({ tenancy, open, onOpenChange }: Props) => {
  const form = useForm<schemaType>({
    mode: "onTouched",
    defaultValues: {
      agreement_date: "",
      landlord_name: "",
      landlord_phone: "",
      landlord_email: "",
      landlord_identity_number: "",
      landlord_address: "",
      tenant_name: "",
      tenant_phone: "",
      tenant_email: "",
      tenant_identity_number: "",
      tenant_address: "",
      start_date: "",
      end_date: "",
      rental_amount: "",
      payment_due_day: "",
      payment_bank_name: "",
      payment_bank_holder_name: "",
      payment_bank_account_number: "",
      security_deposit: "",
      key_deposit: "",
      advanced_rental_amount: "",
      house_rules_remarks: "",
      terms_conditions_remarks: "",
      attachments: [],
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

  const { mutate, isPending } = useCreateAgreement(tenancy.id);
  const { refetch } = useGetTenancyList();
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log(data.attachments);
    const payload: RentalAgreement = {
      agreement_date: data.agreement_date,
      landlord_name: data.landlord_name,
      landlord_phone: data.landlord_phone,
      landlord_email: data.landlord_email,
      landlord_identity_number: data.landlord_identity_number,
      landlord_address: data.landlord_address,
      tenant_name: data.tenant_name,
      tenant_phone: data.tenant_phone,
      tenant_email: data.tenant_email,
      tenant_identity_number: data.tenant_identity_number,
      tenant_address: data.tenant_address,
      start_date: data.start_date,
      end_date: data.end_date,
      rental_amount: data.rental_amount,
      payment_due_day: data.payment_due_day,
      payment_bank_name: data.payment_bank_name,
      payment_bank_holder_name: data.payment_bank_holder_name,
      payment_bank_account_number: data.payment_bank_account_number,
      security_deposit: data.security_deposit,
      key_deposit: data.key_deposit,
      advanced_rental_amount: data.advanced_rental_amount,
      house_rules_remarks: data.house_rules_remarks || "",
      terms_conditions_remarks: data.terms_conditions_remarks || "",
      //   attachments: (data.attachments || []) as FileData[],
      attachments: fileDataToFileList((data.attachments || []) as FileData[]),
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Rental agreement created successfully!");
        reset();
        refetch();
        onOpenChange(false);
      },
    });
  };
  useEffect(() => {
    if (tenancy) {
      reset({
        agreement_date: tenancy.created_at.split("T")[0],
        start_date: tenancy.tenancy_period_start_date,
        end_date: tenancy.tenancy_period_end_date,
        rental_amount: tenancy.rental_fee,
        landlord_name:
          "unit" in tenancy.tenantable
            ? tenancy.tenantable.unit.property.owner?.name
            : tenancy.tenantable.property.owner?.name,
        landlord_email:
          "unit" in tenancy.tenantable
            ? tenancy.tenantable.unit.property.owner?.email
            : tenancy.tenantable.property.owner?.email,
        landlord_phone:
          "unit" in tenancy.tenantable
            ? tenancy.tenantable.unit.property.owner?.owner_profile
                .emergency_contact_phone
            : tenancy.tenantable.property.owner?.owner_profile
                .emergency_contact_phone,

        landlord_address:
          "unit" in tenancy.tenantable
            ? tenancy.tenantable.unit.property.owner?.owner_profile
                .address_line_1
            : tenancy.tenantable.property.owner?.owner_profile.address_line_1,
        landlord_identity_number:
          "unit" in tenancy.tenantable
            ? tenancy.tenantable.unit.property.owner?.owner_profile.nric_number
            : tenancy.tenantable.property.owner?.owner_profile.nric_number,
        tenant_name: tenancy.tenant.name,
        tenant_email: tenancy.tenant.email,
        tenant_phone: tenancy.tenant.tenant_profile
          ?.emergency_contact_phone as string,
        tenant_address: tenancy.tenant.tenant_profile?.address_line_1,
        tenant_identity_number: tenancy.tenant.tenant_profile?.nric_number,
      });
    }
  }, [tenancy, reset]);
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button className="text-white">
            <Plus />
            New Agreement
          </Button>
        </DialogTrigger>
        <DialogContent
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="md:max-w-[1000px] z-200 bg-white md:p-10 max-h-[95vh] overflow-y-auto"
        >
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <HeaderSection title="Agreement Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  id="agreement_date"
                  name="agreement_date"
                  type="date"
                  label="Agreement Date"
                  value={watch("agreement_date")}
                  onChange={(e) => setValue("agreement_date", e.target.value)}
                  errors={errors.agreement_date?.message}
                  placeholder="Select Agreement Date"
                  disabled={true}
                />
                <CustomInput
                  id="start_date"
                  name="start_date"
                  type="date"
                  label="Start Date"
                  value={watch("start_date")}
                  onChange={(e) => setValue("start_date", e.target.value)}
                  errors={errors.start_date?.message}
                  placeholder="Select Start Date"
                  disabled={true}
                />
                <CustomInput
                  id="end_date"
                  name="end_date"
                  type="date"
                  label="End Date"
                  value={watch("end_date")}
                  onChange={(e) => setValue("end_date", e.target.value)}
                  errors={errors.end_date?.message}
                  placeholder="Select End Date"
                  disabled={true}
                />
                <CustomInput
                  id="rental_amount"
                  name="rental_amount"
                  type="number"
                  label="Rental Amount"
                  value={watch("rental_amount")}
                  onChange={(e) => setValue("rental_amount", e.target.value)}
                  errors={errors.rental_amount?.message}
                  placeholder="Enter Rental Amount"
                  disabled={true}
                />
                <CustomInput
                  id="payment_due_day"
                  name="payment_due_day"
                  type="text"
                  label="Payment Due Day"
                  value={watch("payment_due_day")}
                  onChange={(e) => setValue("payment_due_day", e.target.value)}
                  errors={errors.payment_due_day?.message}
                  placeholder="Enter Payment Due Day"
                />
                <CustomInput
                  id="security_deposit"
                  name="security_deposit"
                  type="text"
                  label="Security Deposit"
                  value={watch("security_deposit")}
                  onChange={(e) => setValue("security_deposit", e.target.value)}
                  errors={errors.security_deposit?.message}
                  placeholder="Enter Security Deposit"
                />
                <CustomInput
                  id="key_deposit"
                  name="key_deposit"
                  type="text"
                  label="Key Deposit"
                  value={watch("key_deposit")}
                  onChange={(e) => setValue("key_deposit", e.target.value)}
                  errors={errors.key_deposit?.message}
                  placeholder="Enter Key Deposit"
                />
                <CustomInput
                  id="advanced_rental_amount"
                  name="advanced_rental_amount"
                  type="text"
                  label="Advanced Rental Amount"
                  value={watch("advanced_rental_amount")}
                  onChange={(e) =>
                    setValue("advanced_rental_amount", e.target.value)
                  }
                  errors={errors.advanced_rental_amount?.message}
                  placeholder="Enter Advanced Rental Amount"
                />
              </div>

              <HeaderSection title="Landlord Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  id="landlord_name"
                  name="landlord_name"
                  type="text"
                  label="Landlord Name"
                  value={watch("landlord_name")}
                  onChange={(e) => setValue("landlord_name", e.target.value)}
                  errors={errors.landlord_name?.message}
                  placeholder="Enter Landlord Name"
                  disabled={true}
                />
                <CustomInput
                  id="landlord_email"
                  name="landlord_email"
                  type="email"
                  label="Landlord Email"
                  value={watch("landlord_email")}
                  onChange={(e) => setValue("landlord_email", e.target.value)}
                  errors={errors.landlord_email?.message}
                  placeholder="Enter Landlord Email"
                  disabled={true}
                />
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Landlord Phone
                  </label>
                  <Controller
                    control={control}
                    name="landlord_phone"
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        placeholder="Enter Landlord Phone"
                        disabled={true}
                      />
                    )}
                  />
                  {errors.landlord_phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.landlord_phone.message}
                    </p>
                  )}
                </div>
                <CustomInput
                  id="landlord_identity_number"
                  name="landlord_identity_number"
                  type="text"
                  label="Landlord Identity Number"
                  value={watch("landlord_identity_number")}
                  onChange={(e) =>
                    setValue("landlord_identity_number", e.target.value)
                  }
                  errors={errors.landlord_identity_number?.message}
                  placeholder="Enter Landlord Identity Number"
                  disabled={true}
                />
                <div className="col-span-2">
                  <CustomInput
                    id="landlord_address"
                    name="landlord_address"
                    type="text"
                    label="Landlord Address"
                    value={watch("landlord_address")}
                    onChange={(e) =>
                      setValue("landlord_address", e.target.value)
                    }
                    errors={errors.landlord_address?.message}
                    placeholder="Enter Landlord Address"
                    disabled={true}
                  />
                </div>
              </div>

              <HeaderSection title="Tenant Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  id="tenant_name"
                  name="tenant_name"
                  type="text"
                  label="Tenant Name"
                  value={watch("tenant_name")}
                  onChange={(e) => setValue("tenant_name", e.target.value)}
                  errors={errors.tenant_name?.message}
                  placeholder="Enter Tenant Name"
                  disabled={true}
                />
                <CustomInput
                  id="tenant_email"
                  name="tenant_email"
                  type="email"
                  label="Tenant Email"
                  value={watch("tenant_email")}
                  onChange={(e) => setValue("tenant_email", e.target.value)}
                  errors={errors.tenant_email?.message}
                  placeholder="Enter Tenant Email"
                  disabled={true}
                />
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Tenant Phone
                  </label>
                  <Controller
                    control={control}
                    name="tenant_phone"
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        placeholder="Enter Tenant Phone"
                        disabled={true}
                      />
                    )}
                  />
                  {errors.tenant_phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.tenant_phone.message}
                    </p>
                  )}
                </div>
                <CustomInput
                  id="tenant_identity_number"
                  name="tenant_identity_number"
                  type="text"
                  label="Tenant Identity Number"
                  value={watch("tenant_identity_number")}
                  onChange={(e) =>
                    setValue("tenant_identity_number", e.target.value)
                  }
                  errors={errors.tenant_identity_number?.message}
                  placeholder="Enter Tenant Identity Number"
                  disabled={true}
                />
                <div className="col-span-2">
                  <CustomInput
                    id="tenant_address"
                    name="tenant_address"
                    type="text"
                    label="Tenant Address"
                    value={watch("tenant_address")}
                    onChange={(e) => setValue("tenant_address", e.target.value)}
                    errors={errors.tenant_address?.message}
                    placeholder="Enter Tenant Address"
                    disabled={true}
                  />
                </div>
              </div>

              <HeaderSection title="Payment Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  id="payment_bank_name"
                  name="payment_bank_name"
                  type="text"
                  label="Bank Name"
                  value={watch("payment_bank_name")}
                  onChange={(e) =>
                    setValue("payment_bank_name", e.target.value)
                  }
                  errors={errors.payment_bank_name?.message}
                  placeholder="Enter Bank Name"
                />
                <CustomInput
                  id="payment_bank_holder_name"
                  name="payment_bank_holder_name"
                  type="text"
                  label="Bank Holder Name"
                  value={watch("payment_bank_holder_name")}
                  onChange={(e) =>
                    setValue("payment_bank_holder_name", e.target.value)
                  }
                  errors={errors.payment_bank_holder_name?.message}
                  placeholder="Enter Bank Holder Name"
                />
                <div className="col-span-2">
                  <CustomInput
                    id="payment_bank_account_number"
                    name="payment_bank_account_number"
                    type="text"
                    label="Bank Account Number"
                    value={watch("payment_bank_account_number")}
                    onChange={(e) =>
                      setValue("payment_bank_account_number", e.target.value)
                    }
                    errors={errors.payment_bank_account_number?.message}
                    placeholder="Enter Bank Account Number"
                  />
                </div>
              </div>

              <HeaderSection title="Additional Information" />
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="mb-2">House Rules & Remarks</Label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={watch("house_rules_remarks")}
                    onChange={(e) =>
                      setValue("house_rules_remarks", e.target.value)
                    }
                    placeholder="Enter house rules and remarks"
                  />
                  {errors.house_rules_remarks && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.house_rules_remarks.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-2">Terms & Conditions Remarks</Label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={watch("terms_conditions_remarks")}
                    onChange={(e) =>
                      setValue("terms_conditions_remarks", e.target.value)
                    }
                    placeholder="Enter terms and conditions remarks"
                  />
                  {errors.terms_conditions_remarks && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.terms_conditions_remarks.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-2">Attachments</Label>
                  <Controller
                    control={control}
                    name="attachments"
                    render={({ field: { onChange, value } }) => (
                      <MultiFileUpload
                        isMulti={true}
                        field="attachments"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  {errors.attachments && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.attachments.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-white"
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateAgreement;
