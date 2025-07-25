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
import MapWithPoints from "@/components/ImageMapper";
// Schema & type
const schema = yup.object({
  country: yup.string().required("Country is required"),
  postcode: yup.string().required("Country is required"),
  city: yup.string().required("Country is required"),
  state: yup.string().required("Country is required"),
  property_name: yup.string().required("Property name is required"),
  property_type: yup.string().required("Property type is required"),
  owner_name: yup.string().required("Owner name is required"),
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
const CreateUnit = () => {
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
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    const facilitiesList = facilities
      .filter((f) => data[f.id]) // only where checkbox is true
      .map((f) => f.id);
    console.log("Form data:", facilitiesList);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Add Unit
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Unit
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
                id="owner_name"
                name="owner_name"
                type="text"
                label="Owner Name"
                value={watch("owner_name")}
                onChange={(e) => setValue("owner_name", e.target.value)}
                errors={errors.owner_name?.message}
                placeholder="Enter Owner Name"
              />

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Owner Phone Number
                </label>
                <Controller
                  control={control}
                  name="owner_phone_number"
                  render={({ field }) => (
                    <PhoneInput {...field} placeholder="Enter Owner Number" />
                  )}
                />
                {errors.owner_phone_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.owner_phone_number.message}
                  </p>
                )}
              </div>
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
                  checkboxDefaultValue={watch(facility.id) as boolean}
                  onCheckedChange={(checked) =>
                    setValue(facility.id, checked as boolean)
                  }
                />
              ))}
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="text-white">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUnit;
