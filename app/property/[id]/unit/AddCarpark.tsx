"use client";

import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import MapWithPoints from "@/components/ImageMapper";
import { Plus } from "lucide-react";
import { SelectWithForm } from "@/components/CustomSelect";
// Schema & type
const schema = yup.object({
  location: yup.string().required("room name is required"),
  type: yup.string().required("type is required"),
});
type schemaType = yup.InferType<typeof schema>;
type AddCarparkProps = {
  addCarpark: (carpark: { location: string; type: string }) => void;
};
const AddCarPark = ({ addCarpark }: AddCarparkProps) => {
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

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    addCarpark({
      location: data.location,
      type: data.type,
    });
    console.log("Form data:", data);
  };
  const Types = [
    { id: "Tandem", name: "Tandem" },
    { id: "Side By Side", name: "Side By Side" },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] cursor-pointer text-white">
          <Plus /> Add Car Park
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[600px] z-500 bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-center text-2xl font-bold rounded-[6px] bg-white ">
            Add Car Park
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <CustomInput
                  id="location"
                  name="location"
                  type="text"
                  label="Location"
                  value={watch("location")}
                  onChange={(e) => setValue("location", e.target.value)}
                  errors={errors.location?.message}
                  placeholder="Enter Room Name"
                />
              </div>
              <div>
                <SelectWithForm<schemaType>
                  name="type"
                  title="Type"
                  options={Types}
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
                Add
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarPark;
