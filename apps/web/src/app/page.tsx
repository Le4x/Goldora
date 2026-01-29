import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          <span className="text-gold-500">Gold</span>Ora
        </h1>
        <p className="text-xl text-gray-300 max-w-md">
          Logiciel de gestion d&apos;achat de métaux précieux
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-gold-500 text-gold-500 rounded-lg font-semibold hover:bg-gold-500/10 transition-colors"
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </div>
  );
}
