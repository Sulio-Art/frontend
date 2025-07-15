// src/app/admin/layout.js

import { Sidebar } from "@/components/Dashboard/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        {/* The content from your page.js files will be rendered here */}
        {children}
      </main>
    </div>
  );
}