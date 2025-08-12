import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useState } from "react";
import { PenLine } from "lucide-react";
import { FancyMultiSelect } from "@/components/FancyMultiSelect";

// Example options
const tenureOptions = [
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
  { value: "9", label: "9 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
];

const feeOptions = [
  { id: "0.5", name: "0.5 month" },
  { id: "1", name: "1 month" },
  { id: "1.5", name: "1.5 month" },
  { id: "2", name: "2 month" },
  { id: "other", name: "Other (Please specify)" },
];
interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const UpdateRoomInformation = ({ open, setOpen }: Props) => {
  const form = useForm({
    mode: "onTouched",
  });
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (data: any) => {
    // handle update logic
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <PenLine className="size-4 text-primary cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Update Room Information
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full grid grid-col-1 gap-5">
              {/* Room (read-only) */}
              <CustomInput
                id="room"
                name="room"
                type="text"
                label="Room"
                value={watch("room") || "Whole Unit"}
                readOnly
              />

              {/* Rental */}
              <CustomInput
                id="rental"
                name="rental"
                type="number"
                label="Rental"
                placeholder="0.00"
                value={watch("rental")}
                onChange={(e) => setValue("rental", e.target.value)}
              />

              {/* Title */}
              <CustomInput
                id="title"
                name="title"
                type="text"
                label="Title"
                placeholder="Room for Rent"
                value={watch("title")}
                onChange={(e) => setValue("title", e.target.value)}
              />

              {/* Tenure Period (multi-select) */}
              <Controller
                control={control}
                name="tenure_period"
                render={({ field }) => (
                  <div>
                    <label className="block mb-1">Tenure Period*</label>
                    <FancyMultiSelect
                      value={field.value || []}
                      options={tenureOptions}
                      onChange={field.onChange}
                      placeholder="Select tenure periods..."
                    />
                  </div>
                )}
              />

              {/* Checkboxes */}
              {[
                { name: "zero_deposit", label: "Zero Deposit" },
                { name: "aircond", label: "Aircond" },
                { name: "water", label: "Water" },
                {
                  name: "comprehensive_service_fee",
                  label: "Comprehensive Service Fee",
                },
                { name: "rental_first_month", label: "Rental - First Month" },
                { name: "rental_last_month", label: "Rental - Last Month" },
                { name: "accept_zero_deposit", label: "Accept Zero Deposit" },
                { name: "enable_booking", label: "Enable Booking" },
                { name: "enrol_van", label: "Enrol VAN" },
              ].map((item) => (
                <CustomInput
                  key={item.name}
                  id={item.name}
                  name={item.name}
                  type="checkbox"
                  label={item.label}
                  checkboxDefaultValue={!!watch(item.name)}
                  onCheckedChange={(checked) => setValue(item.name, checked)}
                />
              ))}

              {/* Radio groups for fees */}
              {[
                { name: "move_in_fee", label: "Move-In Fee" },
                { name: "registration_fee", label: "Registration Fee" },
                {
                  name: "tenancy_agreement_fee",
                  label: "Tenancy Agreement Fee",
                },
                { name: "security_deposit", label: "Security Deposit" },
                { name: "utility_deposit", label: "Utility Deposit" },
                { name: "access_card_deposit", label: "Access Card Deposit" },
                { name: "car_sticker", label: "Car Sticker" },
              ].map((item) => (
                <Controller
                  key={item.name}
                  control={control}
                  name={item.name}
                  render={({ field }) => (
                    <div>
                      <label className="block mb-1">{item.label} :</label>
                      <div className="flex flex-col gap-1">
                        {feeOptions.map((opt) => (
                          <label
                            key={opt.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              value={opt.name}
                              checked={field.value === opt.name}
                              onChange={() => field.onChange(opt.name)}
                            />
                            {opt.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                />
              ))}
            </div>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="text-white">
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRoomInformation;
