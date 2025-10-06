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
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import PhoneInput from "@/components/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MultiFileUpload from "@/components/input-11";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import useAddUnit from "@/lib/services/hooks/useAddUnit";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import AddRoom from "../../[id]/unit/AddRoom";
import AddCarPark from "../../[id]/unit/AddCarpark";
import useGetBeneficiariesSelection from "@/lib/services/hooks/useGetbeneficiariesSelection";
import { FileData } from "@/types/FileData";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { useQueryClient } from "@tanstack/react-query";

// Schema & type
const schema = yup.object({
  tenant_management_operator: yup
    .string()
    .required("Tenant Management Operator is required"),
  unit_number: yup.string().required("Unit Number is required"),
  block: yup.string().required("Block  is required"),
  floor: yup.string().required("Floor  is required"),
  remarks: yup.string().optional().nullable(),
  description: yup.string().optional().nullable(),
  // address: yup.string().required("Address is required"),
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
  rental_type: yup.string().required("Rental type is required"),
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
    .min(1, "Floor plan image is required")
    .required("Floor plan image is required"),
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
    .optional(),
  rooms: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        name: yup.string().required("Room name is required"),
        description: yup.string().required("Room description is required"),
      })
    )
    .default([]),
  carparks: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        location: yup.string().required("Carpark location is required"),
        type: yup.string().required("Carpark type is required"),
      })
    )
    .default([]),
});

type schemaType = yup.InferType<typeof schema>;

interface Props {
  id: number;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void; // handler from parent
}
const CreateUnit = ({ id, open, onOpenChange }: Props) => {
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isCarparkDialogOpen, setIsCarparkDialogOpen] = useState(false);

  const form = useForm<schemaType>({
    mode: "onTouched",
    defaultValues: {
      meeting_room: false,
      game_room: false,
      basketball_court: false,
      sauna: false,
      free_text: false,
      is_activated: false,
      rental_type: "whole",
      rooms: [],
      carparks: [],
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

  const PartnerType = [
    { id: "1", name: "Apartment" },
    { id: "2", name: "Condominium" },
    { id: "3", name: "Flat " },
    { id: "4", name: "Landed" },
    { id: "5", name: "Townhouse" },
  ];

  const { mutate, isPending, isSuccess, isError } = useAddUnit();

  // Watch the current rooms and carparks
  const currentRooms = watch("rooms") || [];
  const currentCarparks = watch("carparks") || [];
  const queryClient = useQueryClient();
  const addRoom = (room: { name: string; description: string }) => {
    const newRoom = {
      id: Date.now().toString(),
      name: room.name,
      description: room.description,
    };
    setValue("rooms", [...currentRooms, newRoom]);
    setIsRoomDialogOpen(false);
  };

  const removeRoom = (roomId: string) => {
    setValue(
      "rooms",
      currentRooms.filter((room) => room.id !== roomId)
    );
  };

  const addCarpark = (carpark: { location: string; type: string }) => {
    const newCarpark = {
      id: Date.now().toString(),
      location: carpark.location,
      type: carpark.type,
    };
    setValue("carparks", [...currentCarparks, newCarpark]);
    setIsCarparkDialogOpen(false);
  };
  function base64ToFile(fileData: FileData): File {
    const arr = fileData.base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || fileData.type;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileData.name, { type: mime });
  }

  // Convert FileData[] → FileList
  function fileDataToFileList(fileDataList: FileData[]): FileList {
    const dataTransfer = new DataTransfer();
    fileDataList.forEach((fd) => {
      dataTransfer.items.add(base64ToFile(fd));
    });
    return dataTransfer.files;
  }
  const removeCarpark = (carparkId: string) => {
    setValue(
      "carparks",
      currentCarparks.filter((carpark) => carpark.id !== carparkId)
    );
  };
  const [beneficiaries, setBeneficiaries] = useState([]);
  const { data } = useGetBeneficiariesSelection();
  useEffect(() => {
    if (data) {
      const dataT = data.map((beneficiary) => {
        return { id: `${beneficiary.id}`, name: beneficiary.name };
      });
      setBeneficiaries(dataT as never);
    }
  }, [data]);
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    const payload: any = {
      property_id: id,
      unit_number: data.unit_number,
      block: data.block,
      floor: data.floor,
      rental_type: data.rental_type,
      square_feet: parseInt(data.square_feet),
      bedroom_count: Number(data.bedroom),
      bathroom_count: Number(data.bathroom),
      floor_plan_image: fileDataToFileList(
        (data.floor_plan_image || []) as FileData[]
      )[0],

      // unit_image: data.unit_image?.[0]?.base64 || null,
      unit_image: fileDataToFileList((data.unit_image || []) as FileData[]),
      description: data.description || "",
      is_activated: parseInt(data.is_activated ? "1" : "0"),
      beneficiary_id: parseInt(data.beneficiary),
      remarks: data.remarks || "",
      service_fee_percentage: data.service_fee.toString(),
      profit_sharing_percentage: data.profit_sharing.toString(),
    };
    if (data.rental_type === "Sublet") {
      payload.carparks = data.carparks;
      payload.rooms = data.rooms;
    }
    mutate(payload, {
      onSuccess: () => {
        toast.success("Unit created successfully!");
        queryClient.invalidateQueries({ queryKey: ["GetPropertiesList"] });
        reset();
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error((err as any)?.message || "Failed to create unit.");
      },
    });
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* <DialogTrigger asChild>
          <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
            Add Unit
          </Button>
        </DialogTrigger> */}
        <DialogContent
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto"
        >
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <HeaderSection title="Basic Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div>
                  <SelectWithForm<schemaType>
                    name="property_id"
                    title="Property Name"
                    options={PartnerType}
                  />
                </div> */}
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
                <CustomInput
                  id="block"
                  name="block"
                  type="text"
                  label="Block"
                  value={watch("block")}
                  onChange={(e) => setValue("block", e.target.value)}
                  errors={errors.block?.message}
                  placeholder="Enter Block "
                />
                <CustomInput
                  id="floor"
                  name="floor"
                  type="text"
                  label="Floor"
                  value={watch("floor")}
                  onChange={(e) => setValue("floor", e.target.value)}
                  errors={errors.floor?.message}
                  placeholder="Enter Floor "
                />
                <div>
                  <SelectWithForm<schemaType>
                    name="tenant_management_operator"
                    title="Tenant management operator"
                    options={PartnerType}
                  />
                </div>
                <div>
                  <Label className="mb-3">Rental Type</Label>
                  <Controller
                    control={control}
                    name="rental_type"
                    render={({ field }) => (
                      <ToggleGroup
                        variant="outline"
                        type="single"
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) field.onChange(value);
                        }}
                      >
                        <ToggleGroupItem
                          className="px-3"
                          value="Whole Unit"
                          aria-label="Whole Unit"
                        >
                          Whole Unit
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          className="px-3"
                          value="Sublet"
                          aria-label="Sublet"
                        >
                          Sublet
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  {errors.rental_type && (
                    <span className="text-red-500 text-sm">
                      {errors.rental_type.message}
                    </span>
                  )}
                </div>
              </div>
              {watch("rental_type") === "Sublet" && (
                <>
                  <div className="col-span-2 mt-6">
                    <HeaderSection title="Rooms" />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Room Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentRooms.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center text-gray-500"
                            >
                              No rooms added yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentRooms.map((room) => (
                            <TableRow key={room.id}>
                              <TableCell className="font-medium">
                                {room.name}
                              </TableCell>
                              <TableCell className="font-medium">
                                {room.description}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRoom(room.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    <div className="mt-4">
                      <AddRoom addRoom={addRoom} />
                    </div>
                  </div>
                  <div className="col-span-2 mt-6">
                    <HeaderSection title="Carparks" />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentCarparks.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center text-gray-500"
                            >
                              No carparks added yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentCarparks.map((carpark) => (
                            <TableRow key={carpark.id}>
                              <TableCell className="font-medium">
                                {carpark.location}
                              </TableCell>
                              <TableCell className="font-medium">
                                {carpark.type}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCarpark(carpark.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    <div className="mt-4">
                      <AddCarPark addCarpark={addCarpark} />
                    </div>
                  </div>
                </>
              )}

              {/* { } */}
              <HeaderSection title="Floor Plan Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  id="bedroom"
                  name="bedroom"
                  type="number"
                  label="Bedroom"
                  value={watch("bedroom")}
                  onChange={(e) => setValue("bedroom", e.target.value)}
                  errors={errors.bedroom?.message}
                  placeholder="Enter Bedroom"
                />
                <CustomInput
                  id="bathroom"
                  name="bathroom"
                  type="number"
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
                    render={({ field: { onChange, value } }) => (
                      <MultiFileUpload
                        isMulti={false}
                        field="floorPlanImage"
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
                <div className="space-y-2 ">
                  <span className="font-semibold">Unit Image (Optional)</span>
                  <Controller
                    control={control}
                    name="unit_image"
                    render={({ field: { onChange, value } }) => (
                      <MultiFileUpload
                        isMulti={false}
                        field="unitImage"
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
                    id="description"
                    label="Description"
                    type="textArea"
                    name="description"
                    value={watch("description")}
                    onChange={(e) => setValue("description", e.target.value)}
                    placeholder="E.g describe more about the unit"
                    className="bg-gray-100 rounded-[6px]"
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
                    placeholder="E.g describe more about the reason for change"
                    className="bg-gray-100 rounded-[6px]"
                    errors={errors.remarks?.message}
                  />
                </div>
              </div>
              <HeaderSection title="Other Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SelectWithForm<schemaType>
                    name="beneficiary"
                    title="Beneficiary"
                    options={beneficiaries}
                  />
                </div>
                <div>
                  <Label className="mb-3">Is Activated</Label>
                  <Controller
                    control={control}
                    name="is_activated"
                    render={({ field }) => (
                      <ToggleGroup
                        variant="outline"
                        type="single"
                        value={field.value ? "yes" : "no"}
                        onValueChange={(value) => {
                          field.onChange(value === "yes");
                        }}
                      >
                        <ToggleGroupItem value="yes" aria-label="Yes">
                          Yes
                        </ToggleGroupItem>
                        <ToggleGroupItem value="no" aria-label="No">
                          No
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  {errors.is_activated && (
                    <span className="text-red-500 text-sm">
                      {errors.is_activated.message}
                    </span>
                  )}
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
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateUnit;
