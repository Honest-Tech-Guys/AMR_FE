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
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
const CreateTenancy = () => {
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
          Add Tenancy
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Tenancy
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
              <CustomInput
                id="tenant_type"
                name="tenant_type"
                type="text"
                label="Tenant"
                value={watch("tenant_type")}
                onChange={(e) => setValue("tenant_type", e.target.value)}
                errors={errors.tenant_type?.message}
                placeholder="Enter Tenant"
              />

              <CustomInput
                id="date_of_agreement"
                name="date_of_agreement"
                type="date"
                label="Date of Agreement"
                value={watch("date_of_agreement")}
                onChange={(e) => setValue("date_of_agreement", e.target.value)}
                errors={errors.date_of_agreement?.message}
                placeholder="Enter Date of Agreement"
              />
              <CustomInput
                id="rental_fee"
                name="rental_fee"
                type="number"
                label="Rental Fee"
                value={watch("rental_fee")}
                onChange={(e) => setValue("rental_fee", e.target.value)}
                errors={errors.rental_fee?.message}
                placeholder="Enter Rental Fee"
              />
              <CustomInput
                id="tenancy_period_start_date"
                name="tenancy_period_start_date"
                type="date"
                label="Tenancy Period (Start Date)"
                value={watch("tenancy_period_start_date")}
                onChange={(e) =>
                  setValue("tenancy_period_start_date", e.target.value)
                }
                errors={errors.tenancy_period_start_date?.message}
                placeholder="Enter Tenancy Period (Start Date)"
              />
              <CustomInput
                id="tenancy_period_end_date"
                name="tenancy_period_end_date"
                type="date"
                label="Tenancy Period (End Date)"
                value={watch("tenancy_period_end_date")}
                onChange={(e) =>
                  setValue("tenancy_period_end_date", e.target.value)
                }
                errors={errors.tenancy_period_end_date?.message}
                placeholder="Enter Tenancy Period (End Date)"
              />
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

export default CreateTenancy;
