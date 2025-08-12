import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PenLine } from "lucide-react";
import { useForm, FormProvider, Controller } from "react-hook-form";

// Example options
const numberOptions = [
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3" },
  { id: "4", name: "4" },
  { id: "5", name: "5" },
];
const yesNoOptions = [
  { id: "yes", name: "Yes" },
  { id: "no", name: "No" },
];
const genderOptions = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "any", name: "Any" },
];

const cookingFacilitiesOptions = [
  { id: "yes", name: "Yes" },
  { id: "no", name: "No" },
];
interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const UpdateUnitInformation = ({ open, setOpen }: Props) => {
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
            Update Unit Information
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Upload Image */}
            <div className="w-full grid grid-col-1 gap-5">
              <CustomInput
                id="image"
                name="image"
                type="file"
                label="Upload Image"
                onChange={(e) => setValue("image", e.target.files[0])}
                //   errors={errors.image?.message}
              />

              {/* Enter Sq.ft */}
              <CustomInput
                id="sqft"
                name="sqft"
                type="text"
                label="Enter Sq.ft"
                placeholder="Enter Sq.ft"
                value={watch("sqft")}
                onChange={(e) => setValue("sqft", e.target.value)}
                //   errors={errors.sqft?.message}
              />

              {/* No bedroom */}
              <SelectWithForm
                name="bedroom"
                title="No bedroom"
                options={numberOptions}
              />

              {/* No bathroom */}
              <SelectWithForm
                name="bathroom"
                title="No bathroom"
                options={numberOptions}
              />

              {/* Preferred Gender */}
              <SelectWithForm
                name="preferred_gender"
                title="Preferred Gender"
                options={genderOptions}
              />

              {/* Cooking Facilities */}
              <SelectWithForm
                name="cooking_facilities"
                title="Cooking Facilities"
                options={cookingFacilitiesOptions}
              />

              {/* Fridge */}
              <SelectWithForm
                name="fridge"
                title="Fridge"
                options={yesNoOptions}
              />

              {/* Wifi */}
              <SelectWithForm name="wifi" title="Wifi" options={yesNoOptions} />

              {/* Washing Machine */}
              <SelectWithForm
                name="washing_machine"
                title="Washing Machine"
                options={yesNoOptions}
              />

              {/* Water Heater */}
              <SelectWithForm
                name="water_heater"
                title="Water Heater"
                options={yesNoOptions}
              />

              {/* Dryer */}
              <SelectWithForm
                name="dryer"
                title="Dryer"
                options={yesNoOptions}
              />
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

export default UpdateUnitInformation;
