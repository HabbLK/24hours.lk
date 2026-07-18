import Link from "next/link";
import { Lock } from "lucide-react";

export default function AccountAuthGate({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-mist px-4">
      <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full animate-fade-in-up">
        <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-brand-red" />
        </div>
        <h1 className="text-xl font-bold text-brand-ink mb-6">{message}</h1>
        <Link
          href="/login"
          className="inline-block w-full px-6 py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-brand-red/25"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
