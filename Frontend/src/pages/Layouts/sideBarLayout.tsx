import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
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
        <AppSidebar className="h-full border-r" />
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
