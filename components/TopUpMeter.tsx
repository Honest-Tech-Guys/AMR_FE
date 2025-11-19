"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useTopUpDevice from "@/lib/services/hooks/TopUpMeter";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  deviceId: number | null;
};

export default function TopUpDialog({ open, onOpenChange, deviceId }: Props) {
  const { mutate: topUp, isPending } = useTopUpDevice();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      unit: "",
    },
  });

  const onSubmit = (data: any) => {
    if (!deviceId) return;

    topUp(
      { deviceId, unit: Number(data.unit) },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up Units</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="number"
            placeholder="Enter units"
            {...register("unit", { required: true })}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full text-white"
          >
            {isPending ? "Processing..." : "Top Up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
