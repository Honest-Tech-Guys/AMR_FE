"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
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
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  beneficiary_profile: yup.object({
    type: yup.string().required("Type is required"),
    nationality: yup.string().required("Nationality is required"),
    nric_number: yup.string().required("NRIC Number is required"),
    race: yup.string().required("Race is required"),
    gender: yup.string().required("Gender is required"),
    address_line_1: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    postcode: yup.string().required("Postcode is required"),
    state: yup.string().required("State is required"),
    // country: yup.string().required("Country is required"),
    emergency_contact_name: yup.string().required("Emergency Name is required"),
    emergency_contact_relationship: yup
      .string()
      .required("Relationship is required"),
  }),
});

type SchemaType = yup.InferType<typeof schema>;

const COUNTRIES = [
  { id: "Malaysia", name: "Malaysia" },
  { id: "Singapore", name: "Singapore" },
  { id: "Thailand", name: "Thailand" },
];

const CreateNewBeneficiary = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SchemaType>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      beneficiary_profile: {
        type: "Individual",
      },
    },
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

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Beneficiary created successfully!");
        reset();
        setIsOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to create beneficiary.");
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
            {/* Basic Info */}
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <CustomInput
                id="name"
                name="name"
                type="text"
                label="Full Name"
                value={watch("name")}
                onChange={(e) => setValue("name", e.target.value)}
                errors={errors.name?.message}
                placeholder="Enter full name"
              />
              <CustomInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={watch("email")}
                onChange={(e) => setValue("email", e.target.value)}
                errors={errors.email?.message}
                placeholder="Enter email"
              />
            </div>

            {/* Beneficiary Profile */}
            <HeaderSection title="Beneficiary Profile" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="col-span-1 md:col-span-2">
                <Label>Type</Label>
                <RadioGroup
                  value={watch("beneficiary_profile.type")}
                  onValueChange={(val) =>
                    setValue("beneficiary_profile.type", val)
                  }
                  className="flex items-center gap-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Individual" id="individual" />
                    <Label htmlFor="individual">Individual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Organization" id="organization" />
                    <Label htmlFor="organization">Organization</Label>
                  </div>
                </RadioGroup>
              </div>
              <CustomInput
                type="text"
                id="nationality"
                name="beneficiary_profile.nationality"
                label="Nationality"
                value={watch("beneficiary_profile.nationality")}
                onChange={(e) =>
                  setValue("beneficiary_profile.nationality", e.target.value)
                }
                errors={errors.beneficiary_profile?.nationality?.message}
                placeholder="Enter nationality"
              />
              <CustomInput
                type="text"
                id="nric_number"
                name="beneficiary_profile.nric_number"
                label="NRIC Number"
                value={watch("beneficiary_profile.nric_number")}
                onChange={(e) =>
                  setValue("beneficiary_profile.nric_number", e.target.value)
                }
                errors={errors.beneficiary_profile?.nric_number?.message}
                placeholder="Enter NRIC"
              />
              <div>
                <Label className="mb-5">Gender</Label>
                <RadioGroup
                  value={watch("beneficiary_profile.gender")}
                  onValueChange={(val) =>
                    setValue("beneficiary_profile.gender", val)
                  }
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
                {errors?.beneficiary_profile?.gender && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.beneficiary_profile.gender.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-5">Race</Label>
                <RadioGroup
                  value={watch("beneficiary_profile.race")}
                  onValueChange={(val) =>
                    setValue("beneficiary_profile.race", val)
                  }
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
                {errors?.beneficiary_profile?.race && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.beneficiary_profile.race.message}
                  </p>
                )}
              </div>
              <SelectWithForm<SchemaType>
                name="beneficiary_profile.city"
                title="City"
                options={cities}
              />
              <CustomInput
                type="text"
                id="state"
                name="beneficiary_profile.state"
                label="State"
                value={watch("beneficiary_profile.state")}
                onChange={(e) =>
                  setValue("beneficiary_profile.state", e.target.value)
                }
                errors={errors.beneficiary_profile?.state?.message}
                placeholder="Enter state"
              />
              <CustomInput
                type="text"
                id="address_line_1"
                name="beneficiary_profile.address_line_1"
                label="Address"
                value={watch("beneficiary_profile.address_line_1")}
                onChange={(e) =>
                  setValue("beneficiary_profile.address_line_1", e.target.value)
                }
                errors={errors.beneficiary_profile?.address_line_1?.message}
                placeholder="Enter address"
              />

              <CustomInput
                type="text"
                id="postcode"
                name="beneficiary_profile.postcode"
                label="Postcode"
                value={watch("beneficiary_profile.postcode")}
                onChange={(e) =>
                  setValue("beneficiary_profile.postcode", e.target.value)
                }
                errors={errors.beneficiary_profile?.postcode?.message}
                placeholder="Enter postcode"
              />
            </div>

            {/* Emergency Info */}
            <HeaderSection title="Emergency Contact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <CustomInput
                type="text"
                id="emergency_contact_name"
                name="beneficiary_profile.emergency_contact_name"
                label="Name"
                value={watch("beneficiary_profile.emergency_contact_name")}
                onChange={(e) =>
                  setValue(
                    "beneficiary_profile.emergency_contact_name",
                    e.target.value
                  )
                }
                errors={
                  errors.beneficiary_profile?.emergency_contact_name?.message
                }
                placeholder="Enter name"
              />
              <CustomInput
                type="text"
                id="emergency_contact_relationship"
                name="beneficiary_profile.emergency_contact_relationship"
                label="Relationship"
                value={watch(
                  "beneficiary_profile.emergency_contact_relationship"
                )}
                onChange={(e) =>
                  setValue(
                    "beneficiary_profile.emergency_contact_relationship",
                    e.target.value
                  )
                }
                errors={
                  errors.beneficiary_profile?.emergency_contact_relationship
                    ?.message
                }
                placeholder="Enter relationship"
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
