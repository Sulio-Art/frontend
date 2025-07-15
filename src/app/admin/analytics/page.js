// src/app/admin/analytics/page.js

import React from "react";
import { BarChart2 } from "lucide-react";

export default function AppAnalyticsPage() {
  return (
    <section>
      <div className="flex items-center gap-4">
        <BarChart2 className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">App Analytics</h1>
          <p className="mt-1 text-gray-600">
            Monitor application performance and user engagement.
          </p>
        </div>
      </div>

      <div className="mt-8 flex h-96 items-center justify-center rounded-lg border bg-white shadow-sm">
        <p className="text-center text-gray-500">
          Charts, graphs, and data visualizations for app analytics will be
          implemented here.
        </p>
      </div>
    </section>
  );
}
