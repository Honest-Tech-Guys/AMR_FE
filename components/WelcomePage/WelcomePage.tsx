"use client";
import Login from "@/components/LogIn/Login";
import { useState } from "react";
import CarouselWithPagination from "./CarouselImages";
import Register from "@/components/Register/Register";
const WelcomePage = () => {
  const [status, setStatus] = useState<"Login" | "Register">("Login");

  return (
    <div className="flex h-screen">
      <div className="relative w-full justify-center items-center  overflow-hidden hidden md:flex  ">
        <img src={"/LoginImg.png"} className="h-[95vh] w-[40vw] rounded-3xl" />
        <div className="absolute bottom-6">
          <div className="backdrop-blur-xs bg-black/10 p-6 rounded-lg w-[530px]">
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
