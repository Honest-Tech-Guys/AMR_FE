"use client";

import { useEffect } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import HeaderSection from "@/components/HeaderSection";
import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import PhoneInput from "@/components/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import OwnerType from "@/types/OwnerType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUpdateOwner from "@/lib/services/hooks/useUpdateOwners";

// ✅ Schema
const schema = yup.object({
  type: yup.string().required("Type is required"),
  name: yup.string().required("Name is required"),
  bank_id: yup.string().required("Bank is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  alt_phone_number: yup.string().required("Alt phone number is required"),
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
  emergency_phone: yup.string().required("Emergency phone is required"),
  emergency_email: yup
    .string()
    .email("Invalid email")
    .required("Emergency email is required"),
  account_holder_name: yup.string().required("Account holder name is required"),
  account_number: yup.string().required("Account number is required"),
  remarks: yup.string().required("Remarks is required"),
});
type SchemaType = yup.InferType<typeof schema>;

const COUNTRIES = [
  { id: "us", name: "United States" },
  { id: "uk", name: "United Kingdom" },
  { id: "ca", name: "Canada" },
  { id: "au", name: "Australia" },
];
const BankType = [
  { id: "1", name: "Maybank" },
  { id: "2", name: "CIMB" },
  { id: "3", name: "Public Bank" },
  { id: "4", name: "Hong Leong Bank" },
];
interface OwnerTenantProps {
  ownerData: OwnerType; // pass tenant data here
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}
export default function EditOwnerPage({
  ownerData,
  isOpen,
  setIsOpen,
}: OwnerTenantProps) {
  const router = useRouter();

  const form = useForm<SchemaType>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });
  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = form;

  const { mutate: updateOwner, isPending } = useUpdateOwner();
  useEffect(() => {
    if (ownerData) {
      const profile = ownerData.owner_profile;
      console.log(ownerData);
      reset({
        type: profile?.type ?? "",
        name: ownerData.name ?? "",
        email: ownerData.email ?? "",
        bank_id: "", // or map from another field if exists
        phone_number: "", // if stored elsewhere
        alt_phone_number: profile?.alt_phone_number ?? "",
        nationality: profile?.nationality ?? "",
        identity_type: "NRIC", // not in API, set default or derive if possible
        identity_number: profile?.nric_number ?? "",
        race: profile?.race ?? "",
        gender: profile?.gender ?? "",
        address_line_1: profile?.address_line_1 ?? "",
        city: profile?.city ?? "",
        postcode: profile?.postcode ?? "",
        state: profile?.state ?? "",
        country: profile?.country ?? "",
        emergency_name: profile?.emergency_contact_name ?? "",
        emergency_relationship: profile?.emergency_contact_relationship ?? "",
        emergency_phone: profile?.emergency_contact_phone ?? "",
        emergency_email: profile?.emergency_contact_email ?? "",
        account_holder_name: "", // not in API, adjust if exists
        account_number: "", // not in API, adjust if exists
        remarks: profile?.remarks ?? "",
      });
    }
  }, [ownerData, reset]);

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    updateOwner(
      { id: ownerData.id, ...data },
      {
        onSuccess: () => {
          toast.success("Owner updated successfully!");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to update owner.");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white">
            View Owner
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Entry Information */}
            <HeaderSection title="Entry Information" />
            <div>
              <Label className="mb-5">Type</Label>
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

            {/* Tenant Details */}
            <HeaderSection title="Tenants Detail" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="name"
                name="name"
                type="text"
                label="Name"
                value={watch("name")}
                onChange={(e) => setValue("name", e.target.value)}
                errors={errors.name?.message}
              />
              <CustomInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={watch("email")}
                onChange={(e) => setValue("email", e.target.value)}
                errors={errors.email?.message}
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
                  <PhoneInput {...field} placeholder="Alt Phone Number" />
                )}
              />
            </div>

            {/* Address */}
            <HeaderSection title="Emergency Address Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="address_line_1"
                name="address_line_1"
                type="text"
                label="Address"
                value={watch("address_line_1")}
                onChange={(e) => setValue("address_line_1", e.target.value)}
                errors={errors.address_line_1?.message}
              />
              <SelectWithForm<SchemaType>
                name="country"
                title="Country"
                options={COUNTRIES}
              />
              <SelectWithForm<SchemaType>
                name="state"
                title="State"
                options={COUNTRIES}
              />
              <SelectWithForm<SchemaType>
                name="city"
                title="City"
                options={COUNTRIES}
              />
            </div>

            {/* Bank Information */}
            <HeaderSection title="Bank Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectWithForm<SchemaType>
                name="bank_id"
                title="Bank"
                options={BankType}
              />
              <CustomInput
                id="account_holder_name"
                name="account_holder_name"
                type="text"
                label="Account Holder Name"
                value={watch("account_holder_name")}
                onChange={(e) =>
                  setValue("account_holder_name", e.target.value)
                }
                errors={errors.account_holder_name?.message}
              />
              <CustomInput
                id="account_number"
                name="account_number"
                type="text"
                label="Account Number"
                value={watch("account_number")}
                onChange={(e) => setValue("account_number", e.target.value)}
                errors={errors.account_number?.message}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/owners")}
              >
                Cancel
              </Button>
              <Button type="submit" className="text-white" disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
