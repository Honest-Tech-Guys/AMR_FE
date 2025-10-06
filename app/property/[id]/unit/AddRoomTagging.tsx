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
import { Room } from "@/types/RoomType";
import { useState } from "react";
// Schema & type
const schema = yup.object({
  room_id: yup.string().required("Property type is required"),
  remark: yup.string().required("Owner name is required"),
});
type schemaType = yup.InferType<typeof schema>;
interface Props {
  url: string;
  rooms: Room[];
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}
const AddRoomTagging = ({ rooms, url, open, onOpenChange }: Props) => {
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
  const COUNTRIES = [
    { id: "us", name: "United States" },
    { id: "uk", name: "United Kingdom" },
    { id: "ca", name: "Canada" },
    { id: "au", name: "Australia" },
    { id: "fr", name: "France" },
    { id: "de", name: "Germany" },
    { id: "jp", name: "Japan" },
    { id: "br", name: "Brazil" },
  ];
  const [Rooms, setRooms] = useState([
    { id: "1", name: "Room1" },
    { id: "2", name: "Room2" },
    { id: "3", name: "Room3 " },
  ]);
  const facilities = [
    { id: "meeting_room", label: "Meeting Room" },
    { id: "game_room", label: "Game Room" },
    { id: "basketball_court", label: "Basketball Court" },
    { id: "sauna", label: "Sauna" },
    { id: "free_text", label: "Free Text" },
  ];
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log("Form data:", data);
  };
  console.log(url);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[1000px] z-500 bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-center text-2xl font-bold rounded-[6px] bg-white ">
            Add Room Tagging
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="md:min-h-[78vh]">
            <div className="w-full flex justify-center">
              <MapWithPoints url={url} />
            </div>
            <div className="flex justify-center gap-5">
              <div>
                <SelectWithForm<schemaType>
                  name="room_id"
                  title="Room"
                  options={Rooms}
                />
              </div>
              <div>
                <CustomInput
                  id="remark"
                  name="remark"
                  type="text"
                  label="Remark"
                  value={watch("remark")}
                  onChange={(e) => setValue("remark", e.target.value)}
                  errors={errors.remark?.message}
                  placeholder="Enter Remark"
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
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomTagging;
