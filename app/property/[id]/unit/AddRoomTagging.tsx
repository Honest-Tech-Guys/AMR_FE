"use client";

import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { Room } from "@/types/RoomType";
import { useEffect, useState } from "react";
import useAddTagRoom from "@/lib/services/hooks/useAddTagRoom";
import MapWithPoints from "@/components/MapwithSinglePoint";
import ErrorToastHandel from "@/components/ErrorToastHandel";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  unit_id: number;
  url: string;
  rooms: Room[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RoomPoint {
  room_id: number;
  x: number;
  y: number;
}

const AddRoomTagging = ({ unit_id, rooms, url, open, onOpenChange }: Props) => {
  const form = useForm({ mode: "onTouched" });
  const { setValue, watch, reset } = form;

  const [Rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [points, setPoints] = useState<RoomPoint[]>([]);

  useEffect(() => {
    if (rooms) {
      setRooms(rooms.map((room) => ({ id: `${room.id}`, name: room.name })));
    }
  }, [rooms]);

  const { mutate } = useAddTagRoom(unit_id);

  const onPointChange = (point: { x: number; y: number }) => {
    const room_id = Number(watch("room_id"));
    const remark = watch("remark");
    if (!room_id || !point) return;

    // Replace any existing point for the same room
    setPoints((prev) => {
      const filtered = prev.filter((p) => p.room_id !== room_id);
      return [...filtered, { room_id, x: point.x, y: point.y, remark }];
    });
  };
  const queryClient = useQueryClient();
  const onSubmit = () => {
    if (points.length === 0) {
      toast.error("Please add at least one point!");
      return;
    }
    console.log(unit_id);
    mutate(points, {
      onSuccess: () => {
        toast.success("Added Room Tags successfully!");
        reset();
        queryClient.invalidateQueries({ queryKey: ["GetPropertiesList"] });
        setPoints([]);
        onOpenChange(false);
      },
      onError: (err: any) => {
        ErrorToastHandel(err);
      },
    });

    console.log("Points list:", points);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="md:max-w-[1000px] z-50 bg-white md:p-10 max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="w-full text-center text-2xl font-bold rounded-[6px] bg-white">
            Add Room Tagging
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            className="md:min-h-[78vh]"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="w-full flex justify-center">
              <div>
                <SelectWithForm name="room_id" title="Room" options={Rooms} />
              </div>
              <MapWithPoints
                url={url}
                points={points}
                selectedRoomId={watch("room_id")}
                onChange={(updatedPoints) => {
                  // Only allow one point per selected room
                  if (updatedPoints.length === 0) return;
                  onPointChange(updatedPoints[updatedPoints.length - 1]);
                }}
              />
            </div>
            <DialogFooter className="mt-6 flex justify-between">
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
