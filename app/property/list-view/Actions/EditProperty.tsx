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
import useUpdateProperty, {
  UpdatePropertyInput,
} from "@/lib/services/hooks/useUpdateProperties";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Datatable, { Column } from "@/components/datatable";
import UnitDropdown from "../../grid-view/UnitDropDown";
import { PaginationData } from "@/components/ui/pagination";
import useGetOwnersSelection from "@/lib/services/hooks/useGetOwnerSelection";
import { Property } from "@/types/PropertyType";
import { Unit } from "@/types/UnitType";

const unitColumns: Column<Unit>[] = [
  {
    title: "Block/Floor/Unit Number",
    key: "block_floor_unit_number",
    sortable: true,
    className: "pl-6 py-4",
    render: (unit) => (
      <div className="pl-4 text-primary font-medium">
        {unit.block_floor_unit_number ?? "-"}
      </div>
    ),
  },
  {
    title: "Rental Type",
    key: "rental_type",
    sortable: true,
    render: (unit) => <div>{unit.rental_type}</div>,
  },
  {
    title: "Bed Room Count",
    key: "bed_room_count",
    render: (unit) => <div>{unit.bedroom_count}</div>,
  },
  {
    title: "Bath Room Count",
    key: "bath_room_count",
    render: (unit) => <div>{unit.bathroom_count}</div>,
  },
  {
    title: "Action",
    key: "action",
    sortable: true,
    render: (unit) => <UnitDropdown unit={unit} />,
  },
];

// Schema
const schema = yup.object({
  property_name: yup.string().required("Property name is required"),
  property_type: yup.string().required("Property type is required"),
  owner_id: yup.string().required("Owner is required"),
  owner_phone_number: yup.string().required("Owner phone number is required"),
  contact_name: yup.string().required("Contact name is required"),
  contact_phone_number: yup
    .string()
    .required("Contact phone number is required"),
  remarks: yup.string().nullable(),
  address_line_1: yup.string().nullable(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postcode: yup.string().required("Postcode is required"),
  facilities: yup.string().nullable(),
});

type SchemaType = yup.InferType<typeof schema>;

interface EditPropertyProps {
  property?: Property;
  onSuccess?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProperty = ({
  property,
  onSuccess,
  open,
  onOpenChange,
}: EditPropertyProps) => {
  const updatePropertyMutation = useUpdateProperty();
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const [owners, setOwners] = useState<{ id: string; name: string }[]>([]);
  const { data: ownersData } = useGetOwnersSelection();

  const form = useForm<SchemaType>({
    mode: "onTouched",
    resolver: yupResolver(schema) as any,
    defaultValues: {
      property_name: "",
      property_type: "",
      owner_id: "",
      owner_phone_number: "",
      contact_name: "",
      contact_phone_number: "",
      remarks: "",
      address_line_1: "",
      city: "",
      state: "",
      postcode: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = form;

  // Populate owners
  useEffect(() => {
    if (ownersData) {
      setOwners(
        ownersData.map((owner) => ({ id: `${owner.id}`, name: owner.name }))
      );
    }
  }, [ownersData]);

  // Populate form when property changes
  useEffect(() => {
    if (property) {
      reset({
        property_name: property.property_name,
        property_type: property.property_type,
        owner_id: `${property.owner_id}`,
        owner_phone_number: property.contact_phone || "",
        contact_name: property.contact_name || "",
        contact_phone_number: property.contact_phone || "",
        remarks: property.remarks || "",
        address_line_1: property.address_line_1 || "",
        city: property.city,
        state: property.state,
        postcode: property.postcode,
      });
    }
  }, [property, reset]);

  const facilities = [
    { id: "meeting_room" as const, label: "Meeting Room" },
    { id: "game_room" as const, label: "Game Room" },
    { id: "basketball_court" as const, label: "Basketball Court" },
    { id: "sauna" as const, label: "Sauna" },
    { id: "free_text" as const, label: "Free Text" },
  ];

  const tabItems = [
    { label: "Basic", value: "basic_information" },
    { label: "Units", value: "units" },
  ];

  const PartnerType = [
    { id: "Apartment", name: "Apartment" },
    { id: "Condominium", name: "Condominium" },
    { id: "Flat", name: "Flat" },
    { id: "Landed", name: "Landed" },
    { id: "Townhouse", name: "Townhouse" },
  ];

  const cities = [
    { id: "johor", name: "Johor" },
    { id: "kedah", name: "Kedah" },
    { id: "kelantan", name: "Kelantan" },
    { id: "malacca", name: "Malacca" },
    { id: "negeriSembilan", name: "Negeri Sembilan" },
    { id: "pahang", name: "Pahang" },
    { id: "perak", name: "Perak" },
    { id: "perlis", name: "Perlis" },
    { id: "penang", name: "Penang" },
    { id: "selangor", name: "Selangor" },
    { id: "terengganu", name: "Terengganu" },
    { id: "sabah", name: "Sabah" },
    { id: "sarawak", name: "Sarawak" },
    { id: "kualaLumpur", name: "Kuala Lumpur" },
    { id: "putrajaya", name: "Putrajaya" },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    if (!property?.id) return toast.error("No property selected");

    const payload: UpdatePropertyInput = {
      id: property.id,
      property_name: data.property_name,
      property_type: data.property_type,
      owner_id: parseInt(data.owner_id),
      contact_name: data.contact_name,
      contact_phone: data.contact_phone_number,
      remarks: data.remarks || "",
      address_line_1: data.address_line_1 || "",
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      facilities: data?.facilities || "",
    };

    const loadingToast = toast.loading("Updating property...");

    updatePropertyMutation.mutate(payload, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success("Property updated successfully");
        onSuccess?.();
        onOpenChange(false);
      },
      onError: () => {
        toast.dismiss(loadingToast);
        toast.error("Failed to update property");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="text-2xl font-bold">Edit Property</div>
        </DialogHeader>
        <Tabs defaultValue="basic_information" className="mt-4">
          <TabsList className="gap-4 flex-wrap bg-transparent">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-[6px]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic_information">
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
                  />
                  <SelectWithForm<SchemaType>
                    name="property_type"
                    title="Property Type"
                    options={PartnerType}
                  />
                  <SelectWithForm<SchemaType>
                    name="owner_id"
                    title="Owner"
                    options={owners}
                  />
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Owner Phone Number
                    </label>
                    <Controller
                      control={control}
                      name="owner_phone_number"
                      render={({ field }) => <PhoneInput {...field} />}
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
                  />
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Contact Phone Number
                    </label>
                    <Controller
                      control={control}
                      name="contact_phone_number"
                      render={({ field }) => <PhoneInput {...field} />}
                    />
                    {errors.contact_phone_number && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.contact_phone_number.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <CustomInput
                      id="remarks"
                      label="Remarks"
                      type="textArea"
                      name="remarks"
                      value={watch("remarks")}
                      onChange={(e) => setValue("remarks", e.target.value)}
                      errors={errors.remarks?.message}
                    />
                  </div>
                  <div className="col-span-2">
                    <HeaderSection title="Address Information" />
                  </div>
                  <SelectWithForm<SchemaType>
                    name="state"
                    title="State"
                    options={cities}
                  />
                  <CustomInput
                    id="city"
                    name="city"
                    type="text"
                    value={watch("city")}
                    label="City"
                    onChange={(e) => setValue("city", e.target.value)}
                    errors={errors.city?.message}
                    placeholder="Enter City"
                  />
                  <CustomInput
                    id="address_line_1"
                    name="address_line_1"
                    type="text"
                    value={watch("address_line_1")}
                    label="Address"
                    onChange={(e) => setValue("address_line_1", e.target.value)}
                    errors={errors.address_line_1?.message}
                  />
                  <CustomInput
                    id="postcode"
                    name="postcode"
                    type="text"
                    value={watch("postcode")}
                    label="Postcode"
                    onChange={(e) => setValue("postcode", e.target.value)}
                    errors={errors.postcode?.message}
                  />
                  <div className="col-span-2">
                    <HeaderSection title="Facilities & Amenities" />
                  </div>
                  <div className="col-span-2">
                    <CustomInput
                      id="facilities"
                      label="facilities"
                      type="textArea"
                      name="facilities"
                      value={watch("facilities")}
                      onChange={(e) => setValue("facilities", e.target.value)}
                      errors={errors.facilities?.message}
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
                    disabled={updatePropertyMutation.isPending}
                  >
                    {updatePropertyMutation.isPending
                      ? "Updating..."
                      : "Update Property"}
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </TabsContent>

          {/* Units Tab */}
          <TabsContent value="units" className="md:min-h-[70vh]">
            <Datatable<Unit>
              columns={unitColumns}
              data={property?.units ?? []}
              isPending={false}
              pagination={pagination}
              setPagination={setPagination}
              rowKey={(item: Unit) => item.id}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditProperty;
