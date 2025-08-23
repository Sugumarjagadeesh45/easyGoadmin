// app/admin/settings/page.tsx
"use client";

import React, { useState } from "react";

/**
 * Admin Settings Page
 * - Mobile & Desktop tab navigation
 * - Type-safe TabType union
 */

type TabType =
  | "General"
  | "Security"
  | "Payments"
  | "Drivers"
  | "Points"
  | "Notifications"
  | "Integrations"
  | "Appearance";

const tabs: readonly TabType[] = [
  "General",
  "Security",
  "Payments",
  "Drivers",
  "Points",
  "Notifications",
  "Integrations",
  "Appearance",
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("General");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
        <p className="text-sm text-gray-500 mb-6">
          Configure app-level settings. Changes here affect users, drivers and the whole system.
        </p>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex">
          {/* Sidebar Tabs (Desktop) */}
          <aside className="w-56 border-r hidden md:block">
            <nav className="p-4 space-y-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === t
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <TabHeaderMobile tabs={tabs} active={activeTab} setActive={setActiveTab} />

            <div>
              {activeTab === "General" && <GeneralSettings />}
              {activeTab === "Security" && <SecuritySettings />}
              {activeTab === "Payments" && <PaymentsSettings />}
              {activeTab === "Drivers" && <DriversSettings />}
              {activeTab === "Points" && <PointsSettings />}
              {activeTab === "Notifications" && <NotificationsSettings />}
              {activeTab === "Integrations" && <IntegrationsSettings />}
              {activeTab === "Appearance" && <AppearanceSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile Header for Tabs ---------- */
function TabHeaderMobile({
  tabs,
  active,
  setActive,
}: {
  tabs: readonly TabType[];
  active: TabType;
  setActive: (t: TabType) => void;
}) {
  return (
    <div className="md:hidden mb-4">
      <select
        value={active}
        onChange={(e) => setActive(e.target.value as TabType)}
        className="w-full border px-3 py-2 rounded"
      >
        {tabs.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------ Save Button Row ------------------ */
function SaveRow({ onSave }: { onSave: () => Promise<void> | void }) {
  const [saving, setSaving] = useState(false);
  async function doSave() {
    setSaving(true);
    try {
      await onSave();
      // add toast here if needed
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button onClick={() => {}} className="px-3 py-2 border rounded">
        Reset
      </button>
      <button
        onClick={doSave}
        className={`px-4 py-2 rounded ${saving ? "bg-indigo-400" : "bg-indigo-600"} text-white`}
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}

/* ------------------ Individual Tab Components ------------------ */
function GeneralSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">General Settings</h2>
      <p className="text-sm text-gray-500 mb-4">Manage general system preferences.</p>
      <SaveRow onSave={() => console.log("Saved General")} />
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
      <p className="text-sm text-gray-500 mb-4">Manage passwords, 2FA, and security alerts.</p>
      <SaveRow onSave={() => console.log("Saved Security")} />
    </div>
  );
}

function PaymentsSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Payments Settings</h2>
      <p className="text-sm text-gray-500 mb-4">Configure payment methods and gateways.</p>
      <SaveRow onSave={() => console.log("Saved Payments")} />
    </div>
  );
}

function DriversSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Drivers Settings</h2>
      <p className="text-sm text-gray-500 mb-4">Manage driver preferences and rules.</p>
      <SaveRow onSave={() => console.log("Saved Drivers")} />
    </div>
  );
}

function PointsSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Points Settings</h2>
      <p className="text-sm text-gray-500 mb-4">Configure loyalty points system.</p>
      <SaveRow onSave={() => console.log("Saved Points")} />
    </div>
  );
}

function NotificationsSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Notifications Settings</h2>
      <p className="text-sm text-gray-500 mb-4">Manage email, SMS, and push notifications.</p>
      <SaveRow onSave={() => console.log("Saved Notifications")} />
    </div>
  );
}

function IntegrationsSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Integrations Settings</h2>
      <p className="text-sm text-gray-500 mb-4">Set up third-party integrations.</p>
      <SaveRow onSave={() => console.log("Saved Integrations")} />
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Appearance Settings</h2>
      <p className="text-sm text-gray-500 mb-4">Adjust theme, branding, and layout.</p>
      <SaveRow onSave={() => console.log("Saved Appearance")} />
    </div>
  );
}
