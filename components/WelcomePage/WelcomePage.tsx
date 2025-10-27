"use client";
import Login from "@/components/LogIn/Login";
import { useState } from "react";
import CarouselWithPagination from "./CarouselImages";
import Register from "@/components/Register/Register";
const WelcomePage = () => {
  const [status, setStatus] = useState<"Login" | "Register">("Login");

  return (
    <div className="flex h-screen">
      <div className="relative w-full justify-center items-center  overflow-hidden hidden md:flex ml-25 ">
        <img src={"/LoginImg.png"} className="h-[93vh] w-full rounded-3xl " />
        <div className="absolute bottom-6 px-5 pb-5">
          <div className=" backdrop-blur-xs bg-black/10 p-6 rounded-lg w-full  ">
            <CarouselWithPagination />
          </div>
        </div>
      </div>
      {status === "Login" ? (
        <Login setStatus={setStatus} />
      ) : (
        <Register setStatus={setStatus} />
      )}
    </div>
  );
};

export default WelcomePage;
