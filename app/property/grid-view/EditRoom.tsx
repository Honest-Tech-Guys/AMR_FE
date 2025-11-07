"use client";

import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import useUpdateRoom, {
  UpdateRoomInput,
} from "@/lib/services/hooks/useUpdateRoom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Room } from "@/types/RoomType";
import MapRoomViewer from "@/components/MapRoomViewer";
import useUpdatePropertySetting, {
  UpdatePropertySettingInput,
} from "@/lib/services/hooks/useUpdatePropertySetting";
import Datatable from "@/components/datatable";
import EquipmentType from "@/types/EquipmentType";
import { equipmentColumns } from "../[id]/unit/EditUnit";
import { PaginationData } from "@/components/ui/pagination";

// Schema & type
const schema = yup.object({
  name: yup.string().required("Room name is required"),
  status: yup.string().required("Status is required"),
  description: yup.string().required("Description is required"),
  remarks: yup.string().nullable().default(null),
});

type schemaType = yup.InferType<typeof schema>;

interface EditRoomProps {
  room?: Room;
  onSuccess?: () => void;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}
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
  cooking_facilities: yup.string().required("Cooking facilities is required"),
  fridge: yup.string().required("Fridge is required"),
  wifi: yup.string().required("Wifi is required"),
  washing_machine: yup.string().required("Washing machine is required"),
  cleaning: yup.string().required("Cleaning is required"),
  water_heater: yup.string().required("Water heater is required"),
  dryer: yup.string().required("Dryer is required"),
  balcony: yup.string().required("Balcony is required"),
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

const EditRoom = ({ room, onSuccess, open, onOpenChange }: EditRoomProps) => {
  const updateRoomMutation = useUpdateRoom();

  const form = useForm<schemaType>({
    mode: "onTouched",
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      status: "",
      description: "",
      remarks: null,
    },
  });

  const {
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  // Populate form when room data is available
  useEffect(() => {
    if (room) {
      reset({
        name: room.name || "",
        status: room.status || "",
        description: room.description || "",
        remarks: room.remarks || "",
      });
    }
  }, [room, reset]);

  const STATUS_OPTIONS = [
    { id: "Vacant", name: "Vacant" },
    { id: "Occupied", name: "Occupied" },
  ];
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const updateSettingMutation = useUpdatePropertySetting();
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    if (!room?.id) {
      console.error("No room ID found");
      toast.error("No room selected for update");
      return;
    }

    const updateData: UpdateRoomInput = {
      id: room.id,
      unit_id: room.unit_id,
      name: data.name,
      coordinates: room.coordinates,
      status: data.status as "Vacant" | "Occupied",
      description: data.description,
      remarks: data.remarks || "",
    };

    // Show loading toast
    const loadingToast = toast.loading("Updating room...");

    updateRoomMutation.mutate(updateData, {
      onSuccess: () => {
        onSuccess?.();
        // Reset form after successful update
        reset();
        toast.dismiss(loadingToast);
        toast.success("Room updated successfully!");
        // Close the dialog
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Update room error:", error);
        toast.dismiss(loadingToast);
        toast.error("Failed to update room. Please try again.");
      },
    });
  };

  const tabItems = [
    { label: "Basic", value: "basic_information" },
    { label: "Equipment", value: "equipment" },
    { label: "Setting", value: "setting" },
  ];
  const settingForm = useForm<settingSchemaType>({
    mode: "onTouched",
    resolver: yupResolver(settingSchema) as any,
    defaultValues: {
      vr_url: null,
      no_bed: null,
      no_bath: null,
      preferred_gender: null,
      preferred_race: null,
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
  useEffect(() => {
    if (room?.setting) {
      const setting = room.setting;
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
  }, [room?.setting, resetSetting]);

  // Settings form options
  const YES_NO_OPTIONS = [
    { id: "No", name: "No" },
    { id: "Yes", name: "Yes" },
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
  const onSettingSubmit: SubmitHandler<settingSchemaType> = (data) => {
    if (!room?.setting?.id) {
      toast.error("No setting found to update");
      return;
    }

    // Convert string IDs from select components to numbers for numeric fields
    const updateData: UpdatePropertySettingInput = {
      room_id: room.setting.id,
      ...data,
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="md:max-w-[1000px] bg-white z-400 md:p-10 max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white">
            View Room
          </div>
        </DialogHeader>
        <Tabs defaultValue="basic_information" className="mt-4">
          <TabsList className="gap-4 bg-transparent flex-wrap">
            {tabItems.map((tab) => {
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="cursor-pointer data-[state=active]:bg-primary rounded-[6px] data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="basic_information">
            {room && (
              <MapRoomViewer
                rooms={[room]}
                url={room.unit?.floor_plan_image_url ?? ""}
              />
            )}

            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <HeaderSection title="Basic Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    id="name"
                    name="name"
                    type="text"
                    label="Room Name"
                    value={watch("name")}
                    onChange={(e) => setValue("name", e.target.value)}
                    errors={errors.name?.message}
                    placeholder="Enter Room Name"
                  />
                  <SelectWithForm<schemaType>
                    name="status"
                    title="Status"
                    options={STATUS_OPTIONS}
                  />
                  <div className="col-span-1 md:col-span-2">
                    <CustomInput
                      id="description"
                      label="Description"
                      type="textArea"
                      name="description"
                      value={watch("description")}
                      onChange={(e) => setValue("description", e.target.value)}
                      placeholder="Enter room description"
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
                      value={watch("remarks") ?? ""}
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
                    disabled={updateRoomMutation.isPending}
                  >
                    {updateRoomMutation.isPending
                      ? "Updating..."
                      : "Update Room"}
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </TabsContent>
          <TabsContent value="equipment">
            <Datatable<EquipmentType>
              columns={equipmentColumns}
              data={room?.equipment ?? []}
              isPending={false}
              pagination={pagination}
              setPagination={setPagination}
              rowKey={(item: EquipmentType) => item.id}
              // isFilter={false}
            />
          </TabsContent>
          <TabsContent value="setting">
            {room?.setting ? (
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
                      type="number"
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
                      type="number"
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

export default EditRoom;
