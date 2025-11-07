"use client";

import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import useUpdateUnit, {
  UpdateUnitInput,
} from "@/lib/services/hooks/useUpdateUnit";
import useUpdatePropertySetting, {
  UpdatePropertySettingInput,
} from "@/lib/services/hooks/useUpdatePropertySetting";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PropertySettingType from "@/types/PropertySetting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Datatable, { Column } from "@/components/datatable";
import RoomDropDown from "../../grid-view/RoomDropDown";
import { PaginationData } from "@/components/ui/pagination";
import getMeterAndLock from "@/components/General/GetMeterAndLock";
import CarParksDropDown from "../../grid-view/CarParksDropDown";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Room } from "@/types/RoomType";
import { Unit } from "@/types/UnitType";
import MapRoomViewer from "@/components/MapRoomViewer";
import EquipmentType from "@/types/EquipmentType";

// Schema & type
const schema = yup.object({
  property_id: yup.string().required("Property ID is required"),
  block_number: yup.string().required("Block number is required"),
  floor: yup.string().required("Floor is required"),
  unit_number: yup.string().required("Unit number is required"),
  rental_type: yup.string().required("Rental type is required"),
  square_feet: yup.string().required("Square feet is required"),
  business_partner_id: yup.string().required("Business partner ID is required"),
  bedroom_count: yup.string().required("Bedroom count is required"),
  bathroom_count: yup.string().required("Bathroom count is required"),
  description: yup.string().required("Description is required"),
  is_active: yup.string().required("Status is required"),
  beneficiary: yup.string().required("Beneficiary is required"),
  remarks: yup.string().required("Remarks is required"),
  service_fee_percent: yup.string().required("Service fee percent is required"),
  profit_share_percent: yup
    .string()
    .required("Profit share percent is required"),
});
const roomColumns: Column<Room>[] = [
  {
    title: "ID",
    key: "id",
    sortable: true,
    className: "pl-6 py-4",
    render: (room) => (
      <div className="pl-4 text-primary font-medium ">{room.id ?? "-"}</div>
    ),
  },
  {
    title: "Name",
    key: "name",
    sortable: true,
    render: (room) => <div>{room.name}</div>,
  },
  {
    title: "Lock & Meter",
    key: "lock_and_meter",
    render: (room) => (
      <div className="flex justify-center"> {getMeterAndLock(room)}</div>
    ),
  },
  {
    title: "Status",
    key: "status",
    render: (room) => (
      <Badge
        className={cn(
          room.status === "Vacant"
            ? "text-white bg-red-500"
            : "text-white bg-green-500"
        )}
      >
        {room.status}
      </Badge>
    ),
  },
  {
    title: "Action",
    key: "action",
    sortable: true,
    render: (room) => (
      <div>
        <RoomDropDown room={room} />
      </div>
    ),
  },
];
const carParksColumns: Column<Carpark>[] = [
  {
    title: "ID",
    key: "id",
    sortable: true,
    className: "pl-6 py-4",
    render: (carpark) => (
      <div className="pl-4 text-primary font-medium ">{carpark.id ?? "-"}</div>
    ),
  },
  {
    title: "Number",
    key: "number",
    sortable: true,
    render: (carpark) => <div>{carpark.number}</div>,
  },
  {
    title: "Floor",
    key: "floor",
    render: (carpark) => (
      <div className="flex justify-center"> {carpark.floor}</div>
    ),
  },
  {
    title: "Status",
    key: "status",
    render: (carpark) => (
      <Badge
        className={cn(
          carpark.status === "Vacant"
            ? "text-white bg-red-500"
            : "text-white bg-green-500"
        )}
      >
        {carpark.status}
      </Badge>
    ),
  },
  {
    title: "Action",
    key: "action",
    sortable: true,
    render: (carpark) => (
      <div>
        <CarParksDropDown carpark={carpark} />
      </div>
    ),
  },
];
export const equipmentColumns: Column<EquipmentType>[] = [
  {
    title: "ID",
    key: "id",
    sortable: true,
    className: "pl-6 py-4",
    render: (equipment) => (
      <div className="pl-4 text-primary font-medium">{equipment.id ?? "-"}</div>
    ),
  },
  {
    title: "Name",
    key: "name",
    sortable: true,
    render: (equipment) => <div>{equipment.name}</div>,
  },
  {
    title: "Serial Number",
    key: "serial_number",
    sortable: true,
    render: (equipment) => <div>{equipment.serial_number || "-"}</div>,
  },
  {
    title: "Description",
    key: "description",
    render: (equipment) => (
      <div className="max-w-[300px] truncate">
        {equipment.description || "-"}
      </div>
    ),
  },
  // {
  //   title: "Type",
  //   key: "equipmentable_type",
  //   render: (equipment) => (
  //     <Badge
  //       className={cn(
  //         equipment.equipmentable_type.includes("Room")
  //           ? "bg-blue-500 text-white"
  //           : "bg-gray-500 text-white"
  //       )}
  //     >
  //       {equipment.equipmentable_type.replace("App\\Models\\", "")}
  //     </Badge>
  //   ),
  // },
  {
    title: "Created At",
    key: "created_at",
    sortable: true,
    render: (equipment) => <div>{equipment.created_at.split("T")[0]}</div>,
  },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: (equipment) => (
  //     <div>
  //       {/* Replace with your dropdown, modal, or buttons */}
  //       <button
  //         onClick={() => console.log("View equipment:", equipment.id)}
  //         className="text-primary hover:underline"
  //       >
  //         View
  //       </button>
  //     </div>
  //   ),
  // },
];
type schemaType = yup.InferType<typeof schema>;

interface EditUnitProps {
  unit?: Unit;
  onSuccess?: () => void;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}

// Property Setting Schema
const settingSchema = yup.object({
  vr_url: yup.string().nullable().default(null),
  no_bed: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .default(null),
  no_bath: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .default(null),
  preferred_gender: yup.string().nullable().default(null),
  preferred_race: yup.string().nullable().default(null),
  cooking_facilities: yup.number().required("Cooking facilities is required"),
  fridge: yup.number().required("Fridge is required"),
  wifi: yup.number().required("Wifi is required"),
  washing_machine: yup.number().required("Washing machine is required"),
  cleaning: yup.number().required("Cleaning is required"),
  water_heater: yup.number().required("Water heater is required"),
  dryer: yup.number().required("Dryer is required"),
  balcony: yup.number().required("Balcony is required"),
  room_image: yup.string().nullable().default(null),
  rental: yup.string().required("Rental is required"),
  bed_type: yup.string().required("Bed type is required"),
  bath_type: yup.string().required("Bath type is required"),
  aircond: yup.string().required("Aircond is required"),
  window: yup.string().required("Window is required"),
  type_of_walls: yup.string().required("Type of walls is required"),
  furnishing: yup.string().required("Furnishing is required"),
  furnishing_details: yup.string().nullable().default(null),
  meter_type: yup.string().required("Meter type is required"),
  electricity_tracking: yup
    .string()
    .required("Electricity tracking is required"),
  electricity_rate: yup.string().required("Electricity rate is required"),
  size_sqft: yup.string().required("Size sqft is required"),
});

type settingSchemaType = yup.InferType<typeof settingSchema>;

const EditUnit = ({ unit, onSuccess, open, onOpenChange }: EditUnitProps) => {
  const updateUnitMutation = useUpdateUnit();
  const updateSettingMutation = useUpdatePropertySetting();
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const form = useForm<schemaType>({
    mode: "onTouched",
    defaultValues: {
      property_id: "",
      block_number: "",
      floor: "",
      unit_number: "",
      rental_type: "",
      square_feet: "",
      business_partner_id: "",
      bedroom_count: "",
      bathroom_count: "",
      description: "",
      is_active: "",
      beneficiary: "",
      remarks: "",
      service_fee_percent: "",
      profit_share_percent: "",
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

  // Settings form
  const settingForm = useForm<settingSchemaType>({
    mode: "onTouched",
    resolver: yupResolver(settingSchema) as any,
    defaultValues: {
      vr_url: null,
      no_bed: null,
      no_bath: null,
      preferred_gender: null,
      preferred_race: null,
      cooking_facilities: 0,
      fridge: 0,
      wifi: 0,
      washing_machine: 0,
      cleaning: 0,
      water_heater: 0,
      dryer: 0,
      balcony: 0,
      room_image: null,
      rental: "",
      bed_type: "",
      bath_type: "",
      aircond: "",
      window: "",
      type_of_walls: "",
      furnishing: "",
      furnishing_details: null,
      meter_type: "",
      electricity_tracking: "",
      electricity_rate: "",
      size_sqft: "",
    },
  });

  const {
    setValue: setSettingValue,
    watch: watchSetting,
    reset: resetSetting,
    handleSubmit: handleSettingSubmit,
    formState: { errors: settingErrors },
  } = settingForm;

  // Populate settings form when unit data is available
  useEffect(() => {
    if (unit?.setting) {
      const setting = unit.setting;
      resetSetting({
        vr_url: setting.vr_url,
        no_bed: setting.no_bed,
        no_bath: setting.no_bath,
        preferred_gender: setting.preferred_gender,
        preferred_race: setting.preferred_race,
        // Convert numbers to strings for SelectWithForm compatibility
        cooking_facilities: setting.cooking_facilities?.toString() as any,
        fridge: setting.fridge?.toString() as any,
        wifi: setting.wifi?.toString() as any,
        washing_machine: setting.washing_machine?.toString() as any,
        cleaning: setting.cleaning?.toString() as any,
        water_heater: setting.water_heater?.toString() as any,
        dryer: setting.dryer?.toString() as any,
        balcony: setting.balcony?.toString() as any,
        room_image: setting.room_image,
        rental: setting.rental,
        bed_type: setting.bed_type,
        bath_type: setting.bath_type,
        aircond: setting.aircond,
        window: setting.window,
        type_of_walls: setting.type_of_walls,
        furnishing: setting.furnishing,
        furnishing_details: setting.furnishing_details,
        meter_type: setting.meter_type,
        electricity_tracking: setting.electricity_tracking,
        electricity_rate: setting.electricity_rate,
        size_sqft: setting.size_sqft,
      });
    }
  }, [unit?.setting, resetSetting]);

  // Populate form when unit data is available
  useEffect(() => {
    if (unit) {
      reset({
        property_id: unit.property_id.toString(),
        block_number: unit.block,
        floor: unit.floor,
        unit_number: unit.unit_number,
        rental_type: unit.rental_type,
        square_feet: unit.square_feet as never,
        business_partner_id: "",
        bedroom_count: unit.bedroom_count.toString(),
        bathroom_count: unit.bathroom_count.toString(),
        description: unit.description || "",
        is_active: unit.is_activated.toString(),
        beneficiary: (unit.beneficiary_id as never) ?? "",
        remarks: unit.remarks || "",
        service_fee_percent: unit.service_fee_percentage,
        profit_share_percent: unit.profit_sharing_percentage,
      });
    }
  }, [unit, reset]);

  const RENTAL_TYPES = [
    { id: "monthly", name: "Monthly" },
    { id: "yearly", name: "Yearly" },
    { id: "weekly", name: "Weekly" },
    { id: "daily", name: "Daily" },
  ];

  const STATUS_OPTIONS = [
    { id: "1", name: "Active" },
    { id: "0", name: "Inactive" },
  ];

  const BEDROOM_OPTIONS = [
    { id: "1", name: "1 Bedroom" },
    { id: "2", name: "2 Bedrooms" },
    { id: "3", name: "3 Bedrooms" },
    { id: "4", name: "4 Bedrooms" },
    { id: "5", name: "5+ Bedrooms" },
  ];

  const BATHROOM_OPTIONS = [
    { id: "1", name: "1 Bathroom" },
    { id: "2", name: "2 Bathrooms" },
    { id: "3", name: "3 Bathrooms" },
    { id: "4", name: "4+ Bathrooms" },
  ];

  // Settings form options
  const YES_NO_OPTIONS = [
    { id: "0", name: "No" },
    { id: "1", name: "Yes" },
  ];

  const GENDER_OPTIONS = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
    { id: "any", name: "Any" },
  ];

  const RACE_OPTIONS = [
    { id: "malay", name: "Malay" },
    { id: "chinese", name: "Chinese" },
    { id: "indian", name: "Indian" },
    { id: "other", name: "Other" },
    { id: "any", name: "Any" },
  ];

  const RENTAL_OPTIONS = [
    { id: "monthly", name: "Monthly" },
    { id: "yearly", name: "Yearly" },
    { id: "weekly", name: "Weekly" },
    { id: "daily", name: "Daily" },
  ];

  const BED_TYPE_OPTIONS = [
    { id: "single", name: "Single" },
    { id: "double", name: "Double" },
    { id: "queen", name: "Queen" },
    { id: "king", name: "King" },
    { id: "bunk", name: "Bunk" },
  ];

  const BATH_TYPE_OPTIONS = [
    { id: "shared", name: "Shared" },
    { id: "private", name: "Private" },
    { id: "attached", name: "Attached" },
  ];

  const AIRCOND_OPTIONS = [
    { id: "yes", name: "Yes" },
    { id: "no", name: "No" },
    { id: "central", name: "Central" },
  ];

  const WINDOW_OPTIONS = [
    { id: "yes", name: "Yes" },
    { id: "no", name: "No" },
    { id: "partial", name: "Partial" },
  ];

  const WALL_TYPE_OPTIONS = [
    { id: "concrete", name: "Concrete" },
    { id: "brick", name: "Brick" },
    { id: "wood", name: "Wood" },
    { id: "drywall", name: "Drywall" },
  ];

  const FURNISHING_OPTIONS = [
    { id: "furnished", name: "Furnished" },
    { id: "semi-furnished", name: "Semi-Furnished" },
    { id: "unfurnished", name: "Unfurnished" },
  ];

  const METER_TYPE_OPTIONS = [
    { id: "individual", name: "Individual" },
    { id: "shared", name: "Shared" },
    { id: "included", name: "Included" },
  ];

  const ELECTRICITY_TRACKING_OPTIONS = [
    { id: "yes", name: "Yes" },
    { id: "no", name: "No" },
  ];

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    if (!unit?.id) {
      console.error("No unit ID found");
      toast.error("No unit selected for update");
      return;
    }

    const updateData: UpdateUnitInput = {
      id: unit.id,
      property_id: parseInt(data.property_id),
      block: data.block_number,
      floor: data.floor,
      unit_number: data.unit_number,
      rental_type: data.rental_type as "Whole Unit",
      square_feet: parseInt(data.square_feet),
      // business_partner_id: data.business_partner_id,
      bedroom_count: parseInt(data.bedroom_count),
      bathroom_count: parseInt(data.bathroom_count),
      description: data.description,
      is_activated: parseInt(data.is_active),
      // beneficiary: data.beneficiary,
      remarks: data.remarks,
      service_fee_percentage: data.service_fee_percent,
      profit_sharing_percentage: data.profit_share_percent,
    };

    // Show loading toast
    const loadingToast = toast.loading("Updating unit...");

    updateUnitMutation.mutate(updateData, {
      onSuccess: () => {
        onSuccess?.();
        // Reset form after successful update
        reset();
        toast.dismiss(loadingToast);
        toast.success("Unit updated successfully!");
        // Close the dialog
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Update unit error:", error);
        toast.dismiss(loadingToast);
        toast.error("Failed to update unit. Please try again.");
      },
    });
  };

  const onSettingSubmit: SubmitHandler<settingSchemaType> = (data) => {
    if (!unit?.setting?.id) {
      toast.error("No setting found to update");
      return;
    }

    // Convert string IDs from select components to numbers for numeric fields
    const updateData: UpdatePropertySettingInput = {
      unit_id: unit.setting.id,
      ...data,
      cooking_facilities:
        typeof data.cooking_facilities === "string"
          ? Number(data.cooking_facilities)
          : data.cooking_facilities,
      fridge:
        typeof data.fridge === "string" ? Number(data.fridge) : data.fridge,
      wifi: typeof data.wifi === "string" ? Number(data.wifi) : data.wifi,
      washing_machine:
        typeof data.washing_machine === "string"
          ? Number(data.washing_machine)
          : data.washing_machine,
      cleaning:
        typeof data.cleaning === "string"
          ? Number(data.cleaning)
          : data.cleaning,
      water_heater:
        typeof data.water_heater === "string"
          ? Number(data.water_heater)
          : data.water_heater,
      dryer: typeof data.dryer === "string" ? Number(data.dryer) : data.dryer,
      balcony:
        typeof data.balcony === "string" ? Number(data.balcony) : data.balcony,
    } as any;

    const loadingToast = toast.loading("Updating settings...");

    updateSettingMutation.mutate(updateData, {
      onSuccess: () => {
        onSuccess?.();
        toast.dismiss(loadingToast);
        toast.success("Settings updated successfully!");
      },
      onError: (error) => {
        console.error("Update setting error:", error);
        toast.dismiss(loadingToast);
        toast.error("Failed to update settings. Please try again.");
      },
    });
  };

  const tabItems =
    unit?.rental_type === "Whole Unit"
      ? [
          { label: "Basic", value: "basic_information" },
          { label: "Equipment", value: "equipment" },
          { label: "Setting", value: "setting" },
        ]
      : [
          { label: "Basic", value: "basic_information" },
          { label: "Rooms", value: "rooms" },
          { label: "Car Parks", value: "carParks" },
        ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Edit Unit
        </Button>
      </DialogTrigger> */}

      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="md:max-w-[1000px]  bg-white z-400 md:p-10 max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            View Unit
          </div>
        </DialogHeader>
        <Tabs defaultValue="basic_information" className="mt-4">
          <TabsList className="gap-4 bg-transparent flex-wrap">
            {tabItems.map((tab) => {
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className=" cursor-pointer data-[state=active]:bg-primary rounded-[6px] data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="basic_information">
            <MapRoomViewer
              rooms={unit?.rooms ?? []}
              url={unit?.floor_plan_image_url ?? ""}
            />

            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <HeaderSection title="Basic Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    id="property_id"
                    name="property_id"
                    type="text"
                    label="Property ID"
                    value={watch("property_id")}
                    onChange={(e) => setValue("property_id", e.target.value)}
                    errors={errors.property_id?.message}
                    placeholder="Enter Property ID"
                  />
                  <CustomInput
                    id="block_number"
                    name="block_number"
                    type="text"
                    label="Block Number"
                    value={watch("block_number")}
                    onChange={(e) => setValue("block_number", e.target.value)}
                    errors={errors.block_number?.message}
                    placeholder="Enter Block Number"
                  />
                  <CustomInput
                    id="floor"
                    name="floor"
                    type="text"
                    label="Floor"
                    value={watch("floor")}
                    onChange={(e) => setValue("floor", e.target.value)}
                    errors={errors.floor?.message}
                    placeholder="Enter Floor"
                  />
                  <CustomInput
                    id="unit_number"
                    name="unit_number"
                    type="text"
                    label="Unit Number"
                    value={watch("unit_number")}
                    onChange={(e) => setValue("unit_number", e.target.value)}
                    errors={errors.unit_number?.message}
                    placeholder="Enter Unit Number"
                  />
                  <SelectWithForm<schemaType>
                    name="rental_type"
                    title="Rental Type"
                    options={RENTAL_TYPES}
                  />
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
                  <CustomInput
                    id="business_partner_id"
                    name="business_partner_id"
                    type="text"
                    label="Business Partner ID"
                    value={watch("business_partner_id")}
                    onChange={(e) =>
                      setValue("business_partner_id", e.target.value)
                    }
                    errors={errors.business_partner_id?.message}
                    placeholder="Enter Business Partner ID"
                  />
                  <SelectWithForm<schemaType>
                    name="bedroom_count"
                    title="Bedroom Count"
                    options={BEDROOM_OPTIONS}
                  />
                  <SelectWithForm<schemaType>
                    name="bathroom_count"
                    title="Bathroom Count"
                    options={BATHROOM_OPTIONS}
                  />
                  <SelectWithForm<schemaType>
                    name="is_active"
                    title="Status"
                    options={STATUS_OPTIONS}
                  />
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
                  <CustomInput
                    id="service_fee_percent"
                    name="service_fee_percent"
                    type="text"
                    label="Service Fee Percent"
                    value={watch("service_fee_percent")}
                    onChange={(e) =>
                      setValue("service_fee_percent", e.target.value)
                    }
                    errors={errors.service_fee_percent?.message}
                    placeholder="Enter Service Fee Percent"
                  />
                  <CustomInput
                    id="profit_share_percent"
                    name="profit_share_percent"
                    type="text"
                    label="Profit Share Percent"
                    value={watch("profit_share_percent")}
                    onChange={(e) =>
                      setValue("profit_share_percent", e.target.value)
                    }
                    errors={errors.profit_share_percent?.message}
                    placeholder="Enter Profit Share Percent"
                  />
                  <div className="col-span-1 md:col-span-2">
                    <CustomInput
                      id="description"
                      label="Description"
                      type="textArea"
                      name="description"
                      value={watch("description")}
                      onChange={(e) => setValue("description", e.target.value)}
                      placeholder="Enter unit description"
                      className="bg-gray-100"
                      errors={errors.description?.message}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <CustomInput
                      id="remarks"
                      label="Remarks"
                      type="textArea"
                      name="remarks"
                      value={watch("remarks")}
                      onChange={(e) => setValue("remarks", e.target.value)}
                      placeholder="Enter any additional remarks"
                      className="bg-gray-100"
                      errors={errors.remarks?.message}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="text-white"
                    disabled={updateUnitMutation.isPending}
                  >
                    {updateUnitMutation.isPending
                      ? "Updating..."
                      : "Update Unit"}
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </TabsContent>
          <TabsContent value="rooms" className="md:min-h-[80vh]">
            <Datatable<Room>
              columns={roomColumns}
              data={unit?.rooms ?? []}
              isPending={false}
              pagination={pagination}
              setPagination={setPagination}
              rowKey={(item: Room) => item.id}
              // isFilter={false}
            />
          </TabsContent>
          <TabsContent value="carParks" className="md:min-h-[80vh]">
            <Datatable<Carpark>
              columns={carParksColumns}
              data={unit?.carparks ?? []}
              isPending={false}
              pagination={pagination}
              setPagination={setPagination}
              rowKey={(item: Carpark) => item.id}
              // isFilter={false}
            />
          </TabsContent>
          <TabsContent value="equipment">
            <Datatable<EquipmentType>
              columns={equipmentColumns}
              data={unit?.equipment ?? []}
              isPending={false}
              pagination={pagination}
              setPagination={setPagination}
              rowKey={(item: EquipmentType) => item.id}
              // isFilter={false}
            />
          </TabsContent>
          <TabsContent value="setting">
            {unit?.setting ? (
              <FormProvider {...settingForm}>
                <form onSubmit={handleSettingSubmit(onSettingSubmit)}>
                  <HeaderSection title="Property Settings" />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <CustomInput
                      id="vr_url"
                      name="vr_url"
                      type="text"
                      label="VR URL"
                      value={watchSetting("vr_url") ?? ""}
                      onChange={(e) =>
                        setSettingValue("vr_url", e.target.value || null)
                      }
                      errors={settingErrors.vr_url?.message}
                      placeholder="Enter VR URL"
                    />
                    <CustomInput
                      id="size_sqft"
                      name="size_sqft"
                      type="text"
                      label="Size (sqft)"
                      value={watchSetting("size_sqft")}
                      onChange={(e) =>
                        setSettingValue("size_sqft", e.target.value)
                      }
                      errors={settingErrors.size_sqft?.message}
                      placeholder="Enter Size"
                    />
                    <CustomInput
                      id="no_bed"
                      name="no_bed"
                      type="number"
                      label="Number of Beds"
                      value={watchSetting("no_bed") ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSettingValue(
                          "no_bed",
                          value === "" ? null : Number(value)
                        );
                      }}
                      errors={settingErrors.no_bed?.message}
                      placeholder="Enter Number of Beds"
                    />
                    <CustomInput
                      id="no_bath"
                      name="no_bath"
                      type="number"
                      label="Number of Baths"
                      value={watchSetting("no_bath") ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSettingValue(
                          "no_bath",
                          value === "" ? null : Number(value)
                        );
                      }}
                      errors={settingErrors.no_bath?.message}
                      placeholder="Enter Number of Baths"
                    />
                    <SelectWithForm<settingSchemaType>
                      name="preferred_gender"
                      title="Preferred Gender"
                      options={GENDER_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="preferred_race"
                      title="Preferred Race"
                      options={RACE_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="rental"
                      title="Rental"
                      options={RENTAL_OPTIONS}
                    />
                  </div>

                  {/* Facilities */}
                  <div className="mt-6">
                    <HeaderSection title="Facilities" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <SelectWithForm<settingSchemaType>
                      name="cooking_facilities"
                      title="Cooking Facilities"
                      options={YES_NO_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="fridge"
                      title="Fridge"
                      options={YES_NO_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="wifi"
                      title="WiFi"
                      options={YES_NO_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="washing_machine"
                      title="Washing Machine"
                      options={YES_NO_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="cleaning"
                      title="Cleaning"
                      options={YES_NO_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="water_heater"
                      title="Water Heater"
                      options={YES_NO_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="dryer"
                      title="Dryer"
                      options={YES_NO_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="balcony"
                      title="Balcony"
                      options={YES_NO_OPTIONS}
                    />
                  </div>

                  {/* Room Details */}
                  <div className="mt-6">
                    <HeaderSection title="Room Details" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <SelectWithForm<settingSchemaType>
                      name="bed_type"
                      title="Bed Type"
                      options={BED_TYPE_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="bath_type"
                      title="Bath Type"
                      options={BATH_TYPE_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="aircond"
                      title="Air Conditioning"
                      options={AIRCOND_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="window"
                      title="Window"
                      options={WINDOW_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="type_of_walls"
                      title="Type of Walls"
                      options={WALL_TYPE_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="furnishing"
                      title="Furnishing"
                      options={FURNISHING_OPTIONS}
                    />
                  </div>

                  {/* Furnishing Details */}
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <CustomInput
                      id="furnishing_details"
                      label="Furnishing Details"
                      type="textArea"
                      name="furnishing_details"
                      value={watchSetting("furnishing_details") ?? ""}
                      onChange={(e) =>
                        setSettingValue(
                          "furnishing_details",
                          e.target.value || null
                        )
                      }
                      placeholder="Enter furnishing details"
                      className="bg-gray-100"
                      errors={settingErrors.furnishing_details?.message}
                    />
                  </div>

                  {/* Electricity */}
                  <div className="mt-6">
                    <HeaderSection title="Electricity" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <SelectWithForm<settingSchemaType>
                      name="meter_type"
                      title="Meter Type"
                      options={METER_TYPE_OPTIONS}
                    />
                    <SelectWithForm<settingSchemaType>
                      name="electricity_tracking"
                      title="Electricity Tracking"
                      options={ELECTRICITY_TRACKING_OPTIONS}
                    />
                    <CustomInput
                      id="electricity_rate"
                      name="electricity_rate"
                      type="text"
                      label="Electricity Rate"
                      value={watchSetting("electricity_rate")}
                      onChange={(e) =>
                        setSettingValue("electricity_rate", e.target.value)
                      }
                      errors={settingErrors.electricity_rate?.message}
                      placeholder="Enter Electricity Rate"
                    />
                  </div>

                  <DialogFooter className="mt-6">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="text-white"
                      disabled={updateSettingMutation.isPending}
                    >
                      {updateSettingMutation.isPending
                        ? "Updating..."
                        : "Update Settings"}
                    </Button>
                  </DialogFooter>
                </form>
              </FormProvider>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No settings found for this unit.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditUnit;
