import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Image, Share2, Lock, Gauge } from "lucide-react";
import { capitalize } from "@/lib/utilities/Capitalize";
import { getStatus } from "@/components/General/GetStatus";
import { FormProvider, useForm } from "react-hook-form";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import ViewTenancy from "@/app/tenancy/ViewTenancy";
import RoomDropDown from "./RoomDropDown";
import CreateTenancy from "../list-view/Actions/CreateTenancy";
import { useState } from "react";
import { Unit } from "@/types/UnitType";
import { Room } from "@/types/RoomType";
const statusType = [
  { id: "1", name: "Not Applicable" },
  { id: "2", name: "To be Vacant , To acquire new tenant" },
  { id: "3", name: "To be Vacant , To be Reno / Maintenance" },
  { id: "4", name: "To be Vacant , To return to owner" },
  { id: "5", name: "Upon Expiry , Existing Tenant to continue" },
  { id: "6", name: "Upon Expiry , New Tenant Acquired" },
];
const RoomCard = ({ room, unit }: { room?: Room; unit?: Unit }) => {
  const form = useForm({ defaultValues: { status: "" } });
  const { handleSubmit } = form;
  const [open, setOpen] = useState(false);
  return (
    <Card className="w-full max-w-sm min-w-sm">
      <CardHeader>
        <div className="flex justify-between">
          <p className="text-primary">
            {capitalize((room?.name || unit?.description) as string)}
          </p>
          <div className="flex gap-5">
            <Image className="size-4 text-black/30" />
            <Share2 className="size-4 text-black/30" />
            {room && <RoomDropDown room={room} />}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center">
            <Lock className="size-4" />
            <span>{(room?.locks?.length as number) > 0 ? "on" : "off"}</span>
          </div>
          <div className="flex gap-1 items-center">
            <Gauge className="size-4" />
            <span>{(room?.meters?.length as number) > 0 ? "on" : "off"}</span>
          </div>
        </div>
        {getStatus(room?.status || (unit?.status as never))}
      </CardHeader>

      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit((d) => console.log("Form data:", d))}>
            <div className="flex flex-col gap-6">
              <SelectWithForm
                name="status"
                title="Status"
                options={statusType}
              />

              {unit?.last_active_tenancy?.[0] && (
                <div className="flex justify-between">
                  <div>
                    <p>{unit.last_active_tenancy[0].tenant?.name}</p>
                    <p className="text-primary">
                      {unit.last_active_tenancy[0].code}
                    </p>
                    <p>
                      RM {unit.last_active_tenancy[0].rental_fee} /{" "}
                      {unit.last_active_tenancy[0].rental_payment_frequency}
                    </p>
                  </div>
                  <div>
                    <p>Tenancy Start:</p>
                    <p>
                      {unit.last_active_tenancy[0].tenancy_period_start_date}
                    </p>
                    <p>Tenancy End:</p>
                    <p>{unit.last_active_tenancy[0].tenancy_period_end_date}</p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {unit?.last_active_tenancy?.[0] ? (
          <ViewTenancy tenancy={unit.last_active_tenancy[0]} />
        ) : (
          <Button
            className="text-white"
            onClick={() => {
              setOpen(true);
            }}
          >
            Move in
          </Button>
        )}
      </CardFooter>
      <CreateTenancy
        id={(room?.id ?? unit?.id) as number}
        open={open}
        type={room?.id ? "Room" : "Unit"}
        onOpenChange={setOpen}
      />
    </Card>
  );
};

export default RoomCard;
