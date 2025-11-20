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
import useCreateBulkProperty from "@/lib/services/hooks/useCreateBulkProperty";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CreateBulk from "./CreateBulk";
import ErrorToastHandel from "@/components/ErrorToastHandel";
import { useQueryClient } from "@tanstack/react-query";
// Schema & type

const CreateBulkPropertyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    mode: "onTouched",
  });

  const { mutate, isPending } = useCreateBulkProperty();
  const queryClient = useQueryClient();
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
        queryClient.invalidateQueries({ queryKey: ["GetPropertiesList"] });
        setProperties([]);
        setIsOpen(false);
      },
      onError: (err: any) => {
        ErrorToastHandel(err);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-black to-black/80  text-white px-6 py-3 rounded-[6px] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
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
