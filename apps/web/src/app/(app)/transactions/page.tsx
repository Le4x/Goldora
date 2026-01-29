'use client';

import Link from 'next/link';

export default function TransactionsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Link
          href="/transactions/new"
          className="px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition-colors"
        >
          Nouvelle transaction
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <p className="text-gray-500">Aucune transaction pour le moment.</p>
        </div>
      </div>
    </div>
  );
}
