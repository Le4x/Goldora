'use client';

import { useState } from 'react';
import { PURITY_MAP } from '@goldora/types';

type MetalType = 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';

interface TransactionItem {
  metalType: MetalType;
  weightGrams: string;
  purity: string;
  description: string;
}

const metalLabels: Record<MetalType, string> = {
  GOLD: 'Or',
  SILVER: 'Argent',
  PLATINUM: 'Platine',
  PALLADIUM: 'Palladium',
};

export default function NewTransactionPage() {
  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<TransactionItem[]>([
    { metalType: 'GOLD', weightGrams: '', purity: '18K', description: '' },
  ]);

  const addItem = () => {
    setItems([...items, { metalType: 'GOLD', weightGrams: '', purity: '18K', description: '' }]);
  };

  const updateItem = (index: number, field: keyof TransactionItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nouvelle transaction</h1>

      {/* Steps indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-gold-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">1. Identification du client</h2>
          <div>
            <label htmlFor="customer-search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher un client
            </label>
            <input
              id="customer-search"
              type="text"
              placeholder="Nom, prénom ou email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Glissez une photo de carte d&apos;identité ici</p>
            <p className="text-sm text-gray-400 mt-1">ou cliquez pour sélectionner un fichier</p>
          </div>
          <button
            onClick={() => setStep(2)}
            className="px-6 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600"
          >
            Suivant
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">2. Détails des métaux</h2>
          {items.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Article {i + 1}</span>
                {items.length > 1 && (
                  <button onClick={() => removeItem(i)} className="text-red-500 text-sm hover:underline">
                    Supprimer
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Métal</label>
                  <select
                    value={item.metalType}
                    onChange={(e) => updateItem(i, 'metalType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {Object.entries(metalLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pureté</label>
                  <select
                    value={item.purity}
                    onChange={(e) => updateItem(i, 'purity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {Object.keys(PURITY_MAP[item.metalType] || {}).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poids (g)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={item.weightGrams}
                    onChange={(e) => updateItem(i, 'weightGrams', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(i, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ex: Bracelet 18K"
                  />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addItem} className="text-gold-600 text-sm font-medium hover:underline">
            + Ajouter un article
          </button>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-2 border border-gray-300 rounded-lg">
              Retour
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600"
            >
              Calculer le prix
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">3. Récapitulatif & Validation</h2>
          <div className="border border-gray-200 rounded-lg p-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span>
                  {metalLabels[item.metalType]} - {item.purity} - {item.weightGrams}g
                  {item.description && ` (${item.description})`}
                </span>
                <span className="font-semibold">-- €</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-2 border-t border-gray-300">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg text-gold-600">-- €</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="px-6 py-2 border border-gray-300 rounded-lg">
              Retour
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
              Valider la transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
