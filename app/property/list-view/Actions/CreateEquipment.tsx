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
import MultiFileUpload from "@/components/input-11";
// Schema & type
// Schema & type
const schema = yup.object({
  // Basic Info
  property_name: yup.string().required("Property name is required"),
  category: yup.string().required("Category is required"),
  sub_category: yup.string().required("Sub category is required"),
  brand_name: yup.string().required("Brand name is required"),
  model_name: yup.string().required("Model name is required"),
  serial_number: yup.string().required("Serial number is required"),
  price: yup.string().required("Price is required"),
  width: yup.string().required("Width is required"),
  height: yup.string().required("Height is required"),
  depth: yup.string().required("Depth is required"),
  installation_date: yup.string().required("Installation date is required"),
  warranty_expire_date: yup
    .string()
    .required("Warranty expire date is required"),

  // Uploads
  companyStatutoryForm1: yup
    .mixed()
    .required("Warranty card image is required"),

  // Remarks
  remarks: yup.string().nullable(),

  // Service Reminder
  next_service_date: yup.string().required("Next service date is required"),
  schedule_date: yup.string().required("Schedule date is required"),

  // Facilities (booleans)
  meeting_room: yup.boolean().default(false),
  game_room: yup.boolean().default(false),
  basketball_court: yup.boolean().default(false),
  sauna: yup.boolean().default(false),
  free_text: yup.boolean().default(false),
});

type schemaType = yup.InferType<typeof schema>;

interface Props {
  id: number;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}
const CreateEquipment = ({ id, onOpenChange, open }: Props) => {
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
    console.log("Form data:", data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Add Equipment
        </Button>
      </DialogTrigger> */}

      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="md:max-w-[1000px] bg-white z-400 md:p-10 max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Equipment
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
                name="category"
                title="Category"
                options={PartnerType}
              />
              <SelectWithForm<schemaType>
                name="sub_category"
                title="Sub Category"
                options={PartnerType}
              />
              <CustomInput
                id="brand_name"
                name="brand_name"
                type="text"
                label="Brand Name"
                value={watch("brand_name")}
                onChange={(e) => setValue("brand_name", e.target.value)}
                errors={errors.brand_name?.message}
                placeholder="Enter Brand Name"
              />
              <CustomInput
                id="model_name"
                name="model_name"
                type="text"
                label="Model Name"
                value={watch("model_name")}
                onChange={(e) => setValue("model_name", e.target.value)}
                errors={errors.model_name?.message}
                placeholder="Enter Model Name"
              />
              <CustomInput
                id="serial_number"
                name="serial_number"
                type="text"
                label="Serial Number"
                value={watch("serial_number")}
                onChange={(e) => setValue("serial_number", e.target.value)}
                errors={errors.serial_number?.message}
                placeholder="Enter Serial Number"
              />
              <CustomInput
                id="price"
                name="price"
                type="number"
                label="Price"
                value={watch("price")}
                onChange={(e) => setValue("price", e.target.value)}
                errors={errors.price?.message}
                placeholder="Enter Price"
              />
              <CustomInput
                id="width"
                name="width"
                type="text"
                label="Width (cm)"
                value={watch("width")}
                onChange={(e) => setValue("width", e.target.value)}
                errors={errors.width?.message}
                placeholder="Enter Width"
              />
              <CustomInput
                id="height"
                name="height"
                type="text"
                label="Height (cm)"
                value={watch("height")}
                onChange={(e) => setValue("height", e.target.value)}
                errors={errors.height?.message}
                placeholder="Enter Height"
              />
              <CustomInput
                id="Depth"
                name="depth"
                type="text"
                label="Depth (cm)"
                value={watch("depth")}
                onChange={(e) => setValue("depth", e.target.value)}
                errors={errors.depth?.message}
                placeholder="Enter Depth"
              />
              <CustomInput
                id="installation_date"
                name="installation_date"
                type="date"
                label="Installation Date"
                value={watch("installation_date")}
                onChange={(e) => setValue("installation_date", e.target.value)}
                errors={errors.installation_date?.message}
                placeholder="Enter Installation Date"
              />
              <CustomInput
                id="warranty_expire_date"
                name="warranty_expire_date"
                type="date"
                label="Warrant Expire Date"
                value={watch("warranty_expire_date")}
                onChange={(e) =>
                  setValue("warranty_expire_date", e.target.value)
                }
                errors={errors.warranty_expire_date?.message}
                placeholder="Enter Warranty Expire Date"
              />
              {/* <div className="space-y-2 col-span-2 ">
                <span className="font-semibold">
                  Upload Warranty Card Image
                </span>
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
              </div> */}
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
            <HeaderSection title="Service Reminder" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <CustomInput
                id="next_service_date"
                name="next_service_date"
                type="date"
                value={watch("next_service_date")}
                label="Next Service Date"
                onChange={(e) => setValue("next_service_date", e.target.value)}
                errors={errors.next_service_date?.message}
                placeholder="Enter Next Service Date"
              />
              <CustomInput
                id="schedule_date"
                name="schedule_date"
                type="date"
                value={watch("schedule_date")}
                label="Schedule Date"
                onChange={(e) => setValue("schedule_date", e.target.value)}
                errors={errors.schedule_date?.message}
                placeholder="Enter Schedule Date"
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
                  className="bg-gray-100"
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

export default CreateEquipment;
