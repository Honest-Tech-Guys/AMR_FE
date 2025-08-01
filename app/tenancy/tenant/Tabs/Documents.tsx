import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

const DocumentsTap = () => {
  return (
    <div>
      <div>
        <p>Private Document</p>
        <div className="flex flex-col bg-gray-100 gap-3 py-5 items-center">
          <span className="text-xs">
            Click of drag file to this area to upload
          </span>
          <Button className="text-white">
            <Plus />
            Add Document
          </Button>
        </div>
      </div>
      <div>
        <p>Shared Document</p>
        <div className="flex flex-col bg-gray-100 gap-3 py-5 items-center">
          <span className="text-xs">
            Click of drag file to this area to upload
          </span>
          <Button className="text-white">
            <Plus />
            Add Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTap;
