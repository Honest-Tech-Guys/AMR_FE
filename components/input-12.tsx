"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, Plus, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";
import Dropzone from "react-dropzone";
import { Button } from "./ui/button";

const ImagePreview = ({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) => (
  <div className="relative">
    <button
      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
      onClick={onRemove}
    >
      <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
    </button>
    <Image
      src={url}
      height={500}
      width={500}
      alt=""
      className="border border-border h-full w-full rounded-md object-cover"
    />
  </div>
);
interface Props {
  label?: ReactNode;
  description?: ReactNode;
  buttonLabel?: ReactNode;
}
export default function DragAndDropFiles({
  label,
  description,
  buttonLabel,
}: Props) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  return (
    <div className="w-full ">
      {label && <Label htmlFor="profile">{label}</Label>}
      <div className="mt-1 w-full">
        {profilePicture ? (
          <ImagePreview
            url={profilePicture}
            onRemove={() => setProfilePicture(null)}
          />
        ) : (
          <Dropzone
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                setProfilePicture(imageUrl);
              }
            }}
            accept={{
              "image/png": [".png", ".jpg", ".jpeg", ".webp"],
            }}
            maxFiles={1}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "border cursor-pointer w-full bg-gray-100 border-dashed flex items-center justify-center py-5 rounded-md focus:outline-none focus:border-primary",
                  {
                    "border-primary ": isDragActive && isDragAccept,
                    "border-destructive ": isDragActive && isDragReject,
                  }
                )}
              >
                <input {...getInputProps()} id="profile" />
                <div className="flex flex-col items-center">
                  {description && (
                    <div className="text-gray-500">{description}</div>
                  )}
                  {buttonLabel ? (
                    <Button className="text-white rounded-[6px] cursor-pointer">
                      {buttonLabel}
                    </Button>
                  ) : (
                    <span className="flex ">
                      <Plus /> File{" "}
                    </span>
                  )}
                </div>
                {/* <ImageIcon className="h-16 w-16" strokeWidth={1.25} /> */}
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}
