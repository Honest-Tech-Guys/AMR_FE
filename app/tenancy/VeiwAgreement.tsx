"use client";

import CustomInput from "@/components/CustomInput";
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
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useEffect } from "react";
import { FileData } from "@/types/FileData";
// <-- update hook
import { fileDataToFileList, schema } from "./CreateAgreement"; // reuse schema & helper
import useUpdateAgreement from "@/lib/services/hooks/useUpdateAgreement";
import { AgreementType } from "@/types/AgreementType";

type schemaType = yup.InferType<typeof schema>;

interface Props {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: AgreementType; // existing agreement data to prefill
}

const EditAgreement = ({ id, open, onOpenChange, initialData }: Props) => {
  const form = useForm<schemaType>({
    mode: "onTouched",
    // resolver: yupResolver(schema),
    defaultValues: {
      agreement_date: initialData.agreement_date || "",
      landlord_name: initialData.landlord_name || "",
      landlord_phone: initialData.landlord_phone || "",
      landlord_email: initialData.landlord_email || "",
      landlord_identity_number: initialData.landlord_identity_number || "",
      landlord_address: initialData.landlord_address || "",
      tenant_name: initialData.tenant_name || "",
      tenant_phone: initialData.tenant_phone || "",
      tenant_email: initialData.tenant_email || "",
      tenant_identity_number: initialData.tenant_identity_number || "",
      tenant_address: initialData.tenant_address || "",
      start_date: initialData.start_date || "",
      end_date: initialData.end_date || "",
      rental_amount: initialData.rental_amount || "",
      payment_due_day: initialData.payment_due_day || "",
      payment_bank_name: initialData.payment_bank_name || "",
      payment_bank_holder_name: initialData.payment_bank_holder_name || "",
      payment_bank_account_number:
        initialData.payment_bank_account_number || "",
      security_deposit: initialData.security_deposit || "",
      key_deposit: initialData.key_deposit || "",
      advanced_rental_amount: initialData.advanced_rental_amount || "",
      house_rules_remarks: initialData.house_rules_remarks || "",
      terms_conditions_remarks: initialData.terms_conditions_remarks || "",
      attachments: initialData.attachments || [],
    },
  });

  const {
    setValue,
    watch,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  // Reset when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        agreement_date: initialData.agreement_date || "",
        landlord_name: initialData.landlord_name || "",
        landlord_phone: initialData.landlord_phone || "",
        landlord_email: initialData.landlord_email || "",
        landlord_identity_number: initialData.landlord_identity_number || "",
        landlord_address: initialData.landlord_address || "",
        tenant_name: initialData.tenant_name || "",
        tenant_phone: initialData.tenant_phone || "",
        tenant_email: initialData.tenant_email || "",
        tenant_identity_number: initialData.tenant_identity_number || "",
        tenant_address: initialData.tenant_address || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        rental_amount: initialData.rental_amount || "",
        payment_due_day: initialData.payment_due_day || "",
        payment_bank_name: initialData.payment_bank_name || "",
        payment_bank_holder_name: initialData.payment_bank_holder_name || "",
        payment_bank_account_number:
          initialData.payment_bank_account_number || "",
        security_deposit: initialData.security_deposit || "",
        key_deposit: initialData.key_deposit || "",
        advanced_rental_amount: initialData.advanced_rental_amount || "",
        house_rules_remarks: initialData.house_rules_remarks || "",
        terms_conditions_remarks: initialData.terms_conditions_remarks || "",
        attachments: initialData.attachments || [],
      });
    }
  }, [initialData, reset]);

  const { mutate, isPending } = useUpdateAgreement(id, initialData.id);

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    const payload = {
      ...data,
      attachments: fileDataToFileList((data.attachments || []) as FileData[]),
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Agreement updated successfully!");
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error((err as any)?.message || "Failed to update agreement");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[1000px] z-200 bg-white md:p-10 h-[95vh] overflow-y-auto">
        <DialogHeader>
          <h2 className="text-2xl  font-bold">View Agreement</h2>
        </DialogHeader>
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
              />
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Landlord Phone
                </label>
                <Controller
                  control={control}
                  name="landlord_phone"
                  render={({ field }) => (
                    <PhoneInput {...field} placeholder="Enter Landlord Phone" />
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
              />
              <div className="col-span-2">
                <CustomInput
                  id="landlord_address"
                  name="landlord_address"
                  type="text"
                  label="Landlord Address"
                  value={watch("landlord_address")}
                  onChange={(e) => setValue("landlord_address", e.target.value)}
                  errors={errors.landlord_address?.message}
                  placeholder="Enter Landlord Address"
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
              />
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Tenant Phone
                </label>
                <Controller
                  control={control}
                  name="tenant_phone"
                  render={({ field }) => (
                    <PhoneInput {...field} placeholder="Enter Tenant Phone" />
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
                onChange={(e) => setValue("payment_bank_name", e.target.value)}
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
            </div>

            <HeaderSection title="Attachments" />
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

            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="text-white" disabled={isPending}>
                {isPending ? "Updating..." : "Update "}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgreement;
