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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MultiFileUpload from "@/components/input-11";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useAddTenant from "@/lib/services/hooks/useAddTenant";
import { toast } from "sonner";
// Schema & type
const schema = yup.object({
  type: yup.string().required("Type is required"),
  name: yup.string().required("Name is required"),
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
  remarks: yup.string().required("Remarks is required"),
});
type schemaType = yup.InferType<typeof schema>;
const CreateNewTenant = () => {
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
  const facilities = [
    { id: "meeting_room", label: "Meeting Room" },
    { id: "game_room", label: "Game Room" },
    { id: "basketball_court", label: "Basketball Court" },
    { id: "sauna", label: "Sauna" },
    { id: "free_text", label: "Free Text" },
  ];
  const { mutate, isPending } = useAddTenant();
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Tenant created successfully!");
        reset();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to create tenant.");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Add Tenant
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Tenant
          </div>
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
            <HeaderSection title="Tenants Detail" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="name"
                name="name"
                type="text"
                label="name"
                value={watch("name")}
                onChange={(e) => setValue("name", e.target.value)}
                errors={errors.name?.message}
                placeholder="Enter Name"
              />
              <CustomInput
                id="email"
                name="email"
                type="email"
                label="email"
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
                    <PhoneInput {...field} placeholder="Enter Owner Number" />
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
              <CustomInput
                id="nationality"
                name="nationality"
                type="text"
                label="Nationality"
                value={watch("nationality")}
                onChange={(e) => setValue("nationality", e.target.value)}
                errors={errors.nationality?.message}
                placeholder="Enter Nationality"
              />
              <CustomInput
                id="identity_number"
                name="identity_number"
                type="text"
                label="Identity Number"
                value={watch("identity_number")}
                onChange={(e) => setValue("identity_number", e.target.value)}
                errors={errors.identity_number?.message}
                placeholder="Enter Identity Number"
              />
              <div>
                <Label className="mb-5">Gender</Label>
                <RadioGroup
                  value={watch("gender")}
                  onValueChange={(val) => setValue("gender", val)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="gender-male" />
                    <Label htmlFor="gender-male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="gender-female" />
                    <Label htmlFor="gender-female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="gender-other" />
                    <Label htmlFor="gender-other">Other</Label>
                  </div>
                </RadioGroup>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-5">Race</Label>
                <RadioGroup
                  value={watch("race")}
                  onValueChange={(val) => setValue("race", val)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Malay" id="race-malay" />
                    <Label htmlFor="race-malay">Malay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Chinese" id="race-chinese" />
                    <Label htmlFor="race-chinese">Chinese</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Indian" id="race-indian" />
                    <Label htmlFor="race-indian">Indian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Others" id="race-others" />
                    <Label htmlFor="race-others">Others</Label>
                  </div>
                </RadioGroup>
                {errors.race && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.race.message}
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
              </div>{" "}
            </div>
            <HeaderSection title="Emergency Address Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              <SelectWithForm<schemaType>
                name="country"
                title="Country"
                options={COUNTRIES}
              />
              <SelectWithForm<schemaType>
                name="city"
                title="City"
                options={COUNTRIES}
              />
              <SelectWithForm<schemaType>
                name="state"
                title="State"
                options={COUNTRIES}
              />
            </div>
            <HeaderSection title="Emergency Contact Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="emergency_name"
                name="emergency_name"
                type="text"
                label="name"
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
                    <PhoneInput {...field} placeholder="Enter Owner Number" />
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
                label="email"
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

export default CreateNewTenant;
