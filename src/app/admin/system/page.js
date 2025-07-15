// src/app/admin/system/page.js

import React from "react";
import { ShieldCheck } from "lucide-react";

export default function SystemSettingsPage() {
  return (
    <section>
      <div className="flex items-center gap-4">
        <ShieldCheck className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
          <p className="mt-1 text-gray-600">
            Configure global settings for the application.
          </p>
        </div>
      </div>

      <div className="mt-8 flex h-96 items-center justify-center rounded-lg border bg-white shadow-sm">
        <p className="text-center text-gray-500">
          Forms for API keys, feature flags, and other system-level
          configurations will be implemented here.
        </p>
      </div>
    </section>
  );
}
