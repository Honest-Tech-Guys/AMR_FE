"use client";

import { useState } from "react";
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
  FormProvider,
  useForm,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import PhoneInput from "@/components/phone-input";
import { toast } from "sonner";
import useCreateBeneficiary from "@/lib/services/hooks/useCreateBeneficiary";
import ErrorToastHandel from "@/components/ErrorToastHandel";
import { useQueryClient } from "@tanstack/react-query";
import { COUNTRIES, NATIONALITIES } from "@/lib/utilities/Countries";
// <-- your API hook
const cities = [
  { id: "johor", name: "Johor" },
  { id: "kedah", name: "Kedah" },
  { id: "kelantan", name: "Kelantan" },
  { id: "malacca", name: "Malacca" },
  { id: "negeriSembilan", name: "Negeri Sembilan" },
  { id: "pahang", name: "Pahang" },
  { id: "perak", name: "Perak" },
  { id: "perlis", name: "Perlis" },
  { id: "penang", name: "Penang" },
  { id: "selangor", name: "Selangor" },
  { id: "terengganu", name: "Terengganu" },
  { id: "sabah", name: "Sabah" },
  { id: "sarawak", name: "Sarawak" },
  { id: "kualaLumpur", name: "Kuala Lumpur" },
  { id: "putrajaya", name: "Putrajaya" },
];
// ✅ Validation schema
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
type schemaType = yup.InferType<typeof schema>;

const BankType = [
  { id: "1", name: "Maybank" },
  { id: "2", name: "CIMB" },
  { id: "3", name: "Public Bank" },
  { id: "4", name: "Hong Leong Bank" },
];
const CreateNewBeneficiary = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<schemaType>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = form;

  const { mutate, isPending } = useCreateBeneficiary();
  const queryClient = useQueryClient();
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    mutate(data as never, {
      onSuccess: () => {
        toast.success("Beneficiary created successfully!");
        queryClient.invalidateQueries({
          queryKey: ["useGetBeneficiariesList"],
        });
        reset();
        setIsOpen(false);
      },
      onError: (err: any) => {
        ErrorToastHandel(err);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white">
          Create New Beneficiary
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[900px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-2xl font-bold">Create New Beneficiary</div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Entry Information" />
            <div className="col-span-1 md:col-span-2">
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
            <HeaderSection title="Beneficiary Detail" />
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
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Phone Number
                </label>
                <Controller
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      placeholder="Enter Beneficiary Number"
                    />
                  )}
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Alt Phone Number
                </label>
                <Controller
                  control={control}
                  name="alt_phone_number"
                  render={({ field }) => (
                    <PhoneInput {...field} placeholder="Enter Contact Number" />
                  )}
                />
                {errors.alt_phone_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.alt_phone_number.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-5">Identity Type</Label>
                <RadioGroup
                  value={watch("identity_type")}
                  onValueChange={(val) => setValue("identity_type", val)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NRIC" id="identity-nric" />
                    <Label htmlFor="identity-nric">NRIC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Passport" id="identity-passport" />
                    <Label htmlFor="identity-passport">Passport</Label>
                  </div>
                </RadioGroup>
                {errors.identity_type && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.identity_type.message}
                  </p>
                )}
              </div>
              <CustomInput
                id="identity_number"
                name="identity_number"
                type="text"
                label="Identity NO / Passport NO "
                value={watch("identity_number")}
                onChange={(e) => setValue("identity_number", e.target.value)}
                errors={errors.identity_number?.message}
                placeholder="Enter Identity Number"
              />{" "}
              <div>
                <Label className="mb-5">Race</Label>
                <RadioGroup
                  value={watch("race")}
                  onValueChange={(val) => setValue("race", val)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Malay" id="malay" />
                    <Label htmlFor="malay">Malay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Chinese" id="chinese" />
                    <Label htmlFor="chinese">Chinese</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Indian" id="indian" />
                    <Label htmlFor="indian">Indian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="International" id="international" />
                    <Label htmlFor="international">International</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                {errors.race && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.race.message}
                  </p>
                )}
              </div>{" "}
              <SelectWithForm<schemaType>
                name="nationality"
                title="Nationality"
                options={NATIONALITIES}
              />
              <div>
                <Label className="mb-5">Gender</Label>
                <RadioGroup
                  value={watch("gender")}
                  onValueChange={(val) => setValue("gender", val)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Prefer Not To Say"
                      id="Prefer Not To Say"
                    />
                    <Label htmlFor="Prefer Not To Say">Prefer Not To Say</Label>
                  </div>
                </RadioGroup>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
            <HeaderSection title="Emergency Address Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <SelectWithForm<schemaType>
                name="country"
                title="Country"
                options={COUNTRIES}
              />
              <CustomInput
                id="state"
                name="state"
                type="text"
                value={watch("state")}
                label="State"
                onChange={(e) => setValue("state", e.target.value)}
                errors={errors.state?.message}
                placeholder="Enter state"
              />
              <CustomInput
                id="city"
                name="city"
                type="text"
                value={watch("city")}
                label="City"
                onChange={(e) => setValue("city", e.target.value)}
                errors={errors.city?.message}
                placeholder="Enter city"
              />{" "}
              <CustomInput
                id="address_line_1"
                name="address_line_1"
                type="text"
                value={watch("address_line_1")}
                label="Address"
                onChange={(e) => setValue("address_line_1", e.target.value)}
                errors={errors.address_line_1?.message}
                placeholder="Enter Address"
              />
              <CustomInput
                id="postcode"
                name="postcode"
                type="text"
                value={watch("postcode")}
                label="Postcode"
                onChange={(e) => setValue("postcode", e.target.value)}
                errors={errors.postcode?.message}
                placeholder="Enter Postcode"
              />
            </div>
            <HeaderSection title="Emergency Contact Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="emergency_name"
                name="emergency_name"
                type="text"
                label="Name"
                value={watch("emergency_name")}
                onChange={(e) => setValue("emergency_name", e.target.value)}
                errors={errors.emergency_name?.message}
                placeholder="Enter Name"
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
                placeholder="Enter Relationship"
              />
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Phone Number
                </label>
                <Controller
                  control={control}
                  name="emergency_phone"
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      placeholder="Enter Beneficiary Number"
                    />
                  )}
                />
                {errors.emergency_phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.emergency_phone.message}
                  </p>
                )}
              </div>
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
            <HeaderSection title="Bank Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectWithForm<schemaType>
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
                placeholder="Enter Account Holder Name"
              />

              <div className="col-span-1 md:col-span-2">
                <CustomInput
                  id="account_number"
                  name="account_number"
                  type="text"
                  label="Account Number"
                  value={watch("account_number")}
                  onChange={(e) => setValue("account_number", e.target.value)}
                  errors={errors.account_number?.message}
                  placeholder="Enter Account Number"
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

export default CreateNewBeneficiary;
