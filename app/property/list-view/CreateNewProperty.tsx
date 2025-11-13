"use client";

import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import ErrorToastHandel from "@/components/ErrorToastHandel";
import HeaderSection from "@/components/HeaderSection";
import PhoneInput from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAddProperty from "@/lib/services/hooks/useAddProperties";
import useGetOwnersSelection from "@/lib/services/hooks/useGetOwnerSelection";
import { useAuthStore } from "@/lib/stores/authStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const CreateNewProperty = () => {
  const [owners, setOwners] = useState<{ id: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sameInformation, setSameInformation] = useState(false);

  const { user_role } = useAuthStore();

  // ✅ Define the schema creator before using it
  const createSchema = (role: string, sameInfo: boolean) =>
    yup.object({
      postcode: yup.string().required("Postcode is required"),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      property_name: yup.string().required("Property name is required"),
      property_type: yup.string().required("Property type is required"),
      owner_id:
        role !== "Owner"
          ? yup.string().required("Owner is required")
          : yup.string().nullable(),
      owner_phone_number:
        role !== "Owner"
          ? yup.string().required("Owner phone number is required")
          : yup.string().optional(),
      contact_name: !sameInfo
        ? yup.string().required("Contact name is required")
        : yup.string().nullable(),
      contact_phone_number: !sameInfo
        ? yup.string().required("Contact phone number is required")
        : yup.string().optional(),
      remarks: yup.string().nullable(),
      address: yup.string().required("Address is required"),
      facilities: yup.string().nullable(),
    });

  type SchemaType = yup.InferType<ReturnType<typeof createSchema>>;

  // ✅ Memoize schema correctly (depends on role + sameInformation)
  const schema = useMemo(
    () => createSchema(user_role || "", sameInformation),
    [user_role, sameInformation]
  );

  const form = useForm<Partial<SchemaType>>({
    mode: "onTouched",
    resolver: yupResolver(schema) as any, // Type override: schema shape may have optional fields
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const { mutate, error, isPending } = useAddProperty();
  const { data } = useGetOwnersSelection(isOpen);

  useEffect(() => {
    if (data) {
      const ownersData = data.map((owner) => ({
        id: `${owner.id}`,
        name: owner.name,
      }));
      setOwners(ownersData);
    }
  }, [data]);

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

  const PartnerType = [
    { id: "Apartment", name: "Apartment" },
    { id: "Condominium", name: "Condominium" },
    { id: "Flat", name: "Flat" },
    { id: "Landed", name: "Landed" },
    { id: "Townhouse", name: "Townhouse" },
  ];

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    const payload = {
      property_name: data.property_name,
      owner_id: data.owner_id,
      owner_phone: data.owner_phone_number,
      contact_name: data.contact_name || null,
      contact_phone: data.contact_phone_number || null,
      property_type: data.property_type,
      remarks: data.remarks || "",
      address_line_1: data.address || null,
      country: "Malaysia",
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      facilities: data.facilities || "",
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Property created successfully!");
        reset();
        setIsOpen(false);
      },
      onError: (err: any) => {
        ErrorToastHandel(err);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white cursor-pointer">
          Create New Property
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold">Create New Property</div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit as any)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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

              <SelectWithForm<SchemaType>
                name="property_type"
                title="Property Type"
                options={PartnerType}
              />

              {user_role !== "Owner" && (
                <>
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
                </>
              )}

              <div className="col-span-2">
                <CustomInput
                  id="sameInformation"
                  name="sameInformation"
                  label="Contact The Same"
                  type="checkbox"
                  checkboxDefaultValue={sameInformation}
                  onCheckedChange={(checked) => {
                    setSameInformation(checked as boolean);
                    if (checked) {
                      const owner = data?.find(
                        (item) =>
                          item.id === parseInt(watch("owner_id") as string)
                      );
                      setValue("contact_name", owner?.name || "");
                      setValue(
                        "contact_phone_number",
                        watch("owner_phone_number") || ""
                      );
                    } else {
                      setValue("contact_name", null);
                      setValue("contact_phone_number", undefined);
                    }
                  }}
                />
              </div>

              {!sameInformation && (
                <>
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
                </>
              )}

              <div className="col-span-2">
                <CustomInput
                  id="remarks"
                  label="Remarks"
                  type="textArea"
                  name="remarks"
                  value={watch("remarks")}
                  onChange={(e) => setValue("remarks", e.target.value)}
                  placeholder="E.g describe more about the reason for change"
                  errors={errors.remarks?.message}
                />
              </div>
            </div>

            {/* ====== Address ====== */}
            <HeaderSection title="Address Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-start">
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
                id="address"
                name="address"
                type="text"
                value={watch("address")}
                label="Address"
                onChange={(e) => setValue("address", e.target.value)}
                errors={errors.address?.message}
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

            {/* ====== Facilities ====== */}
            <HeaderSection title="Facilities & Amenities" />
            {/* <div className="flex gap-4 mt-4 flex-wrap">
              {facilities.map((facility) => (
                <CustomInput
                  key={facility.id}
                  id={facility.id}
                  name={facility.id}
                  label={facility.label}
                  type="checkbox"
                  checkboxDefaultValue={Boolean(
                    watch(facility.id as FacilityId)
                  )}
                  onCheckedChange={(checked) =>
                    setValue(facility.id as FacilityId, checked as boolean)
                  }
                />
              ))}
            </div> */}
            <div className="col-span-2">
              <CustomInput
                id="facilities"
                label=""
                type="textArea"
                name="facilities"
                value={watch("facilities")}
                onChange={(e) => setValue("facilities", e.target.value)}
                placeholder="Enter Facilities Property"
                errors={errors.facilities?.message}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="text-white" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewProperty;
