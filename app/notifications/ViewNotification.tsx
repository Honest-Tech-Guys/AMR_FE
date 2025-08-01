"use client";

import CustomInput from "@/components/CustomInput";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MultiFileUpload from "@/components/input-11";
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
  floor_plan_image: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("File name is required"),
        size: yup.number().required("File size is required"),
        type: yup.string().required("File type is required"),
        base64: yup.string().required("File content is required"),
      })
    )
    .min(1, "proposed attach form is required")
    .required("proposed attach form is required"),
  unit_image: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("File name is required"),
        size: yup.number().required("File size is required"),
        type: yup.string().required("File type is required"),
        base64: yup.string().required("File content is required"),
      })
    )
    .min(1, "proposed attach form is required")
    .required("proposed attach form is required"),
  meeting_room: yup.boolean().default(false),
  game_room: yup.boolean().default(false),
  basketball_court: yup.boolean().default(false),
  sauna: yup.boolean().default(false),
  free_text: yup.boolean().default(false),
});
type schemaType = yup.InferType<typeof schema>;
const ViewNotification = () => {
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
    { id: "passcode", label: "Passcode" },
    { id: "fingerprint", label: "Fingerprint" },
    { id: "IC_card", label: "IC Card" },
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
        <label className="font-normal text-[#337AB7]">123512350</label>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            View Announcement
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Announcement Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="serial_number"
                name="serial_number"
                type="text"
                label="Title"
                value={watch("serial_number")}
                onChange={(e) => setValue("serial_number", e.target.value)}
                errors={errors.serial_number?.message}
                placeholder="Enter Title"
              />
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
              <CustomInput
                id="property_name"
                name="property_name"
                type="text"
                label="Status"
                value={watch("property_name")}
                onChange={(e) => setValue("property_name", e.target.value)}
                errors={errors.property_name?.message}
                placeholder="Enter Status"
              />

              <div className="">
                <span className="font-semibold">Documents</span>
                <Controller
                  control={control}
                  name="floor_plan_image"
                  rules={{ required: "Company statutory form is required" }}
                  render={({ field: { onChange, value } }) => (
                    <MultiFileUpload
                      isMulti={false}
                      field="companyStatutoryForm"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.floor_plan_image && (
                  <span className="text-red-500 text-sm">
                    {errors.floor_plan_image.message}
                  </span>
                )}
              </div>
              <CustomInput
                id="property_name"
                name="property_name"
                type="date"
                label="Start Date"
                value={watch("property_name")}
                onChange={(e) => setValue("property_name", e.target.value)}
                errors={errors.property_name?.message}
                placeholder="Enter Status"
              />
              <CustomInput
                id="property_name"
                name="property_name"
                type="date"
                label="End Date"
                value={watch("property_name")}
                onChange={(e) => setValue("property_name", e.target.value)}
                errors={errors.property_name?.message}
                placeholder="Enter Status"
              />

              <div className="col-span-2">
                {" "}
                <CustomInput
                  id="remarks"
                  name="remarks"
                  type="textArea"
                  label="Remarks"
                  value={watch("remarks")}
                  onChange={(e) => setValue("remarks", e.target.value)}
                  errors={errors.remarks?.message}
                  className="bg-gray-100"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNotification;
