'use client';

import Link from 'next/link';

export default function CustomersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Link
          href="/customers/new"
          className="px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition-colors"
        >
          Nouveau client
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <p className="text-gray-500">Aucun client pour le moment.</p>
      </div>
    </div>
  );
}
