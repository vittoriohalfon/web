import { TenderDashboard } from "@/components/TenderDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tender Dashboard",
  description: "View and manage your tenders",
};

export default function DashboardPage() {
  return <TenderDashboard />;
}
