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
import useGetOwnersSelection from "@/lib/services/hooks/useGetOwnerSelection";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { useAuthStore } from "@/lib/stores/authStore";
// Schema & type
const schema = yup.object({
  postcode: yup.string().required("Country is required"),
  city: yup.string().required("Country is required"),
  state: yup.string().required("Country is required"),
  property_name: yup.string().required("Property name is required"),
  property_type: yup.string().required("Property type is required"),
  owner_id: yup.string().required("Owner is required"),
  owner_phone_number: yup.string().required("Owner phone number is required"),
  contact_name: yup.string().required("Contact name is required"),
  contact_phone_number: yup
    .string()
    .required("Contact phone number is required"),
  remarks: yup.string().nullable(),
  address: yup.string().required("Address is required"),
  meeting_room: yup.boolean().default(false),
  game_room: yup.boolean().default(false),
  basketball_court: yup.boolean().default(false),
  sauna: yup.boolean().default(false),
  free_text: yup.boolean().default(false),
});
type schemaType = yup.InferType<typeof schema>;

const CreateNewProperty = () => {
  const [owners, setOwners] = useState([]);
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
  const { mutate, isPending } = useAddProperty();
  const { data } = useGetOwnersSelection();
  const { refetch } = useGetPropertiesList({});
  const { user_role } = useAuthStore();
  useEffect(() => {
    if (data) {
      const dataT = data.map((owner) => {
        return { id: `${owner.id}`, name: owner.name };
      });
      setOwners(dataT as never);
    }
  }, [data]);
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

  const PartnerType = [
    { id: "Apartment1", name: "Apartment" },
    { id: "Condominium", name: "Condominium" },
    { id: "Flat", name: "Flat" },
    { id: "Landed", name: "Landed" },
    { id: "Townhouse", name: "Townhouse" },
  ];
  const facilities = [
    { id: "meeting_room", label: "Meeting Room" },
    { id: "game_room", label: "Game Room" },
    { id: "basketball_court", label: "Basketball Court" },
    { id: "sauna", label: "Sauna" },
  ] as const;
  type FacilityId = (typeof facilities)[number]["id"];
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    // Map facilities
    const facilitiesList = facilities
      .filter((f) => (data as any)[f.id])
      .map((f) => f.id);
    // Compose payload for AddPropertyInput
    const payload = {
      property_name: data.property_name,
      owner_id: data.owner_id,
      owner_phone: data.owner_phone_number,
      contact_name: data.contact_name || null,
      contact_phone: data.contact_phone_number || null,
      property_type: data.property_type,
      remarks: data.remarks || "",
      address_line_1: data.address || null,
      country: "soso",
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      facilities: facilitiesList,
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Property created successfully!");
        reset();
        refetch();
        setIsOpen(false);
      },
      onError: (err) => {
        toast.error((err as any)?.message || "Failed to create property.");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white cursor-pointer">
          Create New Property
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Property
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
              <SelectWithForm<schemaType>
                name="property_type"
                title="Property Type"
                options={PartnerType}
              />
              {user_role !== "Admin" ? (
                <>
                  {" "}
                  <SelectWithForm<schemaType>
                    name="owner_id"
                    title="Owner"
                    options={owners}
                  />
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Owner Phone Number
                    </label>
                    <Controller
                      control={control}
                      name="owner_phone_number"
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          placeholder="Enter Owner Number"
                        />
                      )}
                    />
                    {errors.owner_phone_number && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.owner_phone_number.message}
                      </p>
                    )}
                  </div>
                </>
              ) : null}

              <CustomInput
                id="contact_name"
                name="contact_name"
                type="text"
                value={watch("contact_name")}
                label="Contact Name"
                onChange={(e) => setValue("contact_name", e.target.value)}
                errors={errors.contact_name?.message}
                placeholder="Enter Contact Name"
              />
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Contact Phone Number
                </label>
                <Controller
                  control={control}
                  name="contact_phone_number"
                  render={({ field }) => (
                    <PhoneInput {...field} placeholder="Enter Contact Number" />
                  )}
                />
                {errors.contact_phone_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.contact_phone_number.message}
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
            <HeaderSection title="Address Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                value={watch("address")}
                label="Address"
                onChange={(e) => setValue("address", e.target.value)}
                errors={errors.address?.message}
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
            <HeaderSection title="Facilities & Amenities" />
            <div className="flex gap-4 mt-4">
              {facilities.map((facility) => (
                <CustomInput
                  key={facility.id}
                  id={facility.id}
                  name={facility.id}
                  label={facility.label}
                  type="checkbox"
                  checkboxDefaultValue={Boolean(
                    watch(facility.id as FacilityId)
                  )}
                  onCheckedChange={(checked) =>
                    setValue(facility.id as FacilityId, checked as boolean)
                  }
                />
              ))}
            </div>
            {/* Toast notifications are handled by 'sonner', so no need for local success/error display here */}
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

export default CreateNewProperty;
