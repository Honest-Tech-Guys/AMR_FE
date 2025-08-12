"use client";

import CustomInput from "@/components/CustomInput";
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
import MultiFileUpload from "@/components/input-11";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Schema & type
const schema = yup.object({
  batch_number: yup.string().required("Batch number is required"),
  title: yup.string().required("Title is required"),
  status: yup.string().required("Status is required"),
  payee: yup.string().required("Payee is required"),
  property: yup.string().required("Property is required"),
  document: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("File name is required"),
        size: yup.number().required("File size is required"),
        type: yup.string().required("File type is required"),
        base64: yup.string().required("File content is required"),
      })
    )
    .min(1, "proposed attach form is required")
    .required("proposed attach form is required"),
  country: yup.string().required("Country is required"),
  postcode: yup.string().required("Country is required"),
  city: yup.string().required("Country is required"),
  state: yup.string().required("Country is required"),
  property_name: yup.string().required("Property name is required"),
  property_type: yup.string().required("Property type is required"),
  owner_name: yup.string().required("Owner name is required"),
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
const CreateNewPayout = () => {
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
  const facilities = [
    { id: "meeting_room", label: "Meeting Room" },
    { id: "game_room", label: "Game Room" },
    { id: "basketball_court", label: "Basketball Court" },
    { id: "sauna", label: "Sauna" },
    { id: "free_text", label: "Free Text" },
  ];
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    const facilitiesList = facilities
      .filter((f) => data[f.id]) // only where checkbox is true
      .map((f) => f.id);
    console.log("Form data:", facilitiesList);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white">Create New Payout</Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[1000px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Create New Payout
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="batch_number"
                name="batch_number"
                type="text"
                label="Batch Number"
                value={watch("batch_number")}
                onChange={(e) => setValue("batch_number", e.target.value)}
                errors={errors.batch_number?.message}
                placeholder="Enter Batch Number"
              />

              <CustomInput
                id="title"
                name="title"
                type="text"
                label="Title"
                value={watch("title")}
                onChange={(e) => setValue("title", e.target.value)}
                errors={errors.title?.message}
                placeholder="Enter Title"
              />
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
                id="payee"
                name="payee"
                type="text"
                label="Payee"
                value={watch("payee")}
                onChange={(e) => setValue("payee", e.target.value)}
                errors={errors.payee?.message}
                placeholder="Enter Payee"
              />

              <CustomInput
                id="property"
                name="property"
                type="text"
                value={watch("property")}
                label="Property"
                onChange={(e) => setValue("property", e.target.value)}
                errors={errors.property?.message}
                placeholder="Enter Property"
              />
              <div className="space-y-2 ">
                <span className="font-semibold">Document</span>
                <Controller
                  control={control}
                  name="document"
                  rules={{ required: "Document is required" }}
                  render={({ field: { onChange, value } }) => (
                    <MultiFileUpload
                      isMulti={false}
                      field="document"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.document && (
                  <span className="text-red-500 text-sm">
                    {errors.document.message}
                  </span>
                )}
              </div>
            </div>
            <HeaderSection title="Rental Information" />
            <div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 text-xs">
                    <TableHead>#</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Original Amount</TableHead>
                    <TableHead>+/- Amount</TableHead>
                    <TableHead>Final Amount</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      {" "}
                      <div className="flex flex-col">
                        <p className="text-primary">
                          AuntieMichelle-IV22005990 Zhang ZhiHao - A-12
                        </p>
                        <p>INVOICE</p>
                        Rental -March 2025
                      </div>
                    </TableCell>
                    <TableCell>1,100.00</TableCell>
                    <TableCell>
                      <Input className="bg-transparent max-w-[100px]" />
                    </TableCell>
                    <TableCell>1,100.00</TableCell>
                    <TableCell>
                      <Textarea />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div>
              <Table>
                <TableBody className="justify-end text-right">
                  <TableRow>
                    <TableCell>Total Income</TableCell>
                    <TableCell className="text-center">1,100.00</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Adjustment</TableCell>
                    <TableCell className="text-center">0.00</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sub Total</TableCell>
                    <TableCell className="text-center">1,100.00</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Profit Sharing (N/A)</TableCell>
                    <TableCell className="text-center">0.00</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Management Fees</TableCell>
                    <TableCell className="text-center">0.00</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Total Management Charges
                    </TableCell>
                    <TableCell className="text-center text-[#337AB7]">
                      0.00
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Payout Amount</TableCell>
                    <TableCell className="text-center">1,100.00</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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

export default CreateNewPayout;
