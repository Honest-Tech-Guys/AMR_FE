"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import useGetUser from "@/lib/services/hooks/useGetUser";
import useTopUp from "@/lib/services/hooks/useTopUp";
import TopUpRadio, { TopUpOption } from "../RaidoCredit";
import { Label } from "../ui/label";
// Schema & type
const schema = yup.object({
  amount: yup.string().required(),
});
type schemaType = yup.InferType<typeof schema>;
interface Props {
  balance?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const TopUp = ({ balance, open, onOpenChange }: Props) => {
  const { mutate, isPending } = useTopUp();

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
    mutate(parseInt(data.amount), {
      onSuccess: () => {
        // toast.success("Profile updated successfully!");
        reset();

        onOpenChange(false);
      },
    });
  };
  const options: TopUpOption[] = [
    { value: "200", label: "RM 200.00", description: "184" },
    { value: "500", label: "RM 500.00", description: "460" },
    { value: "1000", label: "RM 1000.00", description: "920" },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[500px] bg-white md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold rounded-[6px] bg-white ">
            Top Up Credit
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label className="my-3"> Select a top-up amount</Label>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <TopUpRadio
                  options={options}
                  value={field.value}
                  setValue={field.onChange} // ✅ this matches the expected (val: string) => void
                />
              )}
            />
            <DialogFooter className="w-full flex mt-6 sm:justify-between">
              <div>Current Credit: {balance}</div>
              <div className="flex gap-3">
                <Button
                  className="bg-black text-white hover:bg-black/70"
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-white text-center"
                  disabled={isPending || !watch("amount")}
                >
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default TopUp;
