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
import MapWithPoints from "@/components/ImageMapper";
import { Plus } from "lucide-react";
// Schema & type
const schema = yup.object({
  item_id: yup.string().required("item is required"),
  quantity: yup.string().required("Quantity is required"),
  unit_price: yup.string().required("Unit Price is required"),
  tax: yup.string().required("Tax is required"),
  remarks: yup.string().nullable(),
});
type schemaType = yup.InferType<typeof schema>;
const AddItems = () => {
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
  const work_or_study = [
    { id: "work", name: "Work" },
    { id: "study", name: "Study" },
  ];
  const GenderType = [
    { id: "1", name: "Male" },
    { id: "2", name: "Female" },
    { id: "3", name: "Per Not To Say" },
  ];
  const Rooms = [
    { id: "1", name: "Room 1" },
    { id: "2", name: "Room 2" },
    { id: "3", name: "Room 3" },
  ];
  const Amenities = [
    { id: "1", name: "Table" },
    { id: "2", name: "Table lamp" },
    { id: "3", name: "Chair" },
    { id: "4", name: "Fan" },
    { id: "5", name: "Balcony" },
    { id: "6", name: "En Suit Bathroom" },
  ];
  const Race = [
    { id: "1", name: "Malay" },
    { id: "2", name: "Chinese" },
    { id: "3", name: "Indian" },
    { id: "4", name: "Others" },
  ];
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log("Form data:", data);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-white rounded-[6px]">
          <Plus /> Add Item
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[500px] z-[300]  bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold text-center rounded-[6px] bg-white ">
            Add Item
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1  gap-4">
              <SelectWithForm<schemaType>
                name="item_id"
                title="Item"
                options={Rooms}
              />
              <CustomInput
                id="quantity"
                label="Quantity"
                type="number"
                name="quantity"
                value={watch("quantity")}
                onChange={(e) => setValue("quantity", e.target.value)}
                placeholder="E.g describe more about the reason for change"
                className="bg-gray-100"
                errors={errors.quantity?.message}
              />
              <CustomInput
                id="unit_price"
                label="Unit Price"
                type="number"
                name="unit_price"
                value={watch("unit_price")}
                onChange={(e) => setValue("unit_price", e.target.value)}
                placeholder="E.g describe more about the reason for change"
                className="bg-gray-100"
                errors={errors.unit_price?.message}
              />
              <CustomInput
                id="tax"
                label="Tax"
                type="number"
                name="tax"
                value={watch("tax")}
                onChange={(e) => setValue("tax", e.target.value)}
                placeholder="E.g describe more about the reason for change"
                className="bg-gray-100"
                errors={errors.tax?.message}
              />

              <div className="col-span-1 ">
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

export default AddItems;
