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
import HeaderSection from "@/components/HeaderSection";
import PhoneInput from "@/components/phone-input";
import useUpdateProperty, {
  UpdatePropertyInput,
} from "@/lib/services/hooks/useUpdateProperties";
import { PropertyType } from "@/types/PropertyType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Schema & type
const schema = yup.object({
  country: yup.string().required("Country is required"),
  postcode: yup.string().required("Postcode is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  property_name: yup.string().required("Property name is required"),
  property_type: yup.string().required("Property type is required"),
  attention_name: yup.string().nullable(),
  attention_phone_number: yup.string().nullable(),
  remarks: yup.string().nullable(),
  address_line_1: yup.string().nullable(),
  meeting_room: yup.boolean().default(false),
  game_room: yup.boolean().default(false),
  basketball_court: yup.boolean().default(false),
  sauna: yup.boolean().default(false),
  free_text: yup.boolean().default(false),
});

type schemaType = yup.InferType<typeof schema>;

interface EditPropertyProps {
  property?: PropertyType;
  onSuccess?: () => void;
}

const ViewProperty = ({ property, onSuccess }: EditPropertyProps) => {
  const updatePropertyMutation = useUpdateProperty();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<schemaType>({
    mode: "onTouched",
    defaultValues: {
      property_name: "",
      property_type: "",
      attention_name: "",
      attention_phone_number: "",
      remarks: "",
      address_line_1: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      meeting_room: false,
      game_room: false,
      basketball_court: false,
      sauna: false,
      free_text: false,
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

  // Populate form when property data is available
  useEffect(() => {
    if (property) {
      reset({
        property_name: property.property_name,
        property_type: property.property_type,
        attention_name: property.attention_name || "",
        attention_phone_number: property.attention_phone_number || "",
        remarks: property.remarks || "",
        address_line_1: property.address_line_1 || "",
        city: property.city,
        state: property.state,
        postcode: property.postcode,
        country: property.country,
        meeting_room: property.facilities.includes("meeting_room"),
        game_room: property.facilities.includes("game_room"),
        basketball_court: property.facilities.includes("basketball_court"),
        sauna: property.facilities.includes("sauna"),
        free_text: property.facilities.includes("free_text"),
      });
    }
  }, [property, reset]);

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
    { id: "meeting_room" as const, label: "Meeting Room" },
    { id: "game_room" as const, label: "Game Room" },
    { id: "basketball_court" as const, label: "Basketball Court" },
    { id: "sauna" as const, label: "Sauna" },
    { id: "free_text" as const, label: "Free Text" },
  ];

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    if (!property?.id) {
      console.error("No property ID found");
      toast.error("No property selected for update");
      return;
    }

    const facilitiesList = facilities
      .filter((f) => data[f.id]) // only where checkbox is true
      .map((f) => f.id);

    const updateData: UpdatePropertyInput = {
      id: property.id,
      property_name: data.property_name,
      property_type: data.property_type,
      attention_name: data.attention_name,
      attention_phone_number: data.attention_phone_number,
      remarks: data.remarks || "",
      address_line_1: data.address_line_1,
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      country: data.country,
      facilities: facilitiesList,
    };

    // Show loading toast
    const loadingToast = toast.loading("Updating property...");

    updatePropertyMutation.mutate(updateData, {
      onSuccess: () => {
        onSuccess?.();
        // Reset form after successful update
        reset();
        toast.dismiss(loadingToast);
        toast.success("Property updated successfully!");
        // Close the dialog
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Update property error:", error);
        toast.dismiss(loadingToast);
        toast.error("Failed to update property. Please try again.");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-primary font-semibold text-start cursor-pointer">
          {property?.property_name}
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            View Property
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
              <CustomInput
                id="attention_name"
                name="attention_name"
                type="text"
                label="Attention Name"
                value={watch("attention_name")}
                onChange={(e) => setValue("attention_name", e.target.value)}
                errors={errors.attention_name?.message}
                placeholder="Enter Attention Name"
              />

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Attention Phone Number
                </label>
                <Controller
                  control={control}
                  name="attention_phone_number"
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Enter Attention Number"
                    />
                  )}
                />
                {errors.attention_phone_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.attention_phone_number.message}
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
            <HeaderSection title="Facilities & Amenities" />
            <div className="flex gap-4 mt-4">
              {facilities.map((facility) => (
                <CustomInput
                  key={facility.id}
                  id={facility.id}
                  name={facility.id}
                  label={facility.label}
                  type="checkbox"
                  checkboxDefaultValue={watch(facility.id)}
                  onCheckedChange={(checked) =>
                    setValue(facility.id, checked as boolean)
                  }
                />
              ))}
            </div>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
              {/* <Button
                type="submit"
                className="text-white"
                disabled={updatePropertyMutation.isPending}
              >
                {updatePropertyMutation.isPending
                  ? "Updating..."
                  : "Update Property"}
              </Button> */}
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProperty;
