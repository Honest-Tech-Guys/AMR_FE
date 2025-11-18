"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCreateBulkBooking from "@/lib/services/hooks/useCreateBulkBooking";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CreateBulk from "./CreateBulk";
import ErrorToastHandel from "@/components/ErrorToastHandel";
import { useQueryClient } from "@tanstack/react-query";
// Schema & type

const CreateBulkBookModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    mode: "onTouched",
  });

  const { mutate, isPending } = useCreateBulkBooking();
  const queryClient = useQueryClient();
  type Payload = {
    tenant_id: string;
    tenant_name: string;
    move_in_date: string;
    move_out_date: string;
    rental_fee: string;
    rental_payment_frequency: string;
    identity_type: string;
    remarks?: string;
    property_id?: string;
    unit_id?: string;
    room_id?: string;
  };
  const [Bookings, setBookings] = useState<Payload[]>([]);
  const onSubmit = () => {
    mutate(Bookings, {
      onSuccess: () => {
        toast.success(`bookings created successfully!`);
        queryClient.invalidateQueries({ queryKey: ["GetBooksList"] });
        setBookings([]);
        setIsOpen(false);
      },
      onError: (err: any) => {
        ErrorToastHandel(err);
      },
    });
  };
  console.log(Bookings);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black rounded-[6px] text-white hover:bg-black/70 cursor-pointer">
          Create Bulk Booking
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create Bulk Property
          </div>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 text-xs">
              <TableHead>Property</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Tenant Name</TableHead>
              <TableHead>Rental fee</TableHead>
              <TableHead>Rental Frequency</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Bookings.map((Booking, index) => (
              <TableRow key={index}>
                <TableCell>{Booking.property_id ?? "-"}</TableCell>
                <TableCell>{Booking.unit_id ?? "-"}</TableCell>
                <TableCell>{Booking.room_id ?? "-"}</TableCell>
                <TableCell>{Booking.tenant_name}</TableCell>
                <TableCell>{Booking.rental_fee}</TableCell>
                <TableCell>{Booking.rental_payment_frequency}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setBookings((prev) =>
                        prev.filter(
                          (_, index) => index !== Bookings.indexOf(Booking)
                        )
                      )
                    }
                  >
                    <Trash2 className="text-red-700" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CreateBulk payload={Bookings} setPayload={setBookings} />

        <FormProvider {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {/* Toast notifications are handled by 'sonner', so no need for local success/error display here */}
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="text-white" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBulkBookModal;
