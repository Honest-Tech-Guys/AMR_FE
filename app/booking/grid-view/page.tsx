"use client";
import HeaderPage from "@/components/HeaderPage";
import BookingCard from "./BookingCard";
import useGetBooksList from "@/lib/services/hooks/usGetBooks";
import { LoaderCircle } from "lucide-react";

const Page = () => {
  const { data, isPending } = useGetBooksList();
  if (isPending) {
    return <LoaderCircle className="animate-spin" />;
  }
  return (
    <div>
      {/* <HeaderPage title="Booking (List View)" /> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {data?.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default Page;
