"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileIcon, ImageIcon, Plus, XCircleIcon } from "lucide-react";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { Button } from "./ui/button";
import { toBase64 } from "./input-11";

export interface FileData {
  name: string;
  size: number;
  type: string;
  url: string; // URL.createObjectURL
}

interface Props {
  label?: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  value: FileData[];
  onChange: (files: FileData[]) => void;
  isMulti?: boolean;
}

export default function DragAndDropFiles({
  label,
  description,
  buttonLabel,
  value,
  onChange,
  isMulti = true,
}: Props) {
  const handleDrop = async (acceptedFiles: File[]) => {
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        base64: await toBase64(file),
      }))
    );

    if (isMulti) {
      onChange([...value, ...newFiles]);
    } else {
      onChange(newFiles.slice(0, 1));
    }
  };

  const handleRemove = (fileUrl: string) => {
    onChange(value.filter((f) => f.url !== fileUrl));
  };

  return (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      <div className="mt-2 w-full">
        <Dropzone onDrop={handleDrop}>
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
                "border cursor-pointer w-full bg-gray-50 border-dashed flex items-center justify-center py-5 rounded-md focus:outline-none",
                {
                  "border-primary ": isDragActive && isDragAccept,
                  "border-destructive ": isDragActive && isDragReject,
                }
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                {description && (
                  <div className="text-gray-500 mb-2">{description}</div>
                )}
                {buttonLabel ? (
                  <Button className="text-white rounded-[6px] cursor-pointer">
                    {buttonLabel}
                  </Button>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Plus size={16} /> Upload File
                  </span>
                )}
              </div>
            </div>
          )}
        </Dropzone>

        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {value.map((file) => (
              <div
                key={file.url}
                className="relative border rounded-md p-2 flex flex-col items-center"
              >
                <button
                  className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
                  onClick={() => handleRemove(file.url)}
                >
                  <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
                </button>
                {file.type.startsWith("image/") ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    height={120}
                    width={120}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <FileIcon className="h-12 w-12 text-gray-400" />
                    <span className="text-xs text-center mt-1">
                      {file.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
