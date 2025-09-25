"use client";

import CustomInput from "@/components/CustomInput";
import { SelectWithForm } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import HeaderSection from "@/components/HeaderSection";
import PhoneInput from "@/components/phone-input";
import useAddProperty from "@/lib/services/hooks/useAddProperties";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGetOwnersSelection from "@/lib/services/hooks/useGetOwnerSelection";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import CreateBulk from "./CreateBulk";
import useCreateBulkProperty from "@/lib/services/hooks/useCreateBulkProperty";
// Schema & type
const schema = yup.object({
  postcode: yup.string().required("Country is required"),
  city: yup.string().required("Country is required"),
  state: yup.string().required("Country is required"),
  property_name: yup.string().required("Property name is required"),
  property_type: yup.string().required("Property type is required"),
  owner_id: yup.string().required("Owner is required"),
  owner_phone_number: yup.string().required("Owner phone number is required"),
  contact_name: yup.string().required("Contact name is required"),
  contact_phone_number: yup
    .string()
    .required("Contact phone number is required"),
  remarks: yup.string().nullable(),
  address: yup.string().required("Address is required"),
  meeting_room: yup.boolean().default(false),
  game_room: yup.boolean().default(false),
  basketball_court: yup.boolean().default(false),
  sauna: yup.boolean().default(false),
  free_text: yup.boolean().default(false),
});
type schemaType = yup.InferType<typeof schema>;

const CreateBulkPropertyModal = () => {
  const [owners, setOwners] = useState<{ id: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<schemaType>({
    mode: "onTouched",
  });
  const {
    setValue,
    getValues,
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const { mutate, isPending } = useCreateBulkProperty();
  const { data } = useGetOwnersSelection();
  const { refetch } = useGetPropertiesList({});
  useEffect(() => {
    if (data) {
      const dataT = data.map((owner) => {
        return { id: `${owner.id}`, name: owner.name };
      });
      setOwners(dataT);
    }
  }, [data]);
  const cities = [
    { id: "johor", name: "Johor" },
    { id: "kedah", name: "Kedah" },
    { id: "kelantan", name: "Kelantan" },
    { id: "malacca", name: "Malacca" },
    { id: "negeriSembilan", name: "Negeri Sembilan" },
    { id: "pahang", name: "Pahang" },
    { id: "perak", name: "Perak" },
    { id: "perlis", name: "Perlis" },
    { id: "penang", name: "Penang" },
    { id: "selangor", name: "Selangor" },
    { id: "terengganu", name: "Terengganu" },
    { id: "sabah", name: "Sabah" },
    { id: "sarawak", name: "Sarawak" },
    { id: "kualaLumpur", name: "Kuala Lumpur" },
    { id: "putrajaya", name: "Putrajaya" },
  ];

  const PartnerType = [
    { id: "Apartment1", name: "Apartment" },
    { id: "Condominium", name: "Condominium" },
    { id: "Flat", name: "Flat" },
    { id: "Landed", name: "Landed" },
    { id: "Townhouse", name: "Townhouse" },
  ];
  const facilities = [
    { id: "meeting_room", label: "Meeting Room" },
    { id: "game_room", label: "Game Room" },
    { id: "basketball_court", label: "Basketball Court" },
    { id: "sauna", label: "Sauna" },
  ] as const;
  type FacilityId = (typeof facilities)[number]["id"];
  type Payload = {
    property_name: string;
    owner_id: string;
    owner_name: string;
    owner_phone: string;
    contact_name: string | null;
    contact_phone: string | null;
    property_type: string;
    remarks: string;
    address_line_1: string | null;
    country: string;
    city: string;
    state: string;
    postcode: string;
    facilities: string[];
  };
  const [Properties, setProperties] = useState<Payload[]>([]);
  const onSubmit = () => {
    mutate(Properties, {
      onSuccess: () => {
        toast.success(`properties created successfully!`);
        reset();
        refetch();
        setIsOpen(false);
      },
      onError: (err) => {
        toast.error("Failed to create all properties");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black rounded-[6px] text-white hover:bg-black/70 cursor-pointer">
          Create Bulk Property
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
              <TableHead>Property Name</TableHead>
              <TableHead>Property Type</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Facilities</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Properties.map((property) => (
              <TableRow key={property.property_name}>
                <TableCell>{property.property_name}</TableCell>
                <TableCell>{property.property_type}</TableCell>
                <TableCell>{property.owner_name}</TableCell>
                <TableCell>{property.contact_name}</TableCell>
                <TableCell>
                  {property.city},{property.state},{property.address_line_1}
                </TableCell>
                <TableCell>
                  {property.facilities
                    ?.map((f: string) =>
                      f
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                    )
                    .join(", ")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setProperties((prev) =>
                        prev.filter(
                          (_, index) => index !== Properties.indexOf(property)
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
        <CreateBulk payload={Properties} setPayload={setProperties} />

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

export default CreateBulkPropertyModal;
