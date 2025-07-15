import { Sidebar } from "@/components/Dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
   
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}