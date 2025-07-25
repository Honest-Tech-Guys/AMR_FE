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
// Schema & type
const schema = yup.object({
  country: yup.string().required("Country is required"),
  postcode: yup.string().required("Country is required"),
  city: yup.string().required("Country is required"),
  state: yup.string().required("Country is required"),
  property_name: yup.string().required("Property name is required"),
  unit: yup.string().required("Property type is required"),
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
const CreateNewBooking = () => {
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
        <Button className="rounded-[6px] text-white">Create New Booking</Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Booking
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
              </div>
              <div>
                <SelectWithForm<schemaType>
                  name="unit"
                  title="Unit"
                  options={PartnerType}
                />
              </div>
              <CustomInput
                id="room"
                name="room"
                type="text"
                label="Room"
                value={watch("room")}
                onChange={(e) => setValue("room", e.target.value)}
                errors={errors.room?.message}
                placeholder="Enter Room"
              />
              <div></div>
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
                <Label className="mb-5">Race</Label>
                <RadioGroup
                  defaultValue="comfortable"
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">Malay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Chinese</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="r3" />
                    <Label htmlFor="r3">Indian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="r4" />
                    <Label htmlFor="r4">Others</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="mb-5">Gender</Label>
                <RadioGroup
                  defaultValue="comfortable"
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="r3" />
                    <Label htmlFor="r3">Pref Not To Say</Label>
                  </div>
                </RadioGroup>
              </div>
              <CustomInput
                id="move_in_date"
                name="move_in_date"
                type="date"
                label="Move In Date"
                value={watch("move_in_date")}
                onChange={(e) => setValue("move_in_date", e.target.value)}
                errors={errors.move_in_date?.message}
                placeholder="Enter Move In Date"
              />
              <CustomInput
                id="move_out_date"
                name="move_out_date"
                type="date"
                label="Move Out Date"
                value={watch("move_out_date")}
                onChange={(e) => setValue("move_out_date", e.target.value)}
                errors={errors.move_out_date?.message}
                placeholder="Enter Move Out Date"
              />
              <div>
                <Label className="mb-5">Type</Label>
                <RadioGroup
                  defaultValue="comfortable"
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="NRIC" />
                    <Label htmlFor="NRIC">NRIC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="passport" />
                    <Label htmlFor="passport">Passport</Label>
                  </div>
                </RadioGroup>
              </div>{" "}
              <div></div>
              <div className="space-y-2 ">
                <span className="font-semibold">Front Side</span>
                <Controller
                  control={control}
                  name="companyStatutoryForm1"
                  rules={{ required: "Company statutory form is required" }}
                  render={({ field: { onChange, value } }) => (
                    <MultiFileUpload
                      isMulti={false}
                      field="companyStatutoryForm1"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.companyStatutoryForm && (
                  <span className="text-red-500 text-sm">
                    {errors.companyStatutoryForm.message}
                  </span>
                )}
              </div>{" "}
              <div className="space-y-2 ">
                <span className="font-semibold">Back Side</span>
                <Controller
                  control={control}
                  name="companyStatutoryForm2"
                  rules={{ required: "Company statutory form is required" }}
                  render={({ field: { onChange, value } }) => (
                    <MultiFileUpload
                      isMulti={false}
                      field="companyStatutoryForm2"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.companyStatutoryForm && (
                  <span className="text-red-500 text-sm">
                    {errors.companyStatutoryForm.message}
                  </span>
                )}
              </div>
            </div>
            <HeaderSection title="Rental Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <CustomInput
                  id="rental"
                  name="rental"
                  type="text"
                  label="Rental Fee"
                  value={watch("rental")}
                  onChange={(e) => setValue("rental", e.target.value)}
                  errors={errors.rental?.message}
                  placeholder="Enter Rental"
                />
              </div>
              <div>
                <Label className="mb-3">Rental Payment Frequency</Label>
                <ToggleGroup variant="outline" type="single">
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    Monthly
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    Daily
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="strikethrough"
                    aria-label="Toggle strikethrough"
                  >
                    One Time
                  </ToggleGroupItem>
                </ToggleGroup>
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

export default CreateNewBooking;
