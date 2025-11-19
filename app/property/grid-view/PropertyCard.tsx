import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import PropertyDropdown from "./PropertyDropDown";
import UnitCard from "./UnitCard";
import { getStatusBadge } from "@/components/General/StatusBadge";

const PropertyCard = ({ property }: { property: any }) => {
  return (
    <div className="border rounded-2xl p-4 hover:shadow-md transition-shadow bg-white">
      <Accordion
        defaultValue="property"
        type="single"
        collapsible
        className="w-full"
      >
        <AccordionItem value="property">
          <AccordionTrigger>
            <div className="w-full flex justify-between">
              <div>
                <p className="text-primary font-bold mb-3 cursor-pointer">
                  {property.property_name} {getStatusBadge(property.status)}
                </p>
                <p>{`${property.city}, ${property.address_line_1}`}</p>
                <p className="flex gap-2 text-sm">
                  <span>{property.property_type}</span>
                  <span>{property.units.length} Units</span>
                  <span>
                    {property.units.reduce(
                      (t: number, u: any) => t + u.rooms.length,
                      0
                    )}{" "}
                    Rooms
                  </span>
                  <span>
                    {property.units.reduce(
                      (t: number, u: any) => t + u.carparks.length,
                      0
                    )}{" "}
                    Car Parks
                  </span>
                </p>
              </div>
              <div>
                <PropertyDropdown property={property} />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Accordion
              type="single"
              collapsible
              defaultValue={property.units.map((u: any) => `${u.id}`)}
            >
              {property.units.map((unit: any) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PropertyCard;
