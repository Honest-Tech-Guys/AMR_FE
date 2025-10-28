"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import useGetLatestAgreement from "@/lib/services/hooks/useGetAgrementsList";
import Link from "next/link";

const AgreementPage = () => {
  const { data: agreement, isPending, isError } = useGetLatestAgreement();

  if (isPending)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load agreement data.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6 text-green-700">
        Latest Agreement Details
      </h1>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">
            Agreement Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Tenant Name:</span>
            <span>{agreement?.tenant_name || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Start Date:</span>
            <span>
              {agreement?.start_date
                ? format(new Date(agreement.start_date), "dd MMM yyyy")
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">End Date:</span>
            <span>
              {agreement?.end_date
                ? format(new Date(agreement.end_date), "dd MMM yyyy")
                : "—"}
            </span>
          </div>

          {/* --- PDF Attachments Section --- */}
          {agreement?.attachment_urls?.length ? (
            <div className="pt-4 border-t border-gray-200">
              <h2 className="font-semibold text-gray-800 mb-2">
                Agreement Files
              </h2>
              <ul className="space-y-2">
                {agreement?.attachment_urls?.map(
                  (url: string, index: number) => (
                    <li key={index}>
                      <Link
                        href={url}
                        target="_blank"
                        className="flex items-center text-green-700 hover:underline"
                      >
                        <FileText size={18} className="mr-2" />
                        PDF File {index + 1}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 pt-3">No agreement files available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgreementPage;
