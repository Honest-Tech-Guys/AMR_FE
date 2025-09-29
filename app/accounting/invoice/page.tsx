"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Funnel,
  Printer,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import RadioCardsDemo from "@/components/RaidoTab";
import Datatable, { Column } from "@/components/datatable";
import { ReactNode, useState } from "react";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { Separator } from "@/components/ui/separator";
import CreateInvoice from "./CreateInvoice";
const options = [
  {
    value: "Vacant",
    label: "Vacant (50)",
  },
  {
    value: "Occupied",
    label: "Occupied (32)",
  },
  {
    value: "Deactivated ",
    label: "Deactivated (24)",
  },
];
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import useGetInvoicesList from "@/lib/services/hooks/useGetInvoices";
import { Invoice } from "@/types/InvoiceType";

type invoice = {
  invoice_no: string;
  tenancy: string;
  status: string;
  p_status: string;
  bill_to: string;
  date: string;
  due_date: string;
  amount: string;
  property: string;
  action?: ReactNode;
};
interface PaginationData {
  page: number;
  per_page: number;
}

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [actionIsOpen, setActionsIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const { data, isLoading, error } = useGetInvoicesList();
  const invoiceColumns: Column<Invoice>[] = [
    {
      title: "Invoice",
      key: "invoice_number",
      sortable: true,
      className: "pl-6 py-4",
      render: (invoice) => (
        <div className="pl-4 text-primary font-medium ">
          {invoice.invoice_number ?? "-"}
        </div>
      ),
    },
    {
      title: "Tenancy",
      key: "tenancy",
      sortable: true,
      // render: (invoice) => <div>{invoice.tenancy.}</div>,
    },
    {
      title: "Status",
      key: "status",
      sortable: true,
    },
    {
      title: "P Status",
      key: "p_status",
      // render: (order) => <div>{order.p_status}</div>,
    },
    {
      title: "Bill To",
      key: "bill_to",
      // render: (order) => <div>{order.bill_to}</div>,
    },
    {
      title: "Date",
      key: "date",
      // render: (order) => <div>{order.date}</div>,
    },
    {
      title: "Due Date",
      key: "due_date",
      // render: (order) => <div>{order.due_date}</div>,
    },
    {
      title: "Amount",
      key: "amount",
      // render: (order) => <div>{order.amount ?? "-"}</div>,
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (invoice) => (
    //     <div className="flex justify-center">
    //       <Printer
    //         className="text-primary cursor-pointer"
    //         onClick={() =>
    //           generateStyledInvoicePDF({
    //             invoice_no: "AuntieMichelle-IV25002278",
    //             date: "12 March 2025",
    //             due_date: "17 March 2025",
    //             tax_rate: "0.00",
    //             customer_name: "Johnson Lim",
    //             property_address:
    //               "Sky Residence Puchong 47100\npuchong selangor",
    //             customer_info: {
    //               name: "Kee Chi Yu-E9 B-23A-12 (R4)",
    //               phone: "+60108184103",
    //               email: "keechiyu0206@gmail.com",
    //             },
    //             items: [
    //               {
    //                 name: "Rental Deposit",
    //                 qty: 1,
    //                 unit_price: "RM 500",
    //                 total: "RM 500.00",
    //               },
    //             ],
    //             sub_total: "RM 500.00",
    //             tax: "RM 0.00",
    //             total: "RM 500.00",
    //             notes: [
    //               "Lorem ipsum is a dummy text, RMxxx",
    //               "Lorem ipsum is a dummy text, RMxxx",
    //               "Lorem ipsum is a dummy text, RMxxx",
    //             ],
    //           })
    //         }
    //       />
    //     </div>
    //   ),
    // },
  ];
  const filters = [
    <InputWithIcon
      key="invoice_no"
      icon={Search}
      placeholder="Invoice Number"
    />,
    <InputWithIcon
      key="tenancy_code"
      icon={Search}
      placeholder="Tenancy Code"
    />,
    <InputWithIcon
      key="bill_to_name"
      icon={Search}
      placeholder="Bill To Name"
    />,
    <InputWithIcon
      key="property_name"
      icon={Search}
      placeholder="Property Name"
    />,
    <InputWithIcon key="date_range" icon={Calendar} placeholder="Date Range" />,
  ];

  const actionButton = (
    <Button key="search" className="rounded-[6px]">
      <Search className="size-4 text-white" strokeWidth={2.5} />
    </Button>
  );

  // Map API data to table format
  const tableData = (data || []).map((item) => ({
    id: item.id,
    invoice_number: item.invoice_number,
    issue_date: item.issue_date,
    due_date: item.due_date,
    sub_total: item.sub_total,
    total_tax: item.total_tax,
    total_amount: item.total_amount,
    status: item.status,
    notes: item.notes,
    created_at: item.created_at,
    updated_at: item.updated_at,

    // tenancy info
    tenancy_id: item.tenancy.id,
    tenancy_code: item.tenancy.code,
    tenant_name: item.tenancy.tenant?.name ?? "",
    tenant_id: item.tenancy.tenant_id,
    rental_fee: item.tenancy.rental_fee,
    tenancy_period_start_date: item.tenancy.tenancy_period_start_date,
    tenancy_period_end_date: item.tenancy.tenancy_period_end_date,
    rental_payment_frequency: item.tenancy.rental_payment_frequency,
    tenancy_remarks: item.tenancy.remarks,

    // custom fields للجدول
    p_status: "Posted",
    bill_to: item.tenancy.tenant?.name ?? "",
    amount: item.total_amount,

    // items (ممكن تكون array)
    items: item.items.map((it: any) => ({
      id: it.id,
      item_name: it.item_name,
      quantity: it.quantity,
      unit_price: it.unit_price,
      tax_percentage: it.tax_percentage,
      remarks: it.remarks,
    })),
  }));
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    unit_name: "",
    rental_type: "",
    Meter_and_lock: "",
    data_range: "",
    status: "all",
    page: "1",
    per_page: "10",
  });
  return (
    <div>
      <HeaderPage title="Invoice" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter
          filters={[
            {
              name: "property_name",
              placeholder: "Property Name",
              type: "input",
              icon: Search,
            },
            {
              name: "unit_name",
              placeholder: "Unit Name",
              type: "input",
              icon: Search,
            },
            {
              name: "rental_type",
              placeholder: "Rental Type",
              type: "select",
              selectItems: [
                { label: "whole unit", value: "Whole Unit" },
                { label: "Sublet", value: "Sublet" },
              ],
              icon: Search,
            },
            {
              name: "Meter_and_lock",
              placeholder: "Meter and Lock",
              type: "input",
              icon: Search,
            },
            {
              name: "date_range",
              placeholder: "Date Range",
              type: "date",
              icon: Calendar,
            },
          ]}
          actionButton={
            <Button
              // onClick={() => setAppliedFilters(formFilters)}
              className="text-white"
            >
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            {/* <Button className="rounded-[6px] text-white ">
              Create New Invoice
            </Button> */}
            <CreateInvoice />
          </div>
        </div>
        <Separator />
        <div className="grid w-full grid-cols-2 md:grid-cols-4 my-5">
          <div>
            <h2 className="text-xs text-gray-500">Total invoice</h2>
            <h3>RM 3,300 (3)</h3>
          </div>
          <div>
            <h2 className="text-xs text-gray-500">Total Coming Due</h2>
            <h3>RM 3,300 (3)</h3>
          </div>
          <div>
            <h2 className="text-xs text-gray-500">Total Overdue</h2>
            <h3>RM 3,300 (3)</h3>
          </div>
          <div>
            <h2 className="text-xs text-gray-500">Total Paid</h2>
            <h3>RM 3,300 (3)</h3>
          </div>
        </div>

        <Datatable<Invoice>
          columns={invoiceColumns}
          data={tableData as never}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: Invoice) => item.invoice_number}
          // isFilter={isFilter}
        />
        {error && (
          <div className="text-red-500 mt-2">Error loading properties.</div>
        )}
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

// export async function generateStyledInvoicePDF(invoice: any) {
//   const doc = new jsPDF("p", "pt", "a4");
//   let y = 40;
//   const LOGO_URL = "/logo.png";
//   // Draw logo (async if using URL)
//   if (LOGO_URL) {
//     const img = await loadImageAsBase64(LOGO_URL);
//     doc.addImage(img as string, "PNG", 50, y, 100, 60);
//   }

//   // Company Info
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "bold");
//   doc.text("Auntie Michelle Resources Sdn BHD", 170, y + 10);
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("(Business Reg - 1234567890)", 170, y + 28);
//   doc.text("Contact: +60122363030", 170, y + 44);
//   doc.text("Email: laimeesum@gmail.com", 170, y + 60);

//   // Invoice Title
//   y += 90;
//   doc.setFontSize(16);
//   doc.setFont("helvetica", "bold");
//   doc.text("Invoice Tax", 250, y);

//   // Invoice Info
//   y += 30;
//   doc.setFontSize(11);
//   doc.text("From", 50, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(
//     "No 5 Jalan SS 21/30 Damansara Utama,,\nPetaling Jaya, 47400, Selangor, Malaysia",
//     100,
//     y
//   );
//   doc.text("Invoice No", 350, y);
//   doc.setFont("helvetica", "bold");
//   doc.text(invoice.invoice_no, 430, y);
//   doc.setFont("helvetica", "normal");

//   y += 30;
//   doc.setFont("helvetica", "bold");
//   doc.text("To", 50, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(invoice.customer_name, 100, y);
//   doc.text("Date", 350, y);
//   doc.text(invoice.date, 430, y);

//   y += 18;
//   doc.setFont("helvetica", "bold");
//   doc.text("Address", 50, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(invoice.property_address, 100, y);
//   doc.text("Due Date", 350, y);
//   doc.text(invoice.due_date, 430, y);

//   y += 18;
//   doc.text("Tax Rate", 350, y);
//   doc.text(invoice.tax_rate, 430, y);

//   // Customer Info
//   y += 30;
//   doc.setFont("helvetica", "bold");
//   doc.text("Customer Info", 50, y);
//   doc.setFont("helvetica", "normal");
//   y += 16;
//   doc.text(invoice.customer_info.name, 50, y);
//   y += 14;
//   doc.text(invoice.customer_info.phone, 50, y);
//   y += 14;
//   doc.text(invoice.customer_info.email, 50, y);

//   // Table
//   y += 20;
//   autoTable(doc, {
//     startY: y,
//     head: [["#", "Item", "Qty", "Unit Price", "Total Amount"]],
//     body: invoice.items.map((item, idx) => [
//       idx + 1,
//       item.name,
//       item.qty,
//       item.unit_price,
//       item.total,
//     ]),
//     headStyles: {
//       fillColor: [240, 242, 245],
//       textColor: [100, 110, 130],
//       fontStyle: "normal",
//     },
//     bodyStyles: { textColor: [50, 60, 80] },
//     styles: { font: "helvetica", fontSize: 10 },
//     columnStyles: {
//       0: { cellWidth: 30 },
//       1: { cellWidth: 200 },
//       2: { cellWidth: 50 },
//       3: { cellWidth: 80 },
//       4: { cellWidth: 150 },
//     },
//     margin: { left: 50, right: 50 },
//   });

//   // Totals
//   let finalY = doc.lastAutoTable.finalY + 20;
//   doc.setFont("helvetica", "normal");
//   doc.text("Sub Total", 420, finalY);
//   doc.text(invoice.sub_total, 550, finalY, { align: "right" });

//   finalY += 16;
//   doc.text("Tax 6%", 420, finalY);
//   doc.text(invoice.tax, 550, finalY, { align: "right" });

//   finalY += 25;
//   doc.setFont("helvetica", "bold");
//   doc.text("Total amount:", 420, finalY);
//   doc.setFontSize(14);
//   finalY += 20;
//   doc.text(invoice.total, 420, finalY);

//   // Notes
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "bold");
//   doc.text("Notes", 50, 780);
//   doc.setFont("helvetica", "normal");
//   let notesY = 795;
//   invoice.notes.forEach((note, idx) => {
//     doc.text(`${idx + 1}. ${note}`, 50, notesY);
//     notesY += 14;
//   });

//   // Open PDF in new tab
//   const pdfUrl = doc.output("bloburl");
//   window.open(pdfUrl, "_blank");
// }

// function loadImageAsBase64(url: string) {
//   return new Promise((resolve) => {
//     const img = new window.Image();
//     img.crossOrigin = "Anonymous";
//     img.onload = function () {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0);
//       resolve(canvas.toDataURL("image/png"));
//     };
//     img.src = url;
//   });
// }

export default Page;
