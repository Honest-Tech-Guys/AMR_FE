import { Button } from "@/components/ui/button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
const schema = yup.object({
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
const BasicTap = () => {
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

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log("Form data:", data);
  };

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full gap-5">
            <div className="w-full">
              <div className="border-1 w-full">
                <div className="flex w-full items-center p-3 justify-between border-b-1">
                  <span>Basic Information</span>
                  <Button className="bg-transparent text-primary shadow-none hover:bg-transparent cursor-pointer">
                    More
                  </Button>
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Code</span>
                    <span>AuntieMichelle-T25000212</span>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Tenant Name:</span>
                    <div className="flex flex-col items-end">
                      <p className="text-primary">
                        Leong Wei Loon - META B-07-01 (R2)
                      </p>
                      <p>+60165134578</p>
                      weiloon3991@gmail.com
                    </div>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Period:</span>
                    <div className="flex flex-col items-end">
                      <p className="text-primary">01 Jun 2025 - 31 May 2026</p>
                      <Badge className="bg-black text-white rounded-[6px]">
                        363 days
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Rental Fees:</span>
                    <span>MYR 770 / Monthly</span>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Property:</span>
                    <span>Meta Residence @ Seri Kembangan</span>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Unit:</span>
                    <span>B-07-01</span>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Room:</span>
                    <span>Room 2</span>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Address:</span>
                    <span>
                      Room 2, B-07-01, Jalan Atmosphere Utama 2,, Seri
                      Kembangan, 43400, Selangor, Malaysia
                    </span>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Auto Direct Debit:</span>
                    <Badge className="bg-gray-100 text-black font-normal rounded-[6px]  border-1">
                      Auto Pay Not Activated
                    </Badge>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Created At:</span>
                    <span>2025-06-01 10:13:03</span>
                  </div>
                </div>
              </div>
              <div className="border-1 w-full my-5">
                <div className="flex w-full items-center p-3 justify-between border-b-1">
                  <span>Other Information</span>
                </div>
                <div className="flex flex-col px-10 gap-3 py-5">
                  <div className="flex w-full">
                    <Label className="w-full">
                      Electricity Price Per Unit :
                    </Label>
                    <Input placeholder="0.00" className="w-full" />
                  </div>
                  <div className="flex w-full">
                    <Label className="w-full">House Deposit :</Label>
                    <Input placeholder="0.00" className="w-full" />
                  </div>
                  <div className="flex w-full">
                    <Label className="w-full">Utility Deposit :</Label>
                    <Input placeholder="0.00" className="w-full" />
                  </div>
                  <div className="flex w-full">
                    <Label className="w-full">Key Deposit :</Label>
                    <Input placeholder="0.00" className="w-full" />
                  </div>
                  <div className="flex w-full">
                    <Label className="w-full">Fit Up Deposit :</Label>
                    <Input placeholder="0.00" className="w-full" />
                  </div>
                  <div className="flex w-full">
                    <Label className="w-full">Restoration Deposit :</Label>
                    <Input placeholder="0.00" className="w-full" />
                  </div>
                  <div className="flex w-full">
                    <Label className="w-full">Other Deposit :</Label>
                    <Input placeholder="0.00" className="w-full" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-3  ">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit" className="text-white">
                  Submit
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-5 w-[35%]">
              <div className="border-1 w-full">
                {" "}
                <div className="flex w-full items-center p-3 justify-between border-b-1">
                  <span>E-Agreement</span>
                </div>
                <div className="flex flex-col gap-3 py-5 items-center">
                  <span className="text-xs">
                    You do not have any E-agreement
                  </span>
                  <Button className="text-white">
                    <Plus />
                    New Agreement
                  </Button>
                </div>
              </div>
              <div className="border-1 w-full">
                {" "}
                <div className="flex w-full items-center p-3 justify-between border-b-1">
                  <span>Extra Tenant</span>
                </div>
                <div className="flex flex-col gap-3 py-5 items-center">
                  <span className="text-xs">
                    You do not have any new tenant
                  </span>
                  <Button className="text-white">
                    <Plus />
                    Extra Tenant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default BasicTap;
