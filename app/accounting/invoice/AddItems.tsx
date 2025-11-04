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
import { useEffect } from "react";
// Schema & type
const schema = yup.object({
  item_id: yup.string().required("item is required"),
  quantity: yup.string().required("Quantity is required"),
  unit_price: yup.string().required("Unit Price is required"),
  tax: yup.string().required("Tax is required"),
  remarks: yup.string().nullable(),
});
type schemaType = yup.InferType<typeof schema>;
type Props = {
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
};
const AddItems = ({ setItems }: Props) => {
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
  const items = [
    { id: "electricitybill", name: "Electricity Bill" },
    { id: "comprehensiveservicefee", name: "Comprehensive Service Fee" },
    { id: "registrationfee", name: "Registration Fee" },
    { id: "aircond", name: "Aircond" },
    { id: "laundryproduct", name: "Laundry Product" },
    { id: "insurance", name: "Insurance" },
    { id: "waterbill", name: "Waterbill" },
    { id: "accesscarddeposit", name: "Access Card Deposit" },
    { id: "carsticker", name: "Car Sticker" },
    { id: "insurancecharges", name: "Insurance Charges" },
    { id: "moveinfee", name: "Move In Fee" },
    { id: "securitydeposit", name: "Security Deposit" },
    { id: "tenancyagreementfee", name: "Tenancy Agreement Fee" },
    { id: "zerodeposit", name: "Zero Deposit" },
    { id: "advertisementfees", name: "Advertisement Fees" },
    { id: "cleaningfees", name: "Cleaning Fees" },
    { id: "commission", name: "Commission" },
    { id: "cukaiharta", name: "Cukai Harta" },
    { id: "cukaitanah", name: "Cukai Tanah" },
    { id: "electricity", name: "Electricity" },
    { id: "fitupdeposit", name: "Fit Up Deposit" },
    { id: "indahwater", name: "Indah Water" },
    { id: "internet", name: "Internet" },
    { id: "keydeposit", name: "Key Deposit" },
    { id: "lateinterestcharges", name: "Late Interest Charges" },
    { id: "maintenancefee", name: "Maintenance Fee" },
    { id: "managementfee", name: "Management Fee" },
    { id: "otherdeposit", name: "Other Deposit" },
    { id: "others", name: "Others" },
    { id: "parking", name: "Parking" },
    { id: "penalties", name: "Penalties" },
    { id: "rental", name: "Rental" },
    { id: "rentaldeposit", name: "Rental Deposit" },
    { id: "repaircharges", name: "Repair Charges" },
    { id: "restorationdeposit", name: "Restoration Deposit" },
    { id: "service", name: "Service" },
    { id: "utilitydeposit", name: "Utility Deposit" },
    { id: "waterbill", name: "Water Bill" },
  ];

  const onSubmit = (data: any, event?: React.BaseSyntheticEvent) => {
    // Prevent form submission from bubbling up to parent form
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setItems((prev) => [
      ...prev,
      {
        item_name: items.find((i) => i.id === data.item_id)?.name || "",
        quantity: Number(data.quantity),
        unit_price: Number(data.unit_price),
        tax_percentage: Number(data.tax),
        remarks: data?.remarks,
      },
    ]);
    reset({
      item_id: "",
      quantity: "",
      unit_price: "",
      tax: "",
      remarks: "",
    }); // فضي الحقول بعد الإضافة
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-white rounded-[6px]">
          <Plus /> Add Item
        </Button>
      </DialogTrigger>

      <DialogContent
        className="md:max-w-[500px] z-[500]  bg-white md:p-10 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <div className="w-full text-2xl font-bold text-center rounded-[6px] bg-white ">
            Add Item
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.target as HTMLElement).tagName !== "TEXTAREA"
              ) {
                e.stopPropagation();
              }
            }}
          >
            <div className="grid grid-cols-3  gap-4">
              <div className="col-span-3">
                <SelectWithForm<schemaType>
                  name="item_id"
                  title="Item"
                  options={items}
                />
              </div>
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

              <div className="col-span-3 ">
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

              <Button
                type="submit"
                className="text-white"
                onClick={(e) => e.stopPropagation()}
              >
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
