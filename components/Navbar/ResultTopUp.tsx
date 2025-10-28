"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
// Schema & type
interface Props {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}

const ResultTopUp = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] text-white">Create New User</Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[500px] bg-white z-200 md:p-10 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full text-2xl font-bold">Payment Success</div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ResultTopUp;
