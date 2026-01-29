'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  todayRevenue: number;
  todayTransactions: number;
  totalCustomers: number;
  monthRevenue: number;
}

export default function DashboardPage() {
  const [stats] = useState<DashboardStats>({
    todayRevenue: 0,
    todayTransactions: 0,
    totalCustomers: 0,
    monthRevenue: 0,
  });
  const [user, setUser] = useState<{ firstName: string; lastName: string; organizationName: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const statCards = [
    { label: "CA aujourd'hui", value: `${stats.todayRevenue.toFixed(2)} €`, color: 'bg-gold-500' },
    { label: "Transactions aujourd'hui", value: stats.todayTransactions.toString(), color: 'bg-green-500' },
    { label: 'Clients', value: stats.totalCustomers.toString(), color: 'bg-blue-500' },
    { label: 'CA du mois', value: `${stats.monthRevenue.toFixed(2)} €`, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour{user ? `, ${user.firstName}` : ''} 👋
        </h1>
        {user && <p className="text-gray-500">{user.organizationName}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className={`w-10 h-10 ${stat.color} rounded-lg mb-3`} />
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Transactions récentes</h2>
          <p className="text-gray-500 text-sm">Aucune transaction récente</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Cours des métaux</h2>
          <p className="text-gray-500 text-sm">Chargement des cours...</p>
        </div>
      </div>
    </div>
  );
}
