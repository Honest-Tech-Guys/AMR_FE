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
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import HeaderSection from "@/components/HeaderSection";

// Schema & type
const schema = yup.object({
  username: yup.string().required("User name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: yup.string().required("Role is required"),
  status: yup.string().required("Status is required"),
  remarks: yup.string().nullable(),
});

type schemaType = yup.InferType<typeof schema>;

const CreateNewUser = () => {
  const form = useForm<schemaType>({
    mode: "onTouched",
  });
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log("Form data:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white">Create New User</Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[800px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold">Create New User</div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderSection title="User Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                id="username"
                name="username"
                type="text"
                label="User Name"
                value={watch("username")}
                onChange={(e) => setValue("username", e.target.value)}
                errors={errors.username?.message}
                placeholder="Enter user name"
              />

              <CustomInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={watch("email")}
                onChange={(e) => setValue("email", e.target.value)}
                errors={errors.email?.message}
                placeholder="Enter email"
              />

              <CustomInput
                id="password"
                name="password"
                type="password"
                label="Password"
                value={watch("password")}
                onChange={(e) => setValue("password", e.target.value)}
                errors={errors.password?.message}
                placeholder="Enter password"
              />

              <CustomInput
                id="confirm_password"
                name="confirm_password"
                type="password"
                label="Confirm Password"
                value={watch("confirm_password")}
                onChange={(e) => setValue("confirm_password", e.target.value)}
                errors={errors.confirm_password?.message}
                placeholder="Re-enter password"
              />

              <CustomInput
                id="role"
                name="role"
                type="text"
                label="Role"
                value={watch("role")}
                onChange={(e) => setValue("role", e.target.value)}
                errors={errors.role?.message}
                placeholder="Enter role"
              />

              <CustomInput
                id="status"
                name="status"
                type="text"
                label="Status"
                value={watch("status")}
                onChange={(e) => setValue("status", e.target.value)}
                errors={errors.status?.message}
                placeholder="Enter status"
              />

              <div className="col-span-1 md:col-span-2">
                <CustomInput
                  id="remarks"
                  label="Remarks"
                  type="textArea"
                  name="remarks"
                  value={watch("remarks")}
                  onChange={(e) => setValue("remarks", e.target.value)}
                  placeholder="E.g. add notes about this user"
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

export default CreateNewUser;
