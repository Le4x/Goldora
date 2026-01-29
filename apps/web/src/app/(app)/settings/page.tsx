'use client';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Informations agence</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;agence</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <button className="px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600">
            Enregistrer
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Marges par métal</h2>
          {['Or', 'Argent', 'Platine', 'Palladium'].map((metal) => (
            <div key={metal} className="flex items-center gap-3">
              <label className="w-24 text-sm font-medium text-gray-700">{metal}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="5.0"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          ))}
          <button className="px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600">
            Enregistrer les marges
          </button>
        </div>
      </div>
    </div>
  );
}
