import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Footer from "../Footer/Footer";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-svh flex">
      <div className="flex h-full w-full flex-col md:flex-row">
        {/* Full-height sidebar from top:0, no header */}
        <AppSidebar className="h-full border-r" />

        {/* Main layout: header + content only */}
        <SidebarInset className="flex flex-1 flex-col">
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          <div className="p-3">
            <Footer />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
