import { Book } from "@/types/BookType";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Room } from "@/types/RoomType";
import { Unit } from "@/types/UnitType";
import {
  AlertCircle,
  ArrowUpToLine,
  Building2,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Timer,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { daysBetween } from "@/lib/utils";
interface BookingCardProps {
  booking: Book;
}
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Confirmed":
      return <Badge className="bg-blue-500 text-white">Confirmed</Badge>;
    case "Canceled":
      return <Badge className="bg-red-500 text-white">Canceled</Badge>;
    case "Completed":
      return <Badge className="bg-green-500 text-white">Completed</Badge>;
    default:
      return <Badge className="bg-gray-400 text-white">{status}</Badge>;
  }
};
const getStatusConfig = (
  status: "Completed" | "Pending" | "Canceled" | "Confirmed"
) => {
  const configs = {
    Completed: {
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 border-green-200 text-green-700",
      icon: CheckCircle2,
    },
    Pending: {
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 border-yellow-200 text-yellow-700",
      icon: AlertCircle,
    },
    Canceled: {
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50 border-gray-200 text-gray-700",
      icon: XCircle,
    },
    Confirmed: {
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 border-blue-200 text-blue-700",
      icon: Timer,
    },
  };
  return configs[status] || configs["Canceled"];
};
const BookingCard = ({ booking }: BookingCardProps) => {
  const bookable = booking.bookable;
  const tenant = booking.tenant;
  const creator = booking.creator;
  const statusConfig = getStatusConfig(booking.status as never);
  const StatusIcon = statusConfig.icon;
  {
    /* Title & Location */ return (
      <div
        key={booking.id}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group"
        // onMouseEnter={() => setHoveredCard(booking.id as never)}
        // onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Card Header */}
        <div
          className={`bg-gradient-to-r ${statusConfig.color} p-3 relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          {/* <div className="flex items-start justify-between relative z-10"> */}
          <div>
            <div className="w-full flex  justify-between ">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon className="w-5 h-5 text-white" />
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                  {booking.status}
                </span>
                <p className="text-white/90 text-sm">
                  {booking.bookable
                    ? "unit" in booking.bookable
                      ? ` ${booking?.bookable?.unit?.rental_type} `
                      : `${booking?.bookable?.rental_type}`
                    : "-"}
                </p>
              </div>
              <div>
                <div className=" flex gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <p className=" text-white text-xs font-medium">
                    {daysBetween(booking.move_in_date, booking.move_out_date)}{" "}
                  </p>
                  <p className=" text-white text-xs font-medium">Days</p>
                </div>
              </div>
            </div>
            {/* <h3 className="text-lg font-bold text-white mb-1">
              {booking.code}
            </h3> */}
          </div>
          {/* </div> */}
        </div>

        {/* Card Body */}
        <div className="p-3 ">
          {/* Status Badges */}
          {/* <div className="flex gap-2 mb-4 flex-wrap">
          <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
              getPaymentStatusConfig(booking.payment_status).color
            }`}
          >
            <CreditCard className="w-3 h-3" />
            {booking.payment_status}
          </span>
          {!booking.auto_pay && (
            <span className="flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
              Auto Pay Off
            </span>
          )}
          {booking.has_smart_meter && (
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-200">
              <Zap className="w-3 h-3" />
              Smart Meter
            </span>
          )}
        </div> */}

          {/* Tenant Info */}
          <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl">
                <User className="w-5 h-5 " />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Tenant</p>
                <p className="text-lg font-bold text-slate-800">
                  {booking.tenant.name}
                </p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Building2 className="w-4 h-4 text-slate-600 mt-0.5" />
              <div className="flex-1 flex items-center gap-2">
                <p className="text-xs text-slate-500 ">Property :</p>
                <p className="text-sm font-semibold text-slate-800">
                  {booking.bookable
                    ? "unit" in booking.bookable
                      ? ` ${booking.bookable?.unit?.property?.property_name} `
                      : `${booking.bookable?.property?.property_name}`
                    : "-"}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {booking.bookable
                    ? "unit" in booking.bookable
                      ? ` ${booking.bookable?.unit?.block_floor_unit_number} `
                      : `${booking.bookable?.block_floor_unit_number}`
                    : "-"}
                  {booking.bookable
                    ? "unit" in booking.bookable
                      ? `  ${booking.bookable?.name}  `
                      : ``
                    : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-green-700 font-medium">
                    Monthly Rental
                  </p>
                </div>
                <p className="text-sm font-bold text-green-800">
                  RM {booking.rental_fee}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-blue-700 font-medium">Type</p>
                </div>
                <p className="text-sm font-semibold text-blue-800">
                  {booking.rental_payment_frequency}
                </p>
              </div>
            </div>
          </div>

          {/* booking Period */}
          <div className="p-4 bg-slate-50 rounded-xl mb-4 border border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <p className="text-xs text-slate-500 ">booking Start Date</p>
                </div>
                <p className="text-sm font-semibold text-slate-800 ml-6">
                  {booking.move_in_date}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <p className="text-xs text-slate-500 ">booking End Date</p>
                </div>
                <p className="text-sm font-semibold text-slate-800 ml-6">
                  {booking.move_out_date}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="border-t border-slate-200 pt-4 mb-4 px-2">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="text-xs text-slate-500 font-medium">
                  Owner:
                </span>
              </div>
              <span className="text-sm text-slate-800 font-semibold ">
                {booking.bookable
                  ? "unit" in booking.bookable
                    ? ` ${booking.bookable?.unit?.property?.owner?.name} `
                    : `${booking.bookable?.property?.owner?.name}`
                  : ""}
              </span>
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="text-xs text-slate-500 font-medium">
                  Created by:
                </span>
              </div>
              <span className="text-sm text-slate-800 font-semibold ">
                {booking.creator.name}
              </span>
            </div>
          </div>
          {/* Action Button */}
          {/* <Viewbooking booking={booking} /> */}
        </div>
      </div>
    );
  }
};

export default BookingCard;
