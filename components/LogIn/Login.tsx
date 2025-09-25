"use client";
import React, { useState } from "react";
import Image from "next/image";
import CustomInput from "@/components/CustomInput";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import useLogin from "@/lib/services/hooks/useLogin";
import LoginModel from "@/types/LoginModelType";
import { validationLoginSchema } from "./utility";
import { LoaderCircle } from "lucide-react";
import { SelectWithForm } from "@/components/CustomSelect";
import * as Yup from "yup";
interface Props {
  setStatus: (s: "Login" | "Register") => void;
}
const Login = ({ setStatus }: Props) => {
  const { mutate, error, isPending } = useLogin();
  type schemaType = Yup.InferType<typeof validationLoginSchema>;
  const form = useForm<LoginModel>({
    resolver: yupResolver(validationLoginSchema),
    mode: "onTouched",
    defaultValues: { role: "Agency" },
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
  const onSubmit: SubmitHandler<LoginModel> = (data) => {
    mutate(data);
  };
  return (
    <div className="w-full   ">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white flex flex-col gap-5 h-[80vh]  justify-center mx-10 md:mx-25">
            <div className="flex justify-center gap-5 items-center">
              <Image src="/Logo.png" alt="Logo" width={200} height={100} />
            </div>
            <div>
              <div className="w-full text-center font-semibold text-3xl">
                <p>Welcome back</p>
              </div>
              <div className="w-full text-center  text-md">
                <p>Rental Management System</p>
              </div>
            </div>
            {error && (
              <div className="bg-red-200 border-red-600 text-red-600 rounded-md px-2">
                {error.message}
              </div>
            )}
            <div className="grid grid-cols-1  w-full   gap-5">
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
              <SelectWithForm<schemaType>
                name="role"
                title=""
                options={UserType}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="mt-2">
                <CustomInput
                  id={"rememberMe"}
                  name={"rememberMe"}
                  label={"Remember Me"}
                  type="checkbox"
                  checkboxDefaultValue={watch("rememberMe")}
                  onCheckedChange={(checked) => {
                    setValue("rememberMe", checked as boolean);
                  }}
                />
              </div>
              <div className="text-primary text-sm">Forgot your password?</div>
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
                  "Login"
                )}
              </Button>
            </div>
          </div>
          {watch("role") !== "Agency" ? (
            <div className=" flex justify-center space-x-2 text-lg">
              <span>Don't have an account? </span>
              <span
                className="text-primary cursor-pointer"
                onClick={() => setStatus("Register")}
              >
                Create an account
              </span>
            </div>
          ) : null}
          {/* */}
        </form>
      </FormProvider>
    </div>
  );
};

export default Login;
