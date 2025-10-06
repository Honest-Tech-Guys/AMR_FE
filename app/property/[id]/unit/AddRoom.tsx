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
// Schema & type
const schema = yup.object({
  room_name: yup.string().required("room name is required"),
  description: yup.string().required("description is required"),
});
type schemaType = yup.InferType<typeof schema>;

type AddRoomProps = {
  addRoom: (room: { name: string; description: string }) => void;
};

const AddRoom = ({ addRoom }: AddRoomProps) => {
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
    addRoom({
      name: data.room_name,
      description: data.description,
    });
    reset();
    console.log("Form data:", data);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          type="button"
          className="rounded-[6px] cursor-pointer text-white"
        >
          <Plus /> Add Room
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[600px] z-500 bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-center text-2xl font-bold rounded-[6px] bg-white ">
            Add Room
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <CustomInput
                  id="room_name"
                  name="room_name"
                  type="text"
                  label="Room Name"
                  value={watch("room_name")}
                  onChange={(e) => setValue("room_name", e.target.value)}
                  errors={errors.room_name?.message}
                  placeholder="Enter Room Name"
                />
              </div>
              <div>
                <CustomInput
                  id="description"
                  name="description"
                  type="text"
                  label="Description"
                  value={watch("description")}
                  onChange={(e) => setValue("description", e.target.value)}
                  errors={errors.description?.message}
                  placeholder="Enter description"
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
                type="button"
                onClick={() =>
                  addRoom({
                    name: watch("room_name"),
                    description: watch("description"),
                  })
                }
                className="text-white"
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoom;
