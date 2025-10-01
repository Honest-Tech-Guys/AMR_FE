"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicTap from "./Tabs/Basic";
import { Tenancy } from "@/types/TenancyType";
import { AgreementType } from "@/types/AgreementType";
import { useState } from "react";

import { toast } from "sonner";
import PDF from "./Tabs/PDF";
import Logs from "./Tabs/Logs";
const tabItems = [
  { label: "Basic", value: "basic" },
  { label: "Preview PDF", value: "pdf" },
  { label: "Audit Logs", value: "logs" },
];
interface Props {
  open: boolean;
  onChangeOpen: (X: boolean) => void;
  id: number;
  initialData: AgreementType;
}
const ViewAgreement = ({ id, initialData, onChangeOpen, open }: Props) => {
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
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
  const handlePreview = async (document: any) => {
    setIsPreviewLoading(true);

    try {
      const response = await createAuthenticatedFetch(document.url);
      if (!response) {
        toast.error("Failed to load PDF. Please check your authentication.");
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
    } finally {
      setIsPreviewLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className="md:max-w-[1000px] bg-white z-[200] md:p-10 h-[95vh] overflow-y-auto">
        <DialogHeader>
          <h2 className="text-2xl font-bold">View Agreement</h2>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="gap-4 bg-transparent flex-wrap">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className=" cursor-pointer data-[state=active]:bg-primary rounded-[6px] data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="basic">
            <BasicTap id={id} initialData={initialData} />
          </TabsContent>
          <TabsContent
            value="pdf"
            onClick={() => {
              handlePreview(initialData.attachments[0]);
            }}
          >
            <PDF
              isPreviewLoading={isPreviewLoading}
              previewDocument={previewDocument}
            />
          </TabsContent>
          <TabsContent value="logs">
            <Logs />
          </TabsContent>
          {/* Placeholder for other tab contents if needed later */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAgreement;
