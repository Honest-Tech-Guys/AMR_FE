import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Image, Share2 } from "lucide-react";
import { getStatus } from "@/components/General/GetStatus";
import { FormProvider, useForm } from "react-hook-form";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import ViewTenancy from "@/app/tenancy/ViewTenancy";
import CarParksDropDown from "./CarParksDropDown";
const statusType = [
  { id: "1", name: "Not Applicable" },
  { id: "2", name: "To be Vacant , To acquire new tenant" },
  { id: "3", name: "To be Vacant , To be Reno / Maintenance" },
  { id: "4", name: "To be Vacant , To return to owner" },
  { id: "5", name: "Upon Expiry , Existing Tenant to continue" },
  { id: "6", name: "Upon Expiry , New Tenant Acquired" },
];
const CarParkCard = ({ carpark, unit }: { carpark: any; unit: any }) => {
  const form = useForm({ defaultValues: { status: "" } });
  const { handleSubmit } = form;

  return (
    <Card className="w-full max-w-sm min-w-sm">
      <CardHeader>
        <div className="flex justify-between">
          <p className="text-primary">Car Park - {carpark.number}</p>
          <div className="flex gap-5">
            <Image className="size-4 text-black/30" />
            <Share2 className="size-4 text-black/30" />
            <CarParksDropDown carpark={carpark} />
          </div>
        </div>
        {getStatus(carpark.status)}
      </CardHeader>

      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit((d) => console.log("Form data:", d))}>
            <SelectWithForm name="status" title="Status" options={statusType} />
          </form>
        </FormProvider>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {unit?.last_active_tenancy?.[0] ? (
          <ViewTenancy tenancy={unit.last_active_tenancy[0]} />
        ) : (
          <Button className="text-white">Move in</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CarParkCard;
