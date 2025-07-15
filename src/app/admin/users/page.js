// src/app/admin/users/page.js

import React from "react";
import { Users } from "lucide-react";

export default function UserManagementPage() {
  return (
    <section>
      <div className="flex items-center gap-4">
        <Users className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="mt-1 text-gray-600">
            View, edit, and manage all application users.
          </p>
        </div>
      </div>

      <div className="mt-8 flex h-96 items-center justify-center rounded-lg border bg-white shadow-sm">
        <p className="text-center text-gray-500">
          User data table with search, filter, and action buttons will be
          implemented here.
        </p>
      </div>
    </section>
  );
}