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
import HeaderSection from "@/components/HeaderSection";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";

import { useEffect, useState } from "react";
import useGetTenancyFieldList from "@/lib/services/hooks/useGetTenancyFieldList";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import AddItems from "../invoice/AddItems";

// ✅ Schema
const schema = yup.object({
  tenant: yup.string().required("Tenant is required"),
  tenancy: yup.string().required("Tenancy is required"),
  property_name: yup.string().required("Property name is required"),
  document_date: yup.string().required("Document Date is required"),
  remarks: yup.string().nullable(),
});
type schemaType = yup.InferType<typeof schema>;

const CreateExpenses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<schemaType>({
    mode: "onTouched",
  });
  const {
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: tenancies } = useGetTenancyFieldList(isOpen);
  const [tenancyData, setTenancyData] = useState([]);
  const [items, setItems] = useState<any[]>([]);

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log("Form data:", { ...data, items });
  };

  // ✅ Load tenancy data
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

  // ✅ Calculate totals
  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.unit_price || 0),
    0
  );
  const tax = 0;
  const total = subtotal + tax;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white">
          Create New Expenses
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1100px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white">
            Create New Expenses
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 🔹 Basic Information */}
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document Type */}
              <div>
                <Label className="mb-5">Document Type</Label>
                <RadioGroup
                  defaultValue="supplier_invoice"
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="supplier_invoice"
                      id="supplier_invoice"
                    />
                    <Label htmlFor="supplier_invoice">Supplier Invoice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="payment_voucher"
                      id="payment_voucher"
                    />
                    <Label htmlFor="payment_voucher">Payment Voucher</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Status */}
              <CustomInput
                id="status"
                name="status"
                type="text"
                label="Status"
                value="Draft"
                disabled
              />

              {/* Document Date */}
              <CustomInput
                id="document_date"
                name="document_date"
                type="date"
                label="Document Date"
                value={watch("document_date")}
                onChange={(e) => setValue("document_date", e.target.value)}
                errors={errors.document_date?.message}
              />

              {/* Supplier */}
              <CustomInput
                id="supplier"
                name="supplier"
                type="text"
                label="Supplier"
                placeholder="Enter supplier name"
              />

              {/* Property Name */}
              <SelectWithForm<schemaType>
                name="tenancy"
                title="Property Name"
                options={tenancyData}
              />

              {/* Equipment */}
              <SelectWithForm<schemaType>
                name="equipment"
                title="Equipment"
                options={[
                  { id: "1", name: "Fridge" },
                  { id: "2", name: "Aircond" },
                ]}
              />

              {/* Remarks */}
              <div className="col-span-1 md:col-span-2">
                <CustomInput
                  id="remarks"
                  name="remarks"
                  type="textArea"
                  label="Remarks"
                />
              </div>
            </div>

            {/* 🔹 Add Item Section */}
            <HeaderSection title="Add Item" />
            <Card className="p-4">
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
                      <TableCell>{item.tax_percentage ?? "-"}</TableCell>
                      <TableCell>{item.remarks ?? "-"}</TableCell>
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
              <div className="flex flex-col md:flex-row md:justify-between mt-4 gap-4">
                <AddItems setItems={setItems} />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sub Total</span>
                    <span>{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{total}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Remarks - This section is to bill for the invoice
              </p>
            </Card>

            {/* 🔹 Add Attachment Section */}
            <HeaderSection title="Add Attachment" />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mb-2">Max. File Size: 30MB</p>
              <Button variant="outline" className="rounded-[6px]">
                Browse File
              </Button>
            </div>

            {/* 🔹 Footer */}
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="text-white bg-green-700">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExpenses;
