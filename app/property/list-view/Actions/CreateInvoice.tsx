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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AddItems from "@/app/accounting/invoice/AddItems";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import useGetTenancyFieldList from "@/lib/services/hooks/useGetTenancyFieldList";
import useCreateInvoice from "@/lib/services/hooks/useCreateInvoice";
// Schema & type
const schema = yup.object({
  tenant: yup.string().required("Tenant is required"),
  tenancy: yup.string().required("Tenancy is required"),
  property_name: yup.string().required("Property name is required"),
  document_date: yup.string().required("Document Date is required"),

  remarks: yup.string().nullable(),
});

type schemaType = yup.InferType<typeof schema>;
interface Props {
  id: number;
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void;
}
const CreateInvoice = ({ id, open, onOpenChange }: Props) => {
  const [tenancyData, setTenancyData] = useState([]);
  const [items, setItems] = useState<any[]>([]);
  const { data: tenancies } = useGetTenancyFieldList();
  const { mutate } = useCreateInvoice();
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

  useEffect(() => {
    if (tenancies) {
      const dataT = tenancies.map((t: any) => ({
        id: `${t.id}`,
        name: t.code,
        tenant_name: t.tenant_name,
        full_property_name: t.full_property_name,
      }));

      setTenancyData(dataT as never);

      const selectedTenancyId = watch("tenancy");
      if (selectedTenancyId) {
        const selectedTenancy = dataT.find(
          (item: any) => item.id === selectedTenancyId
        );

        if (selectedTenancy) {
          setValue("tenant", selectedTenancy.tenant_name);
          setValue("property_name", selectedTenancy.full_property_name);
        }
      }
    }
  }, [tenancies, watch("tenancy"), setValue]);
  const [status, setStatus] = useState<"Draft" | "Sent">("Draft");
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    const api_data = {
      tenancy_id: data.tenancy,
      due_date: data.document_date,
      issue_date: data.document_date,
      notes: data.remarks,
      items: items,
      status: status,
    };
    mutate(api_data, {
      onSuccess: () => {
        toast.success("Invoice created successfully!");
        reset();
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error((err as any)?.message || "Failed to create Invoice");
      },
    });
    console.log("Form data:", api_data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button className="rounded-[6px] bg-transparent hover:bg-transparent m-0 shadow-none p-0 text-black font-normal text-start">
          Add Invoice
        </Button>
      </DialogTrigger> */}

      <DialogContent className="md:max-w-[1000px] bg-white z-400 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Invoice
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-5">Document Type</Label>
                <RadioGroup
                  defaultValue="comfortable"
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="supplier_invoice" />
                    <Label htmlFor="supplier_invoice">Supplier Invoice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="deposit_notes" />
                    <Label htmlFor="deposit_notes">Deposit Notes</Label>
                  </div>
                </RadioGroup>
              </div>
              <CustomInput
                id="document_date"
                name="document_date"
                type="date"
                label="Document Date"
                value={watch("document_date")}
                onChange={(e) => setValue("document_date", e.target.value)}
                errors={errors.document_date?.message}
                placeholder="Enter Document Date"
              />
              <SelectWithForm<schemaType>
                name="tenancy"
                title="Tenancy"
                options={tenancyData}
              />
              <CustomInput
                id="tenant"
                name="tenant"
                type="text"
                label="Tenant"
                value={watch("tenant")}
                onChange={(e) => setValue("tenant", e.target.value)}
                errors={errors.tenant?.message}
                placeholder=""
                disabled={true}
              />
              <div className="col-span-1 md:col-span-2">
                {" "}
                <CustomInput
                  id="property_name"
                  name="property_name"
                  type="text"
                  label="Property Name"
                  value={watch("property_name")}
                  onChange={(e) => setValue("property_name", e.target.value)}
                  errors={errors.document_date?.message}
                  placeholder=""
                  disabled={true}
                />
              </div>{" "}
              <div className="col-span-2">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 text-xs">
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.item_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit_price}</TableCell>
                        <TableCell>{item.tax_percentage}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                        <TableCell>
                          <Trash2
                            className="text-red-700 cursor-pointer"
                            onClick={() =>
                              setItems(items.filter((_, i) => i !== index))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <AddItems setItems={setItems} />
              </div>
              <div className="col-span-1 md:col-span-2">
                <CustomInput
                  id="remarks"
                  label="Remarks"
                  type="textArea"
                  name="remarks"
                  value={watch("remarks")}
                  onChange={(e) => setValue("remarks", e.target.value)}
                  placeholder="E.g describe more about the reason for change"
                  className="bg-gray-100"
                  errors={errors.remarks?.message}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={() => setStatus("Draft")}
                className="text-white"
              >
                Save As Draft
              </Button>
              <Button
                type="submit"
                onClick={() => setStatus("Sent")}
                className="text-white"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoice;
