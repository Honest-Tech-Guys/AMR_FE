import React, { useState } from "react";

import { toast } from "sonner";
interface Props {
  previewDocument: any;
  isPreviewLoading: boolean;
}
const PDF = ({ previewDocument, isPreviewLoading }: Props) => {
  return (
    <div className="w-full h-[80vh] border rounded-lg overflow-hidden">
      {previewDocument && previewDocument.blobUrl && (
        <iframe
          src={previewDocument.blobUrl}
          className="w-full h-full "
          title={previewDocument.name}
          style={{ border: "none" }}
          onError={() => {
            toast.error("Failed to load PDF. Please try downloading the file.");
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
  );
};

export default PDF;
