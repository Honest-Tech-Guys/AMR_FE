import { Button } from "@/components/ui/button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Unit } from "@/types/UnitType";
import { Room } from "@/types/RoomType";
import { Tenancy } from "@/types/TenancyType";
import { daysBetween, formatDate } from "@/lib/utils";
import CreateAgreement from "../Agreement/CreateAgreement";
import { useState } from "react";
import ViewAgreement from "../Agreement/VeiwAgreement";
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
interface Props {
  tenancy: Tenancy;
}
const BasicTap = ({ tenancy }: Props) => {
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
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <div className="min-h-[70vh]">
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
                    <span>{tenancy.code}</span>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Tenant Name:</span>
                    <div className="flex flex-col items-end">
                      <p className="text-primary">{tenancy.tenant.name}</p>
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
                      <p className="text-primary">
                        {tenancy.tenancy_period_start_date} -{" "}
                        {tenancy.tenancy_period_end_date}
                      </p>
                      <Badge className="bg-black text-white rounded-[6px]">
                        {daysBetween(
                          tenancy.tenancy_period_start_date,
                          tenancy.tenancy_period_end_date
                        )}{" "}
                        days
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                </div>
                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Rental Fees:</span>
                    <span>
                      MYR {tenancy.rental_fee} /{" "}
                      {tenancy.rental_payment_frequency}
                    </span>
                  </div>
                  <Separator />
                </div>
                {/* <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Property:</span>
                    <span>{tenancy.full_property_name}</span>
                  </div>
                  <Separator />
                </div> */}
                {"unit" in tenancy.tenantable ? (
                  <div>
                    <div className="flex w-full items-center p-3 justify-between">
                      <span>Property:</span>
                      <span>
                        {
                          (tenancy.tenantable as Room).unit.property
                            .property_name
                        }
                      </span>
                    </div>
                    <Separator />
                  </div>
                ) : (
                  <div>
                    <div className="flex w-full items-center p-3 justify-between">
                      <span>Property:</span>
                      <span>
                        {(tenancy.tenantable as Unit).property.property_name}
                      </span>
                    </div>
                    <Separator />
                  </div>
                )}
                {"unit" in tenancy.tenantable ? (
                  <div>
                    <div className="flex w-full items-center p-3 justify-between">
                      <span>Unit:</span>
                      <span>
                        {
                          (tenancy.tenantable as Room).unit
                            .block_floor_unit_number
                        }
                      </span>
                    </div>
                    <Separator />
                  </div>
                ) : (
                  <div>
                    <div className="flex w-full items-center p-3 justify-between">
                      <span>Unit:</span>
                      <span>
                        {(tenancy.tenantable as Unit).block_floor_unit_number}
                      </span>
                    </div>
                    <Separator />
                  </div>
                )}

                {"unit" in tenancy.tenantable ? (
                  <div>
                    <div className="flex w-full items-center p-3 justify-between">
                      <span>Room:</span>
                      <span>{(tenancy.tenantable as Room).name}</span>
                    </div>
                    <Separator />
                  </div>
                ) : null}

                <div>
                  <div className="flex w-full items-center p-3 justify-between">
                    <span>Address:</span>
                    {/* <span>{(tenancy.tenantable as Unit).property.city}</span> */}
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
                    <span>{formatDate(tenancy.created_at)}</span>
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
            <div className="flex flex-col gap-5 w-[40%]">
              <div className="border-1 w-full ">
                {" "}
                <div className="flex w-full items-center p-3 py-4.5 justify-between border-b-1">
                  <span>E-Agreement</span>
                </div>
                {tenancy.agreement ? (
                  <div className="flex flex-col gap-3 p-3 ">
                    <span
                      className="text-primary underline text-sm cursor-pointer"
                      onClick={() => {
                        setOpenEdit(true);
                      }}
                    >
                      {tenancy.agreement.id}
                    </span>
                    <span className="text-sm">
                      Created Date :{formatDate(tenancy.agreement.created_at)}
                    </span>
                    <span className="text-sm">
                      Agreement Period :{tenancy.agreement.start_date}
                      {"-"}
                      {tenancy.agreement.end_date}
                    </span>
                    <span className="text-sm">
                      Landlord :{tenancy.agreement.landlord_name}
                    </span>
                    <span className="text-sm">
                      Tenant :{tenancy.agreement.tenant_name}
                    </span>
                    {/* <span className="text-xs">
                      Status :{tenancy.agreement}
                    </span> */}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 py-5 items-center">
                    <span className="text-xs">
                      You do not have any E-agreement
                    </span>

                    <CreateAgreement
                      id={tenancy.id}
                      open={open}
                      onOpenChange={setOpen}
                    />
                  </div>
                )}
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
      {tenancy.agreement ? (
        <ViewAgreement
          open={openEdit}
          onChangeOpen={setOpenEdit}
          id={tenancy.id}
          initialData={tenancy.agreement}
        />
      ) : null}
    </div>
  );
};

export default BasicTap;
