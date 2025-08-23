// components/admin/PaymentsTable.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";

type Method = "QR" | "Cash";
type Status = "Pending" | "Completed" | "Failed";

type Payment = {
  id: string;
  userName: string;
  userPhone: string;
  driverName?: string;
  driverPhone?: string;
  amount: number;
  method: Method;
  status: Status;
  datetime: string; // ISO or display string
  note?: string;
};

const initial: Payment[] = [
  {
    id: "PAY001",
    userName: "Arun Kumar",
    userPhone: "9876543210",
    driverName: "Suresh",
    driverPhone: "9998887776",
    amount: 250,
    method: "QR",
    status: "Completed",
    datetime: "2025-08-11T10:12:00",
  },
  {
    id: "PAY002",
    userName: "Meena Devi",
    userPhone: "9876501234",
    driverName: "Raja",
    driverPhone: "9870012345",
    amount: 180,
    method: "Cash",
    status: "Pending",
    datetime: "2025-08-11T09:50:00",
  },
  {
    id: "PAY003",
    userName: "Kumar",
    userPhone: "9991112223",
    driverName: undefined,
    driverPhone: undefined,
    amount: 400,
    method: "QR",
    status: "Completed",
    datetime: "2025-08-10T18:20:00",
  },
];

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>(initial);
  const [q, setQ] = useState("");
  const [filterMethod, setFilterMethod] = useState<Method | "All">("All");
  const [editing, setEditing] = useState<Payment | null>(null);
  const [viewing, setViewing] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState<Payment | null>(null);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (filterMethod !== "All" && p.method !== filterMethod) return false;
      const s = `${p.id} ${p.userName} ${p.userPhone} ${p.driverName ?? ""} ${p.driverPhone ?? ""} ${p.amount}`.toLowerCase();
      return s.includes(q.toLowerCase());
    });
  }, [payments, q, filterMethod]);

  function handleSave(updated: Payment) {
    setPayments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
  }

  function handleDeleteConfirmed(id: string) {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">Payments</h2>

        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by payment id, user, driver, phone..."
            className="px-3 py-2 border rounded-md text-sm w-72"
          />

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value as Method | "All")}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="All">All Methods</option>
            <option value="QR">QR</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Payment ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Driver</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date / Time</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{p.id}</td>

                <td className="px-4 py-3">
                  <div className="font-medium">{p.userName}</div>
                  <div className="text-xs text-gray-500">{p.userPhone}</div>
                </td>

                <td className="px-4 py-3">
                  {p.driverName ? (
                    <>
                      <div className="font-medium">{p.driverName}</div>
                      <div className="text-xs text-gray-500">{p.driverPhone}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">Not assigned</div>
                  )}
                </td>

                <td className="px-4 py-3 text-right font-semibold">₹{p.amount}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.method === "QR" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.method}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : p.status === "Pending"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-4 py-3">{new Date(p.datetime).toLocaleString()}</td>

                <td className="px-4 py-3 text-center">
                  <div className="inline-flex gap-2">
                    <button onClick={() => setViewing(p)} title="View" className="p-2 rounded hover:bg-gray-100">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={() => setEditing(p)} title="Edit" className="p-2 rounded hover:bg-blue-50">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => setDeleting(p)} title="Delete" className="p-2 rounded hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewing && (
        <Modal title={`Payment ${viewing.id}`} onClose={() => setViewing(null)}>
          <div className="space-y-2">
            <div><strong>User:</strong> {viewing.userName} — {viewing.userPhone}</div>
            <div><strong>Driver:</strong> {viewing.driverName ?? "—"} {viewing.driverPhone ? `— ${viewing.driverPhone}` : ""}</div>
            <div><strong>Amount:</strong> ₹{viewing.amount}</div>
            <div><strong>Method:</strong> {viewing.method}</div>
            <div><strong>Status:</strong> {viewing.status}</div>
            <div><strong>Date:</strong> {new Date(viewing.datetime).toLocaleString()}</div>
            {viewing.note && <div><strong>Note:</strong> {viewing.note}</div>}
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editing && (
        <EditModal
          payment={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => handleSavePayment(p, setPayments)}
        />
      )}

      {/* Delete Confirm */}
      {deleting && (
        <ConfirmDelete
          payment={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => handleDeleteConfirmed(deleting.id)}
        />
      )}
    </div>
  );
}

/* ---------- Helpers & Subcomponents ---------- */

function handleSavePayment(p: Payment, setPayments: React.Dispatch<React.SetStateAction<Payment[]>>) {
  setPayments((prev) => prev.map((x) => (x.id === p.id ? p : x)));
}

function Modal({ title, onClose, children }: { title?: string; onClose: () => void; children: React.ReactNode; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-lg shadow-lg p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function EditModal({ payment, onClose, onSave }: { payment: Payment; onClose: () => void; onSave: (p: Payment) => void; }) {
  const [form, setForm] = useState<Payment>({ ...payment });

  return (
    <Modal title={`Edit ${payment.id}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600">User Name</label>
          <input value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-xs text-gray-600">User Phone</label>
          <input value={form.userPhone} onChange={(e) => setForm({ ...form, userPhone: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-xs text-gray-600">Driver Name</label>
          <input value={form.driverName ?? ""} onChange={(e) => setForm({ ...form, driverName: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-xs text-gray-600">Driver Phone</label>
          <input value={form.driverPhone ?? ""} onChange={(e) => setForm({ ...form, driverPhone: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-xs text-gray-600">Amount (₹)</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-xs text-gray-600">Method</label>
          <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as Method })} className="w-full px-3 py-2 border rounded">
            <option value="QR">QR</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="w-full px-3 py-2 border rounded">
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600">Date / Time</label>
          <input type="datetime-local" value={toInputDateTime(form.datetime)} onChange={(e) => setForm({ ...form, datetime: new Date(e.target.value).toISOString() })} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-gray-600">Note</label>
          <textarea value={form.note ?? ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
        <button onClick={() => onSave(form)} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
      </div>
    </Modal>
  );
}

function ConfirmDelete({ payment, onCancel, onConfirm }: { payment: Payment; onCancel: () => void; onConfirm: () => void; }) {
  return (
    <Modal title={`Delete ${payment.id}?`} onClose={onCancel}>
      <p className="text-sm text-gray-600">This will permanently remove the payment record.</p>
      <div className="mt-4 flex justify-end gap-3">
        <button onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>
        <button onClick={onConfirm} className="px-3 py-2 rounded bg-red-600 text-white">Delete</button>
      </div>
    </Modal>
  );
}

/* small helper to convert ISO -> input datetime-local value */
function toInputDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
