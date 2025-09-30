"use client";

import { Button } from "@/components/ui/button";
import { Tenancy } from "@/types/TenancyType";
import { Plus, Upload, Download, Trash2, Eye, FileText, X } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MultiFileUpload, { toBase64 } from "@/components/input-11";
import { FileData } from "@/types/FileData";
import DragAndDropFiles from "@/components/input-12";
import useCreateTenancyDocument from "@/lib/services/hooks/useCreateTenancyDocument";
import useGetTenancyList from "@/lib/services/hooks/useGetTenancyList";
import { fileDataToFileList } from "../CreateAgreement";

interface Props {
  tenancy: Tenancy;
}

interface DocumentFormData {
  privateFiles?: FileData[];
  sharedFiles?: FileData[];
}

const schema = yup.object({
  // type: yup
  //   .string()
  //   .oneOf(["Private", "Shared"])
  //   .required("Document type is required"),
  privateFiles: yup.array().min(1, "At least one file is required").optional(),
  sharedFiles: yup.array().min(1, "At least one file is required").optional(),
});

const DocumentsTap = ({ tenancy }: Props) => {
  console.log(tenancy.documents.filter((doc) => doc.type === "Private").length);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [documentType, setDocumentType] = useState<"Private" | "Shared">(
    "Private"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const form = useForm({
    // resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const { mutate, isPending } = useCreateTenancyDocument(tenancy.id);
  const { refetch } = useGetTenancyList();
  const onSubmit = async (data: DocumentFormData) => {
    const private_documents = data.privateFiles
      ? fileDataToFileList((data.privateFiles || []) as FileData[])
      : undefined;
    const shared_documents = data.sharedFiles
      ? fileDataToFileList((data.sharedFiles || []) as FileData[])
      : undefined;
    const payload = {
      private_documents: private_documents,
      shared_documents: shared_documents,
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Rental agreement created successfully!");
        reset();
        refetch();
      },
      onError: (err) => {
        toast.error((err as any)?.message || "Failed to create agreement");
      },
    });
  };

  // Helper function to get authentication token
  const getAuthToken = () => {
    // Try different token storage methods
    return (
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      ""
    );
  };

  // Helper function to create authenticated fetch request for downloads
  const createAuthenticatedFetch = async (url: string) => {
    const token = getAuthToken();
    if (!token) {
      console.warn("No authentication token found");
      return null;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf, application/octet-stream, */*",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("Failed to fetch document:", error);
      return null;
    }
  };

  const handleDownload = async (document: any) => {
    try {
      const response = await createAuthenticatedFetch(document.url);

      if (!response) {
        toast.error(
          "Failed to download document. Please check your authentication."
        );
        return;
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = document.file_name || document.name;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document. Please try again.");
    }
  };

  const handleDelete = (documentId: number) => {
    // TODO: Implement actual delete functionality
    toast.success("Document deleted successfully");
  };

  const handlePreview = async (document: any) => {
    setIsPreviewLoading(true);
    setIsPreviewOpen(true);

    try {
      const response = await createAuthenticatedFetch(document.url);

      if (!response) {
        toast.error("Failed to load PDF. Please check your authentication.");
        setIsPreviewOpen(false);
        return;
      }

      // Create blob from response
      const blob = await response.blob();

      // Create object URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      setPreviewDocument({
        ...document,
        blobUrl,
      });
    } catch (error) {
      console.error("Preview failed:", error);
      toast.error(
        "Failed to load PDF. Please try downloading the file instead."
      );
      setIsPreviewOpen(false);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const closePreview = () => {
    // Clean up blob URL to prevent memory leaks
    if (previewDocument?.blobUrl) {
      window.URL.revokeObjectURL(previewDocument.blobUrl);
    }
    setPreviewDocument(null);
    setIsPreviewOpen(false);
    setIsPreviewLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string, type: string) => {
    const fileExtension = fileName.toLowerCase().split(".").pop();

    if (fileExtension === "pdf" || type.includes("pdf")) return "📄";
    if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png" ||
      fileExtension === "gif" ||
      type.includes("image")
    )
      return "🖼️";
    if (
      fileExtension === "doc" ||
      fileExtension === "docx" ||
      type.includes("word") ||
      type.includes("document")
    )
      return "📝";
    if (
      fileExtension === "xls" ||
      fileExtension === "xlsx" ||
      type.includes("excel") ||
      type.includes("spreadsheet")
    )
      return "📊";
    if (fileExtension === "txt" || type.includes("text")) return "📄";
    return "📁";
  };

  const isPdfFile = (fileName: string, type: string) => {
    const fileExtension = fileName.toLowerCase().split(".").pop();
    return fileExtension === "pdf" || type.includes("pdf");
  };
  console.log(errors);
  return (
    <div className="space-y-6">
      {/* PDF Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] z-200 overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="truncate">
              {previewDocument?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full h-[80vh] border rounded-lg overflow-hidden">
            {previewDocument && previewDocument.blobUrl && (
              <iframe
                src={previewDocument.blobUrl}
                className="w-full h-full "
                title={previewDocument.name}
                style={{ border: "none" }}
                onError={() => {
                  toast.error(
                    "Failed to load PDF. Please try downloading the file."
                  );
                }}
                onLoad={() => {
                  console.log("PDF loaded successfully");
                }}
              />
            )}
            {isPreviewLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Private Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Private Documents</h3>
            <Badge variant="secondary">
              {tenancy.documents.filter((doc) => doc.type === "Private").length}{" "}
              files
            </Badge>
          </div>
          <DragAndDropFiles
            label=""
            description={
              isPending ? "...Uploading" : "Drag & drop or click to upload"
            }
            value={[]}
            onChange={(files) => {
              mutate(
                {
                  type: "Private",
                  document: fileDataToFileList(files as unknown as FileData[]),
                },
                {
                  onSuccess: () => {
                    toast.success("Private Files successfully!");
                    reset();
                    refetch();
                  },
                  onError: (err) => {
                    toast.error(
                      (err as any)?.message || "Failed to Upload Private Files"
                    );
                  },
                }
              );
            }}
            isMulti={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenancy.documents
              .filter((doc) => doc.type === "Private")
              .map((document) => {
                console.log(document);
                return (
                  <div
                    key={document.id}
                    className=" hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="w-full gap-3 flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {getFileIcon(document.file_name, document.type)}
                          </span>
                          <div>
                            <h4
                              className="font-medium text-sm truncate"
                              title={document.name}
                            >
                              {document.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(document.file_size)}
                            </p>
                          </div>
                        </div>
                        <div className=" flex space-y-1 text-xs text-gray-500">
                          <p>Uploaded: {formatDate(document.created_at)}</p>
                        </div>
                        <div className="flex gap-1">
                          {isPdfFile(document.file_name, document.type) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePreview(document)}
                              className="h-8 w-8 p-0"
                              title="Preview PDF"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(document.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Shared Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Shared Documents</h3>
            <Badge variant="secondary">
              {tenancy.documents.filter((doc) => doc.type === "Shared").length}{" "}
              files
            </Badge>
          </div>
          <DragAndDropFiles
            label=""
            description={
              isPending ? "...Uploading" : "Drag & drop or click to upload"
            }
            value={[]}
            onChange={(files) => {
              mutate(
                {
                  type: "Shared",
                  document: fileDataToFileList(files as unknown as FileData[]),
                },
                {
                  onSuccess: () => {
                    toast.success("Upload Shared Files successfully!");
                    reset();
                    refetch();
                  },
                  onError: (err) => {
                    toast.error(
                      (err as any)?.message || "Failed to Upload Shared Files"
                    );
                  },
                }
              );
            }}
            isMulti={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenancy.documents
              .filter((doc) => doc.type === "Shared")
              .map((document) => (
                <div
                  key={document.id}
                  className=" hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="w-full gap-3 flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getFileIcon(document.file_name, document.type)}
                        </span>
                        <div>
                          <h4
                            className="font-medium text-sm truncate"
                            title={document.name}
                          >
                            {document.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(document.file_size)}
                          </p>
                        </div>
                      </div>
                      <div className=" flex space-y-1 text-xs text-gray-500">
                        <p>Uploaded: {formatDate(document.created_at)}</p>
                      </div>
                      <div className="flex gap-1">
                        {isPdfFile(document.file_name, document.type) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePreview(document)}
                            className="h-8 w-8 p-0"
                            title="Preview PDF"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(document.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentsTap;
