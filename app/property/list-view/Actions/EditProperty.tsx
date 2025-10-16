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

// Schema & type
const schema = yup.object({
  postcode: yup.string().required("Postcode is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  property_name: yup.string().required("Property name is required"),
  property_type: yup.string().required("Property type is required"),
  owner_id: yup.string().required("owner is required"),
  owner_phone_number: yup.string().required(""),
  contact_name: yup.string().required("owner is required"),
  contact_phone_number: yup.string().required(""),
  remarks: yup.string().nullable(),
  address_line_1: yup.string().nullable(),
  meeting_room: yup.boolean().default(false),
  game_room: yup.boolean().default(false),
  basketball_court: yup.boolean().default(false),
  sauna: yup.boolean().default(false),
  free_text: yup.boolean().default(false),
});
const unitColumns: Column<Unit>[] = [
  {
    title: "Block/Floor/Unit Number",
    key: "block_floor_unit_number",
    sortable: true,
    className: "pl-6 py-4",
    render: (unit) => (
      <div className="pl-4 text-primary font-medium ">
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
    render: (unit) => (
      <div>
        <UnitDropdown unit={unit} />
      </div>
    ),
  },
];
type schemaType = yup.InferType<typeof schema>;

interface EditPropertyProps {
  property?: Property;
  onSuccess?: () => void;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void; // handler from parent
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
  const form = useForm<schemaType>({
    mode: "onTouched",
    defaultValues: {
      property_name: "",
      property_type: "",
      owner_id: "",
      owner_phone_number: "",
      remarks: "",
      address_line_1: "",
      city: "",
      state: "",
      postcode: "",
      meeting_room: false,
      game_room: false,
      basketball_court: false,
      sauna: false,
      free_text: false,
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

  // Populate form when property data is available
  useEffect(() => {
    if (property) {
      reset({
        property_name: property.property_name,
        property_type: property.property_type,
        owner_id: `${property.owner_id}` || "",
        owner_phone_number: property.contact_phone || "",
        contact_name: property.contact_name || "",
        contact_phone_number: property.contact_phone || "",
        remarks: property.remarks || "",
        address_line_1: property.address_line_1 || "",
        city: property.city,
        state: property.state,
        postcode: property.postcode,
        meeting_room: property.facilities.includes("meeting_room"),
        game_room: property.facilities.includes("game_room"),
        basketball_court: property.facilities.includes("basketball_court"),
        sauna: property.facilities.includes("sauna"),
        free_text: property.facilities.includes("free_text"),
      });
    }
  }, [property, reset]);

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
  ];
  const PartnerType = [
    { id: "Apartment", name: "Apartment" },
    { id: "Condominium", name: "Condominium" },
    { id: "Flat", name: "Flat" },
    { id: "Landed", name: "Landed" },
    { id: "Townhouse", name: "Townhouse" },
  ];
  const tabItems = [
    { label: "Basic ", value: "basic_information" },
    { label: "Units", value: "units" },
  ];
  const facilities = [
    { id: "meeting_room" as const, label: "Meeting Room" },
    { id: "game_room" as const, label: "Game Room" },
    { id: "basketball_court" as const, label: "Basketball Court" },
    { id: "sauna" as const, label: "Sauna" },
    { id: "free_text" as const, label: "Free Text" },
  ];

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    if (!property?.id) {
      console.error("No property ID found");
      toast.error("No property selected for update");
      return;
    }

    const facilitiesList = facilities
      .filter((f) => data[f.id]) // only where checkbox is true
      .map((f) => f.id);

    const updateData: UpdatePropertyInput = {
      id: property.id,
      property_name: data.property_name,
      property_type: data.property_type,
      owner_id: parseInt(data.owner_id),
      // owner_phone_number: data.owner_phone_number,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone_number,
      remarks: data.remarks || "",
      address_line_1: data.address_line_1 as string,
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      facilities: facilitiesList,
    };

    // Show loading toast
    const loadingToast = toast.loading("Updating property...");

    updatePropertyMutation.mutate(updateData, {
      onSuccess: () => {
        onSuccess?.();
        // Reset form after successful update
        reset();
        toast.dismiss(loadingToast);
        toast.success("Property updated successfully!");
        // Close the dialog
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Update property error:", error);
        toast.dismiss(loadingToast);
        toast.error("Failed to update property. Please try again.");
      },
    });
  };
  const [owners, setOwners] = useState([]);
  const { data } = useGetOwnersSelection();
  useEffect(() => {
    if (data) {
      const dataT = data.map((owner) => {
        return { id: `${owner.id}`, name: owner.name };
      });
      setOwners(dataT as never);
    }
  }, [data]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Edit Property
        </Button>
      </DialogTrigger> */}

      <DialogContent className="md:max-w-[1000px]  bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            View Property
          </div>
        </DialogHeader>
        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="gap-4 bg-transparent flex-wrap">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className=" cursor-pointer data-[state=active]:bg-primary rounded-[6px] data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
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
                    placeholder="Enter Property Name"
                  />
                  <SelectWithForm<schemaType>
                    name="property_type"
                    title="Property Type"
                    options={PartnerType}
                  />
                  <SelectWithForm<schemaType>
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
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          placeholder="Enter Owner Number"
                        />
                      )}
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
                    placeholder="Enter Contact Name"
                  />
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Contact Phone Number
                    </label>
                    <Controller
                      control={control}
                      name="contact_phone_number"
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          placeholder="Enter Contact Number"
                        />
                      )}
                    />
                    {errors.contact_phone_number && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.contact_phone_number.message}
                      </p>
                    )}
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
                <HeaderSection title="Address Information" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <SelectWithForm<schemaType>
                    name="city"
                    title="City"
                    options={cities}
                  />
                  <CustomInput
                    id="state"
                    name="state"
                    type="text"
                    value={watch("state")}
                    label="State"
                    onChange={(e) => setValue("state", e.target.value)}
                    errors={errors.state?.message}
                    placeholder="Enter State"
                  />
                  <CustomInput
                    id="address_line_1"
                    name="address_line_1"
                    type="text"
                    value={watch("address_line_1")}
                    label="Address"
                    onChange={(e) => setValue("address_line_1", e.target.value)}
                    errors={errors.address_line_1?.message}
                    placeholder="Enter Address"
                  />
                  <CustomInput
                    id="postcode"
                    name="postcode"
                    type="text"
                    value={watch("postcode")}
                    label="Postcode"
                    onChange={(e) => setValue("postcode", e.target.value)}
                    errors={errors.postcode?.message}
                    placeholder="Enter Postcode"
                  />
                </div>
                <HeaderSection title="Facilities & Amenities" />
                <div className="flex gap-4 mt-4">
                  {facilities.map((facility) => (
                    <CustomInput
                      key={facility.id}
                      id={facility.id}
                      name={facility.id}
                      label={facility.label}
                      type="checkbox"
                      checkboxDefaultValue={watch(facility.id)}
                      onCheckedChange={(checked) =>
                        setValue(facility.id, checked as boolean)
                      }
                    />
                  ))}
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
          <TabsContent value="units" className="md:min-h-[70vh]">
            {" "}
            <Datatable<Unit>
              columns={unitColumns}
              data={property?.units ?? []}
              isPending={false}
              pagination={pagination}
              setPagination={setPagination}
              rowKey={(item: Unit) => item.id}
              // isFilter={false}
            />
          </TabsContent>

          {/* Placeholder for other tab contents if needed later */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditProperty;
