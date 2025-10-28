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
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import useGetOwnersSelection from "@/lib/services/hooks/useGetOwnerSelection";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";

import useGetProfile from "@/lib/services/hooks/useGetProfile";
import { useAuthStore } from "@/lib/stores/authStore";
import useUpdateAvatar from "@/lib/services/hooks/useUpdateAvatar";
import useGetUser from "@/lib/services/hooks/useGetUser";
import useUpdateProfile from "@/lib/services/hooks/useUpdateProfile";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// Schema & type
const schema = yup.object({
  name: yup.string().optional(),
  nationality: yup.string().optional(),
  nric_number: yup.string().optional(),
  race: yup.string().optional(),
  gender: yup.string().optional(),
  address_line_1: yup.string().optional(),
  city: yup.string().optional(),
  postcode: yup.string().optional(),
  state: yup.string().optional(),
  country: yup.string().optional(),
  emergency_contact_name: yup.string().optional(),
  emergency_contact_relationship: yup.string().optional(),
  emergency_contact_phone: yup.string().optional(),
});
type schemaType = yup.InferType<typeof schema>;

const Page = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data } = useGetUser();
  const form = useForm<schemaType>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      nationality: "",
      nric_number: "",
      race: "",
      gender: "",
      address_line_1: "",
      city: "",
      postcode: "",
      state: "",
      country: "",
      emergency_contact_name: "",
      emergency_contact_relationship: "",
      emergency_contact_phone: "",
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

  useEffect(() => {
    if (data) {
      setAvatarPreview(data.user.avatar_url);
      // Reset form with API data when it loads
      reset({
        name: data.user.name || "",
        nationality: data.user.nationality || "",
        nric_number: data.user.nric_number || "",
        race: data.user.race || "",
        gender: data.user.gender || "",
        address_line_1: data.user.address_line_1 || "",
        city: data.user.city || "",
        postcode: data.user.postcode || "",
        state: data.user.state || "",
        country: data.user.country || "",
        emergency_contact_name: data.user.emergency_contact_name || "",
        emergency_contact_relationship:
          data.user.emergency_contact_relationship || "",
        emergency_contact_phone: data.user.emergency_contact_phone || "",
      });
    }
  }, [data, reset]);
  const { mutate, isPending } = useUpdateProfile();

  const { refetch } = useGetPropertiesList({});

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

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    // Compose payload for AddPropertyInput
    const payload = {
      name: data.name ?? undefined,
      nationality: data.nationality ?? undefined,
      nric_number: data.nric_number ?? undefined,
      race: data.race ?? undefined,
      gender: data.gender ?? undefined,
      address_line_1: data.address_line_1 ?? undefined,
      city: data.city ?? undefined,
      postcode: data.postcode ?? undefined,
      state: data.state ?? undefined,
      country: data.country ?? undefined,
      emergency_contact_name: data.emergency_contact_name ?? undefined,
      emergency_contact_relationship:
        data.emergency_contact_relationship ?? undefined,
      emergency_contact_phone: data.emergency_contact_phone ?? undefined,
      avatar: avatarFile ?? undefined,
    };
    // For now, just log the file if present
    if (avatarFile) {
      console.log("Avatar file to upload:", avatarFile);
    }
    mutate(payload, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        reset();
        setAvatarPreview(null);
        setAvatarFile(null);
        refetch();
      },
    });
  };
  const { mutate: updateAvatar, isPending: IsUpdatingAvatar } =
    useUpdateAvatar();
  return (
    <div>
      <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
        Profile
      </div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HeaderSection title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col col-span-2 items-center gap-2">
              <label className="block text-sm font-medium">Avatar</label>
              <div
                className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">
                      {isDragOver ? "Drop here" : "No Image"}
                    </div>
                    <div className="text-xs text-gray-300">
                      {isDragOver ? "" : "Click or drag"}
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleFileSelect(file);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="text-xs px-2 py-1"
                onClick={() => {
                  updateAvatar(
                    { avatar: avatarFile },
                    {
                      onSuccess: () => {
                        toast.success("Avatar Update successfully!");
                      },
                    }
                  );
                }}
                disabled={IsUpdatingAvatar}
              >
                {IsUpdatingAvatar ? "Updating Avatar..." : "Update Avatar"}
              </Button>
              {avatarFile && (
                <span className="text-xs text-gray-500 max-w-[120px] truncate">
                  {avatarFile.name}
                </span>
              )}
            </div>
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
              id="nric_number"
              name="nric_number"
              type="text"
              label="NRIC number"
              value={watch("nric_number")}
              onChange={(e) => setValue("nric_number", e.target.value)}
              errors={errors.nric_number?.message}
              placeholder="Enter nric_number"
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
          </div>
          <HeaderSection title="Address Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <SelectWithForm<schemaType>
              name="city"
              title="City"
              options={cities}
            />
            <CustomInput
              id="state"
              name="state"
              type="text"
              value={watch("state")}
              label="State"
              onChange={(e) => setValue("state", e.target.value)}
              errors={errors.state?.message}
              placeholder="Enter State"
            />
            <CustomInput
              id="address"
              name="address"
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
          <HeaderSection title="Other Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              id="emergency_contact_name"
              name="emergency_contact_name"
              type="text"
              label="Emergency Contact Name"
              value={watch("emergency_contact_name")}
              onChange={(e) =>
                setValue("emergency_contact_name", e.target.value)
              }
              errors={errors.emergency_contact_name?.message}
              placeholder="Enter Emergency Contact Name"
            />
            <CustomInput
              id="emergency_contact_relationship"
              name="emergency_contact_relationship"
              type="text"
              label="Emergency Contact Relationship"
              value={watch("emergency_contact_relationship")}
              onChange={(e) =>
                setValue("emergency_contact_relationship", e.target.value)
              }
              errors={errors.emergency_contact_relationship?.message}
              placeholder="Enter Emergency Contact Relationship"
            />
            <CustomInput
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              type="text"
              label="Emergency Contact Phone"
              value={watch("emergency_contact_phone")}
              onChange={(e) =>
                setValue("emergency_contact_phone", e.target.value)
              }
              errors={errors.emergency_contact_phone?.message}
              placeholder="Enter Emergency Contact Phone"
            />
            <div className=" mb-20 flex justify-center">
              <Button
                type="submit"
                className="text-white text-center"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Page;
