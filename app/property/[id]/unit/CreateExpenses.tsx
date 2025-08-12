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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenLine, Plus, Search, Share2, Trash2 } from "lucide-react";
// import AddItems from "../invoice/AddItems";
import DragAndDropFiles from "@/components/input-12";
import AddItems from "@/app/accounting/invoice/AddItems";
// Schema & type
const schema = yup.object({
  status: yup.string().required(""),
  document_date: yup.string().required(""),
  supplier: yup.string().required(""),
  property_name: yup.string().required(""),
  equipment: yup.string().required(""),
  remarks: yup.string().nullable(),
  additional_notes: yup.string().nullable(),
});
type schemaType = yup.InferType<typeof schema>;
const CreateExpenses = () => {
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
  const COUNTRIES = [
    { id: "us", name: "United States" },
    { id: "uk", name: "United Kingdom" },
    { id: "ca", name: "Canada" },
    { id: "au", name: "Australia" },
    { id: "fr", name: "France" },
    { id: "de", name: "Germany" },
    { id: "jp", name: "Japan" },
    { id: "br", name: "Brazil" },
  ];
  const PartnerType = [
    { id: "1", name: "Apartment" },
    { id: "2", name: "Condominium" },
    { id: "3", name: "Flat " },
    { id: "4", name: "Landed" },
    { id: "5", name: "Townhouse" },
  ];

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log("Form data:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white">
          Create New Expenses
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Expenses
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
                    <RadioGroupItem value="comfortable" id="payment_voucher" />
                    <Label htmlFor="payment_voucher">Payment Voucher</Label>
                  </div>
                </RadioGroup>
              </div>
              <CustomInput
                id="status"
                name="status"
                type="text"
                label="Status"
                value={watch("status")}
                onChange={(e) => setValue("status", e.target.value)}
                errors={errors.status?.message}
                placeholder="Enter Status"
              />
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
                name="supplier"
                title="Supplier"
                options={PartnerType}
              />

              <SelectWithForm<schemaType>
                name="property_name"
                title="Property Name"
                options={PartnerType}
              />
              <SelectWithForm<schemaType>
                name="equipment"
                title="Equipment"
                options={PartnerType}
              />
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
            <div>
              <HeaderSection title="Add Items" />
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
                  <TableRow>
                    <TableCell>Key Deposit</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>

                    <TableCell>
                      <Trash2 className="text-red-700" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex justify-between mt-5">
                <div>
                  <AddItems />
                </div>
                <div className="flex border-1 justify-end">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-primary font-medium">
                          Sub total
                        </TableCell>
                        <TableCell>1,200</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-primary font-medium">
                          Tax
                        </TableCell>
                        <TableCell>0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-primary font-medium">
                          Total
                        </TableCell>
                        <TableCell>1,200</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div>
                <HeaderSection title="Add Attachment" />
                {/* <CustomInput
                  id="additional_notes"
                  // label="Remarks"
                  type="textArea"
                  name="additional_notes"
                  value={watch("additional_notes")}
                  onChange={(e) => setValue("additional_notes", e.target.value)}
                  placeholder="E.g describe more about the reason for change"
                  className="bg-gray-100"
                  errors={errors.additional_notes?.message}
                /> */}
                <DragAndDropFiles
                  description={
                    <div className="text-center mb-3">
                      <p className="text-md">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs font-bold">Max. File Size: 30MB</p>
                    </div>
                  }
                  buttonLabel={
                    <div className="flex gap-3 items-center">
                      {" "}
                      <Search /> <span>Browser File</span>
                    </div>
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="text-white">
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
