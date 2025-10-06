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
// Schema & type
const schema = yup.object({
  room_id: yup.string().required("Room is required"),
  amenities: yup.array().of(yup.string()).required("Amenities is required"),
  gender: yup.string().required("Country is required"),
  race: yup.string().required("Country is required"),
  work_or_study: yup.string().required("Country is required"),
  remarks: yup.string().nullable(),
});
type schemaType = yup.InferType<typeof schema>;
interface Props {
  id: number;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}
const AddRoomDetails = ({ id, open, onOpenChange }: Props) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Add Room Details
        </Button>
      </DialogTrigger> */}

      <DialogContent className="md:max-w-[1000px] z-500 bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Add Room Details
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Floor Plan Information" />
            <div className="grid col-span-1  gap-4">
              <div className="col-span-1 md:col-span-2">
                {/* <MapWithPoints /> */}
              </div>
              <div className="col-span-1 md:col-span-2">
                <SelectWithForm<schemaType>
                  name="room_id"
                  title="Room"
                  options={Rooms}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <SelectWithForm<schemaType>
                  name="amenities"
                  title="Amenities"
                  options={Amenities}
                  multiple
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
                  className="bg-gray-100"
                  errors={errors.remarks?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <SelectWithForm<schemaType>
                name="gender"
                title="Gender"
                options={GenderType}
              />
              <SelectWithForm<schemaType>
                name="race"
                title="Race"
                options={Race}
              />
              <SelectWithForm<schemaType>
                name="work_or_study"
                title="Work or Study"
                options={work_or_study}
              />
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

export default AddRoomDetails;
