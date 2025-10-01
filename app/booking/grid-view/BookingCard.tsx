import { Book } from "@/types/BookType";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Room } from "@/types/RoomType";
import { Unit } from "@/types/UnitType";
interface BookingCardProps {
  booking: Book;
}
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Full":
      return <Badge className="bg-red-500 text-white">Full</Badge>;
    case "Available":
      return <Badge className="bg-green-500 text-white">Available</Badge>;
    default:
      return <Badge className="bg-gray-400 text-white">{status}</Badge>;
  }
};
const BookingCard = ({ booking }: BookingCardProps) => {
  const bookable = booking.bookable;
  const tenant = booking.tenant;
  const creator = booking.creator;
  {
    /* Title & Location */ return (
      <Card className="relative p-4 rounded-xl shadow-sm flex flex-col justify-between">
        {/* Status */}

        {getStatusBadge(booking.status)}

        {/* Title & Location */}
        <div className="mb-3 flex gap-5">
          <h3 className="text-sm font-bold ">
            {(bookable as Room)?.unit?.property?.property_name ??
              (bookable as Unit)?.property?.property_name}
          </h3>
          <h3 className="text-sm font-bold ">
            {(bookable as Room)?.unit?.block_floor_unit_number ??
              (bookable as Unit)?.block_floor_unit_number}
          </h3>
          <h3 className="text-sm font-bold ">
            {(bookable as Room)?.name ?? null}
          </h3>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-6 my-2 text-sm">
          {/* <p>{bookable?.units?.length || 0} units</p>
          <p>{bookable?.rooms?.length || 0} rooms</p> */}
          <p className="font-medium text-primary">
            {booking.rental_fee}/{booking.rental_payment_frequency}
          </p>
        </div>

        {/* Occupancy & Dates */}
        <div className="text-xs text-gray-600 mt-2 flex flex-col gap-1">
          <span>Move in: {booking.move_in_date}</span>
          <span>Move out: {booking.move_out_date}</span>
          <span>{booking.remarks || "No remarks"}</span>
        </div>

        {/* Tenant & Creator */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {/* {tenant?.avatar_url && (
              <Image
                src={tenant.avatar_url}
                alt={tenant.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )} */}
            <div>
              <p className="text-sm font-semibold">
                {tenant?.name || "Unknown Tenant"}
              </p>
              <p className="text-xs text-gray-400">Tenant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {creator?.avatar_url && (
              <Image
                src={creator.avatar_url}
                alt={creator.name}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <p className="text-xs text-gray-500">by {creator?.name}</p>
          </div>
        </div>

        {/* Action */}
        <div className="mt-3 text-center">
          <button className="text-primary font-semibold text-sm hover:underline">
            View Details
          </button>
        </div>
      </Card>
    );
  }
};

export default BookingCard;
