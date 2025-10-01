import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BedSingle, Bath, Lock, Gauge, Image, Share2 } from "lucide-react";
import {
  getUnitStatus,
  unitStatusConfig,
} from "@/components/General/GetUnitStatus";
import UnitDropdown from "./UnitDropDown";
import RoomCard from "./RoomCard";
import CarParkCard from "./CarParkCard";
const UnitCard = ({ unit }: { unit: any }) => {
  const roomsStatus = getUnitStatus(unit.rooms);
  const { label, badgeClass } = unitStatusConfig[roomsStatus];
  const carParksStatus = getUnitStatus(unit.carparks);
  const { label: carParksLabel, badgeClass: carParksBadgeClass } =
    unitStatusConfig[carParksStatus];

  return (
    <AccordionItem value={`${unit.id}`}>
      <AccordionTrigger>
        <div className="w-full flex justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-primary-foreground">
              Unit - {unit.block_floor_unit_number}
            </p>
            <p>{unit.rental_type}</p>

            {unit.rental_type === "Sublet" && (
              <div className="flex gap-3">
                <span>Rooms:</span>
                <Badge className={badgeClass}>{label}</Badge>
                <span>Car Parks:</span>
                <Badge className={carParksBadgeClass}>
                  {carParksLabel === "No Rooms" ? "No Car Park" : carParksLabel}
                </Badge>
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex gap-1 items-center">
                <BedSingle className="size-4" />
                <span>{unit.bedroom_count}</span>
              </div>
              <div className="flex gap-1 items-center">
                <Bath className="size-4" />
                <span>{unit.bathroom_count}</span>
              </div>
              <div className="flex gap-1 items-center">
                <Lock className="size-4" />
                <span>{unit.locks.length > 0 ? "on" : "off"}</span>
              </div>
              <div className="flex gap-1 items-center">
                <Gauge className="size-4" />
                <span>{unit.meters.length > 0 ? "on" : "off"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            <Image
              className="size-4 text-black/30"
              onClick={(e) => e.stopPropagation()}
            />
            <Share2
              className="size-4 text-black/30"
              onClick={(e) => e.stopPropagation()}
            />
            <UnitDropdown unit={unit} />
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        {unit.rental_type === "Sublet" ? (
          <Accordion type="multiple">
            {roomsStatus !== "No Rooms" && (
              <AccordionItem value="rooms">
                <AccordionTrigger>Rooms</AccordionTrigger>
                <AccordionContent>
                  <div className="flex w-full overflow-x-scroll gap-3">
                    {unit.rooms.map((room: any) => (
                      <RoomCard key={room.id} room={room} unit={unit} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {carParksStatus !== "No Rooms" && (
              <AccordionItem value="carparks">
                <AccordionTrigger>Car Parks</AccordionTrigger>
                <AccordionContent>
                  <div className="flex w-full overflow-x-scroll gap-3">
                    {unit.carparks.map((carpark: any) => (
                      <CarParkCard
                        key={carpark.id}
                        carpark={carpark}
                        unit={unit}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        ) : (
          <RoomCard unit={unit} />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default UnitCard;
