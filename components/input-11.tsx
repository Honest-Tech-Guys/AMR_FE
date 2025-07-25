"use client";

import { useRef, useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FileData } from "@/types/FileData";

interface MultiFileUploadProps {
  field: string;

  value?: FileData[]; // <-- added
  isMulti: boolean;
  onChange?: (files: FileData[]) => void; // <-- added
}

export default function MultiFileUpload({
  field,
  value = [],
  onChange,
  isMulti,
}: Readonly<MultiFileUploadProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileData[]>(value || []);

  useEffect(() => {
    const isEqual =
      files.length === value?.length &&
      files.every((f, i) => f.base64 === value?.[i]?.base64);

    if (!isEqual) {
      setFiles(value || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles);
      const base64Files = await Promise.all(
        filesArray.map(async (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          base64: await toBase64(file),
        }))
      );
      console.log(base64Files);
      setFiles([...files, ...base64Files]);
      onChange?.([...files, ...base64Files]); // <-- important for react-hook-form
      // setData({ [field]: [...files, ...base64Files] });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange?.(updatedFiles); // <-- important for react-hook-form
    // setData({ [field]: updatedFiles });
  };

  return (
    <div className="space-y-4">
      <div className="mt-3">
        <input
          id={`file-upload-${field}`}
          type="file"
          className="hidden"
          multiple={isMulti}
          ref={inputRef}
          onChange={handleChange}
          accept=".pdf, .jpg, .jpeg, .png"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          className="flex justify-between rounded-[6px] border-[#CBD5E1] gap-2 w-full"
        >
          Upload Files
          <Upload className="w-4 h-4" />
        </Button>
      </div>

      <div className="my-3">
        <Label className="text-[#64748B]">
          File support (PDF, PNG, JPEG, JPG)
        </Label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => {
            const isImage = file?.type?.startsWith("image/");
            return (
              <Card key={index} className="relative group border-[#E8F2F9]">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>

                <CardContent className="flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={file.base64}
                      alt={file.name}
                      className="max-h-40 object-contain rounded-md"
                    />
                  ) : (
                    <div className="flex gap-10 items-center">
                      <Image
                        src="/pdfIcon.svg"
                        alt="pdfIcon"
                        width={30}
                        height={30}
                      />
                      <div>
                        <p className="text-sm break-all">{file.name}</p>
                        <p className="text-sm break-all text-[#999999]">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
