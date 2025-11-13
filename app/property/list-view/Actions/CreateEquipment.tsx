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
} from "@/components/ui/dialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import useCreateEquipment from "@/lib/services/hooks/useCreateEquipment";
import { toast } from "sonner";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { useEffect } from "react";
import ErrorToastHandel from "@/components/ErrorToastHandel";

// Schema & type
const schema = yup.object({
  brand_name: yup.string().required("Brand name is required"),
  name: yup.string().required("Model name is required"),
  serial_number: yup.string().required("Serial number is required"),
  price: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  width: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Width must be a number")
    .positive("Width must be greater than 0")
    .required("Width is required"),
  height: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Height must be a number")
    .positive("Height must be greater than 0")
    .required("Height is required"),
  depth: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Depth must be a number")
    .positive("Depth must be greater than 0")
    .required("Depth is required"),
  installation_date: yup.string().required("Installation date is required"),
  warranty_expire_date: yup
    .string()
    .required("Warranty expire date is required")
    .test(
      "is-after-installation",
      "Warranty expire date must be after installation date",
      function (value) {
        const { installation_date } = this.parent;
        if (!value || !installation_date) return true;
        return new Date(value) > new Date(installation_date);
      }
    ),

  // Remarks
  description: yup.string().nullable().default(null),
  remarks: yup.string().nullable().default(null),

  // Service Reminder
  next_service_date: yup.string().required("Next service date is required"),
  schedule_date: yup
    .string()
    .required("Schedule date is required")
    .test(
      "is-after-next-service",
      "Schedule date must be after next service date",
      function (value) {
        const { next_service_date } = this.parent;
        if (!value || !next_service_date) return true;
        return new Date(value) >= new Date(next_service_date);
      }
    ),
});

type schemaType = yup.InferType<typeof schema>;

interface Props {
  id: number;
  type: "Room" | "Unit";
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}
const CreateEquipment = ({ id, type, onOpenChange, open }: Props) => {
  const { mutate, isPending } = useCreateEquipment();
  const { refetch } = useGetPropertiesList({});
  const form = useForm<schemaType>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      brand_name: "",
      name: "",
      serial_number: "",
      price: undefined as any,
      width: undefined as any,
      height: undefined as any,
      depth: undefined as any,
      installation_date: "",
      warranty_expire_date: "",
      description: null,
      remarks: null,
      next_service_date: "",
      schedule_date: "",
    },
  });
  const {
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    const payload = {
      ...data,
      ...(type === "Room" ? { room_id: id } : { unit_id: id }),
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Equipment created successfully!");
        reset();
        refetch();
        onOpenChange(false);
      },
      onError: (err: any) => {
        ErrorToastHandel(err);
      },
    });

    console.log("Equipment form data:", payload);
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
              {/* <CustomInput
                id="property_name"
                name="property_name"
                type="text"
                label="Property Name"
                value={watch("property_name")}
                onChange={(e) => setValue("property_name", e.target.value)}
                errors={errors.property_name?.message}
                placeholder="Enter Property Name"
              /> */}
              {/* <SelectWithForm<schemaType>
                name="category"
                title="Category"
                options={PartnerType}
              />
              <SelectWithForm<schemaType>
                name="sub_category"
                title="Sub Category"
                options={PartnerType}
              /> */}
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
                id="name"
                name="name"
                type="text"
                label="Model Name"
                value={watch("name")}
                onChange={(e) => setValue("name", e.target.value)}
                errors={errors.name?.message}
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
                value={watch("price") ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setValue("price", undefined as any, {
                      shouldValidate: true,
                    });
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue)) {
                      setValue("price", numValue, {
                        shouldValidate: true,
                      });
                    }
                  }
                }}
                errors={errors.price?.message}
                placeholder="Enter Price"
              />
              <CustomInput
                id="width"
                name="width"
                type="number"
                label="Width (cm)"
                value={watch("width") ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setValue("width", undefined as any, {
                      shouldValidate: true,
                    });
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue)) {
                      setValue("width", numValue, {
                        shouldValidate: true,
                      });
                    }
                  }
                }}
                errors={errors.width?.message}
                placeholder="Enter Width"
              />
              <CustomInput
                id="height"
                name="height"
                type="number"
                label="Height (cm)"
                value={watch("height") ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setValue("height", undefined as any, {
                      shouldValidate: true,
                    });
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue)) {
                      setValue("height", numValue, {
                        shouldValidate: true,
                      });
                    }
                  }
                }}
                errors={errors.height?.message}
                placeholder="Enter Height"
              />
              <CustomInput
                id="depth"
                name="depth"
                type="number"
                label="Depth (cm)"
                value={watch("depth") ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setValue("depth", undefined as any, {
                      shouldValidate: true,
                    });
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue)) {
                      setValue("depth", numValue, {
                        shouldValidate: true,
                      });
                    }
                  }
                }}
                errors={errors.depth?.message}
                placeholder="Enter Depth"
              />
              <CustomInput
                id="installation_date"
                name="installation_date"
                type="date"
                label="Installation Date"
                value={watch("installation_date")}
                onChange={(e) => {
                  setValue("installation_date", e.target.value, {
                    shouldValidate: true,
                  });
                }}
                errors={errors.installation_date?.message}
                placeholder="Enter Installation Date"
              />
              <CustomInput
                id="warranty_expire_date"
                name="warranty_expire_date"
                type="date"
                label="Warranty Expire Date"
                value={watch("warranty_expire_date")}
                onChange={(e) => {
                  setValue("warranty_expire_date", e.target.value, {
                    shouldValidate: true,
                  });
                }}
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
                  id="description"
                  label="Description"
                  type="textArea"
                  name="description"
                  value={watch("description")}
                  onChange={(e) => setValue("description", e.target.value)}
                  placeholder="E.g describe more about the reason for change"
                  className="bg-gray-100"
                  errors={errors.description?.message}
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
                onChange={(e) => {
                  setValue("next_service_date", e.target.value, {
                    shouldValidate: true,
                  });
                }}
                errors={errors.next_service_date?.message}
                placeholder="Enter Next Service Date"
              />
              <CustomInput
                id="schedule_date"
                name="schedule_date"
                type="date"
                value={watch("schedule_date")}
                label="Schedule Date"
                onChange={(e) => {
                  setValue("schedule_date", e.target.value, {
                    shouldValidate: true,
                  });
                }}
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

export default CreateEquipment;
