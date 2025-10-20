"use client";
import React, { useState } from "react";
import Image from "next/image";
import CustomInput from "@/components/CustomInput";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import useLogin from "@/lib/services/hooks/useLogin";
import { validationRegisterSchema } from "./utility";
import { LoaderCircle } from "lucide-react";
import { SelectWithForm } from "@/components/CustomSelect";
import Recaptcha from "@/components/ui/recaptcha";
import * as Yup from "yup";
import useRegister from "@/lib/services/hooks/useRegister";

import { toast } from "sonner";
interface RegisterModel {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
  rememberMe?: boolean;
  recaptcha: string;
}
interface Props {
  setStatus: (s: "Login" | "Register") => void;
}
const Register = ({ setStatus }: Props) => {
  const { mutate, error, isPending } = useRegister();
  type schemaType = Yup.InferType<typeof validationRegisterSchema>;
  const form = useForm<RegisterModel>({
    resolver: yupResolver(validationRegisterSchema),
    mode: "onTouched",
    defaultValues: { role: "Agency", recaptcha: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    getValues,
    reset,
    control,
    watch,
  } = form;
  const UserType = [
    { id: "Agency", name: "Agency" },
    { id: "Agent", name: "Agent" },
    { id: "Tenant", name: "Tenant" },
    { id: "Owner", name: "Owner" },
  ];
  const onSubmit: SubmitHandler<RegisterModel> = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Register successfully!");
        reset();
        setStatus("Login");
      },
    });
  };
  return (
    <div className="w-full   ">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white flex flex-col gap-5  justify-center mx-10 md:mx-25">
            <div className="flex justify-center gap-5 items-center">
              <Image src="/Logo.png" alt="Logo" width={200} height={100} />
            </div>
            <div>
              <div className="w-full text-center font-semibold text-3xl">
                <p>Register</p>
              </div>
              <div className="w-full text-center  text-md">
                <p>Rental Management System</p>
              </div>
            </div>
            {error && (
              <div className="bg-red-200 border-red-600 text-red-600 rounded-md px-2">
                {(error as any)?.errors &&
                  Object.values((error as any).errors)
                    .flat()
                    .map((err: any, index: number) => (
                      <div key={index}>{err}</div>
                    ))}
                {(error as any)?.message}
              </div>
            )}
            <div className="grid grid-cols-1  w-full   gap-3">
              <SelectWithForm<schemaType>
                name="role"
                title=""
                options={UserType}
              />
              <CustomInput
                key={"name"}
                id={"name"}
                name="name"
                type="text"
                value={watch("name")}
                label="Name"
                onChange={(e) => setValue("name", e.target.value)}
                errors={errors.name?.message}
                placeholder="Enter Your Name"
              />
              <CustomInput
                key={"email"}
                id={"email"}
                name="email"
                type="text"
                value={watch("email")}
                label="Email Address"
                onChange={(e) => setValue("email", e.target.value)}
                errors={errors.email?.message}
                placeholder="Enter Your Email"
              />
              <CustomInput
                key={"password"}
                id={"password"}
                name="password"
                type="password"
                value={watch("password")}
                label="Password"
                onChange={(e) => setValue("password", e.target.value)}
                errors={errors.password?.message}
                placeholder="Enter Your Password"
              />
              <CustomInput
                key={"confirm_password"}
                id={"confirm_password"}
                name="confirm_password"
                type="password"
                value={watch("confirm_password")}
                label="Confirm Password"
                onChange={(e) => setValue("confirm_password", e.target.value)}
                errors={errors.confirm_password?.message}
                placeholder="Enter Your Confirm Password"
              />
            </div>
            <div>
              <Recaptcha
                onChange={(verified, token) => {
                  if (verified && token) {
                    setValue("recaptcha", token);
                  } else {
                    setValue("recaptcha", "");
                  }
                }}
                error={errors.recaptcha?.message}
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full rounded-[6px] cursor-pointer text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </div>

          <div className=" flex justify-center space-x-2 text-lg">
            <span
              className="text-primary cursor-pointer"
              onClick={() => setStatus("Login")}
            >
              Already have an account ? Login
            </span>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Register;
