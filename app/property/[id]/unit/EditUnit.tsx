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
import HeaderSection from "@/components/HeaderSection";
import useUpdateUnit, {
  UpdateUnitInput,
} from "@/lib/services/hooks/useUpdateUnit";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Datatable, { Column } from "@/components/datatable";
import RoomDropDown from "../../grid-view/RoomDropDown";
import { PaginationData } from "@/components/ui/pagination";
import getMeterAndLock from "@/components/General/GetMeterAndLock";
import CarParksDropDown from "../../grid-view/CarParksDropDown";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
type schemaType = yup.InferType<typeof schema>;

interface EditUnitProps {
  unit?: Unit;
  onSuccess?: () => void;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}

const EditUnit = ({ unit, onSuccess, open, onOpenChange }: EditUnitProps) => {
  const updateUnitMutation = useUpdateUnit();
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
  const tabItems = [
    { label: "Basic ", value: "basic_information" },
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

      <DialogContent className="md:max-w-[1000px]  bg-white z-400 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            View Unit
          </div>
        </DialogHeader>
        <Tabs defaultValue="basic_information" className="mt-4">
          <TabsList className="gap-4 bg-transparent flex-wrap">
            {tabItems.map((tab) => {
              if (
                unit?.rental_type === "Whole Unit" &&
                tab.value !== "basic_information"
              ) {
                return null;
              }
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className=" data-[state=active]:bg-primary rounded-[6px] data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="basic_information">
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
              isFilter={false}
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
              isFilter={false}
            />
          </TabsContent>

          {/* Placeholder for other tab contents if needed later */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditUnit;
