"use client";

import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import useAddUnit from "@/lib/services/hooks/useAddUnit";
import { toast } from "sonner";
// Schema & type
const schema = yup.object({
  property_id: yup.string().required("Property name is required"),
  unit_number: yup.string().required("Block / Floor / Unit Number is required"),
  remarks: yup.string().nullable(),
  address: yup.string().required("Address is required"),
  meeting_room: yup.boolean().default(false),
  game_room: yup.boolean().default(false),
  basketball_court: yup.boolean().default(false),
  sauna: yup.boolean().default(false),
  free_text: yup.boolean().default(false),
  bedroom: yup.string().required("Bedroom is required"),
  bathroom: yup.string().required("Bathroom is required"),
  square_feet: yup.string().required("Square Feet is required"),
  beneficiary: yup.string().required("Beneficiary is required"),
  is_activated: yup.boolean().default(false),
  service_fee: yup
    .number()
    .typeError("Service fee is required")
    .required("Service fee is required"),
  profit_sharing: yup
    .number()
    .typeError("Profit sharing is required")
    .required("Profit sharing is required"),
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
  // Add other fields as needed
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

  const PartnerType = [
    { id: "1", name: "Apartment" },
    { id: "2", name: "Condominium" },
    { id: "3", name: "Flat " },
    { id: "4", name: "Landed" },
    { id: "5", name: "Townhouse" },
  ];
  const { mutate, isPending, isSuccess, isError } = useAddUnit();
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    // Example transformation (you'll need to adjust as per your actual data)

    mutate(
      {
        property_id: data.property_id, // get this from context or selection
        unit_number: data.unit_number,
        rental_type: "whole" /* or "sublet", map from toggle */,
        square_feet: data.square_feet,
        business_partner_id: "1", // get this from context or selection
        bedroom_count: data.bedroom,
        bathroom_count: data.bathroom,
        // floor_plan_img: data.floor_plan_image?.[0]?.base64 || null,
        // unit_img: data.unit_image?.[0]?.base64 || null,
        description: data.remarks || "",
        is_active: data.is_activated ? "1" : "0",
        beneficiary: data.beneficiary,
        remarks: data.remarks || "",
        service_fee_percent: String(data.service_fee),
        profit_share_percent: String(data.profit_sharing),
      },
      {
        onSuccess: () => {
          toast.success("Unit created successfully!");
        },
        onError: (err) => {
          toast.error((err as any)?.message || "Failed to create unit.");
        },
      }
    );
  };

  return (
    <div className="bg-white p-5 rounded-2xl">
      {/* <DialogHeader>
        <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
          Create New Unit
        </div>
      </DialogHeader> */}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HeaderSection title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SelectWithForm<schemaType>
                name="property_id"
                title="Property Name"
                options={PartnerType}
              />
            </div>
            <CustomInput
              id="unit_number"
              name="unit_number"
              type="text"
              label="Block / Floor / Unit Number"
              value={watch("unit_number")}
              onChange={(e) => setValue("unit_number", e.target.value)}
              errors={errors.unit_number?.message}
              placeholder="Enter Block / Floor / Unit Number"
            />
            <div>
              <SelectWithForm<schemaType>
                name="unit"
                title="Tenant management operator"
                options={PartnerType}
              />
            </div>
            <div>
              <Label className="mb-3">Rental Type</Label>
              <ToggleGroup variant="outline" type="single">
                <ToggleGroupItem
                  className="px-3"
                  value="bold"
                  aria-label="Toggle bold"
                >
                  Whole Unit
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="px-3"
                  value="italic"
                  aria-label="Toggle italic"
                >
                  Sublet
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          <HeaderSection title="Floor Plan Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              id="bedroom"
              name="bedroom"
              type="text"
              label="Bedroom"
              value={watch("bedroom")}
              onChange={(e) => setValue("bedroom", e.target.value)}
              errors={errors.bedroom?.message}
              placeholder="Enter Bedroom"
            />
            <CustomInput
              id="bathroom"
              name="bathroom"
              type="text"
              label="Bathroom"
              value={watch("bathroom")}
              onChange={(e) => setValue("bathroom", e.target.value)}
              errors={errors.bathroom?.message}
              placeholder="Enter Bathroom"
            />
            <div className="col-span-2">
              <CustomInput
                id="square_feet"
                name="square_feet"
                type="text"
                label="Square Feet"
                value={watch("square_feet")}
                onChange={(e) => setValue("square_feet", e.target.value)}
                errors={errors.square_feet?.message}
                placeholder="Enter Square Feet"
              />
            </div>
            <div className="space-y-2 ">
              <span className="font-semibold">Floor Plan Image</span>
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
            </div>{" "}
            <div className="space-y-2 ">
              <span className="font-semibold">Unit Image (Optional)</span>
              <Controller
                control={control}
                name="unit_image"
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
              {errors.unit_image && (
                <span className="text-red-500 text-sm">
                  {errors.unit_image.message}
                </span>
              )}
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                id="remarks"
                label="Description"
                type="textArea"
                name="remarks"
                value={watch("remarks")}
                onChange={(e) => setValue("remarks", e.target.value)}
                placeholder="E.g describe more about the reason for change"
                className="bg-gray-100 rounded-[6px]"
                errors={errors.remarks?.message}
              />
            </div>{" "}
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
          <HeaderSection title="Other Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              id="beneficiary"
              name="beneficiary"
              type="text"
              label="Beneficiary"
              value={watch("beneficiary")}
              onChange={(e) => setValue("beneficiary", e.target.value)}
              errors={errors.beneficiary?.message}
              placeholder="Enter Beneficiary"
            />
            <div>
              <Label className="mb-3">Is Activated</Label>
              <ToggleGroup variant="outline" type="single">
                <ToggleGroupItem value="bold" aria-label="Toggle bold">
                  Yes
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">
                  No
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div>
              <Label className="mb-3">Service Fee</Label>
              <div className="flex items-center bg-gray-100 rounded-[6px] px-3 border border-gray-200">
                <span className="text-gray-500 mr-2 text-lg">%</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  className="bg-transparent border-0 shadow-none outline-none w-full"
                  value={watch("service_fee") || ""}
                  onChange={(e) =>
                    setValue("service_fee", Number(e.target.value))
                  }
                  placeholder="Enter service fee"
                />
              </div>
              {errors.service_fee && (
                <span className="text-red-500 text-sm">
                  {errors.service_fee.message}
                </span>
              )}
            </div>
            <div>
              <Label className="mb-3">Profit Sharing</Label>
              <div className="flex items-center bg-gray-100 rounded-[6px] px-3 border border-gray-200">
                <span className="text-gray-500 mr-2 text-lg">%</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  className="bg-transparent border-0 shadow-none outline-none w-full"
                  value={watch("profit_sharing") || ""}
                  onChange={(e) =>
                    setValue("profit_sharing", Number(e.target.value))
                  }
                  placeholder="Enter profit sharing"
                />
              </div>
              {errors.profit_sharing && (
                <span className="text-red-500 text-sm">
                  {errors.profit_sharing.message}
                </span>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" className="text-white" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateUnit;
