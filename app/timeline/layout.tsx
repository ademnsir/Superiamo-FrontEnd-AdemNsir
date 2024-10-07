import DashboardNavbar from "@/components/dashboardNavbar";

export default async function Layout({ children }: { children: any }) {
  return (
    <main className="flex w-full justify-center items-center">
      <DashboardNavbar />
      <div className="flex flex-col w-full justify-center items-center">
        {children}
      </div>
    </main>
  );
}